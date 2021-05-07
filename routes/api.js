const express = require('express')
const multer = require('multer')

const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const apiController = require('../controllers/api')
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware')
const { storage } = require('../cloudinary')

const router = express.Router()

const upload = multer({ storage })

router.route('/index')
    .get(apiController.getAllCampgrounds) // get all campgrounds
    .post(/*isLoggedIn, */upload.array('image'), /*validateCampground,*/ apiController.addNewCampground) // post new campground

router.route('/:id')
    .get(apiController.getCampground) //get specific campground
    .put(/*isLoggedIn, isAuthor, */upload.array('image'), /*validateCampground,*/ apiController.updateCampground) // update specific campground
    .delete(/*isLoggedIn, isAuthor, */apiController.deleteCampground) // delete specific campground

router.all('*', catchAsync(async (req, res, next) => {
    next(new ExpressError('Incorrect endpoint', 404))
}))

module.exports = router