if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const databaseURL = process.env.MONGO_DB_URL || 'mongodb://localhost:27017/yelp-camp'

const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const passportLocal = require('passport-local')
const morgan = require('morgan')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const MongoStore = require('connect-mongo')
const favicon = require('serve-favicon')

const ExpressError = require('./utils/ExpressError')

const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')
const userRoutes = require('./routes/users')
const apiRoutes = require('./routes/api')
const landmarkRoutes = require('./routes/landmarks')

const User = require('./models/user')

mongoose.connect(databaseURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

const db = mongoose.connection
db.on('error', console.error.bind(console, "connection error:"))
db.once('open', () => {
    console.log(`-app.js: Database connected at ${databaseURL}...`)
})

const app = express()
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')))
app.use(methodOverride('_method'))
app.use((express.urlencoded({ extended: true })))
app.use(morgan('tiny'))
app.use(flash())
app.use(mongoSanitize())
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')))

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://unpkg.com",
    "https://ajax.googleapis.com"
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net"
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
    "https://docs.mapbox.com/"
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "http://res.cloudinary.com/drt7rlp98/",
                "http://images.unsplash.com/",
                "https://res.cloudinary.com/drt7rlp98/",
                "https://images.unsplash.com/",
                "https://en.wikipedia.org/wiki/",
                "https://upload.wikimedia.org/",
                "https://commons.wikimedia.org/"
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

const sessionSecret = process.env.SESSION_SECRET || 'thishsouldbechangedlater'

const store = new MongoStore({
    mongoUrl: databaseURL,
    secret: sessionSecret,
    touchAfter: 24 * 60 * 60
})

const sessionConfig = {
    name: 'ghKLF224er24rfzxc9g',
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        // secure: true,
        httpOnly: true
    },
    store: store
}
app.use(session(sessionConfig))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new passportLocal(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.engine('ejs', ejsMate)

app.use((req, res, next) => {
    if (!['/users/login', '/', '/users/register'].includes(req.originalUrl)) {
        req.session.returnTo = req.originalUrl
    }

    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    res.locals.currentPath = req.path
    next()
})

app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)
app.use('/users', userRoutes)
app.use('/api', apiRoutes)
app.use('/landmarks', landmarkRoutes)

app.get('/', (req, res) => {
    res.render('home')
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message) err.message = 'Something went wrong!'
    res.status(statusCode).render('error', { err })
})

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
})