const Campground = require('../models/campground')
const Review = require('../models/review')

module.exports.createReview = async (req, res) => {
    const newReview = new Review(req.body.review)
    newReview.author = req.user._id
    const camp = await Campground.findById(req.params.id)
    camp.reviews.push(newReview)

    await newReview.save()
    await camp.save()

    req.flash('success', 'Successfully made a new review!')

    res.redirect(`/campgrounds/${camp._id}`)
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(req.params.reviewid)
    req.flash('success', 'Successfully deleted a review!')
    res.redirect(`/campgrounds/${id}`)
}