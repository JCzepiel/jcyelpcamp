const express = require('express')
const router = express.Router({ mergeParams: true })

const reviewsController = require('../controllers/reviews')

const catchAsync = require('../utils/catchAsync')

const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')

router.post('/', isLoggedIn, validateReview, catchAsync(reviewsController.createReview))

router.delete('/:reviewid', isLoggedIn, isReviewAuthor, catchAsync(reviewsController.deleteReview))

module.exports = router