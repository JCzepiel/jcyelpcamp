const User = require('../models/user')

module.exports.renderLogin = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/campgrounds');
    }
    res.render('users/login')
}

module.exports.renderRegister = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/campgrounds');
    }
    res.render('users/register')
}

module.exports.createUser = async (req, res) => {
    const { username, password, email } = req.body.user

    const user = new User({ username, email })

    try {
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, err => {
            if (err) return next(error)
            req.flash('success', 'Welcome to YelpCamp!')
            res.redirect('/campgrounds')
        })
    } catch (error) {
        req.flash('error', error.message)
        return res.redirect('/users/register')
    }
}

module.exports.loginUser = (req, res) => {
    req.flash('success', 'Welcome back!')
    const redirectUrl = req.session.returnTo || '/campgrounds'
    delete req.session.returnTo
    res.redirect(redirectUrl)
}

module.exports.logoutUser = (req, res) => {
    req.logout()
    req.flash('success', 'Logged Out successfully!')
    res.redirect('/campgrounds')
}