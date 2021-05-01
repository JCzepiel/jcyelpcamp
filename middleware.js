const session = require('express-session')

const Campground = require('./models/campground')
const Review = require('./models/review')
const { campgroundSchema, reviewSchema } = require('./schemas')

const ExpressError = require('./utils/ExpressError')

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in!')
        return res.redirect('/users/login')
    }
    next()
}

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body)

    if (error) {
        const message = error.details.map(el => el.message).join(',')
        throw new ExpressError(message, 400)
    } else {
        next()
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params
    const camp = await Campground.findById(id)

    if (!camp.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do this!')
        return res.redirect(`/campgrounds/${id}`)
    }

    next()
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)

    if (error) {
        const message = error.details.map(el => el.message).join(',')
        throw new ExpressError(message, 400)
    } else {
        next()
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewid } = req.params
    const review = await Review.findById(reviewid)

    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do this!')
        return res.redirect(`/campgrounds/${id}`)
    }

    next()
}