const express = require('express')
const router = express.Router()
const multer = require('multer')

const catchAsync = require('../utils/catchAsync')
const campgroundsController = require('../controllers/campgrounds')

const { isLoggedIn, isAuthor, validateCampground } = require('../middleware')
const { storage } = require('../cloudinary')

const upload = multer({ storage })

router.route('/')
    .get(catchAsync(campgroundsController.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgroundsController.createCampground))

router.get('/new', isLoggedIn, campgroundsController.renderNewForm)

router.route('/:id')
    .get(catchAsync(campgroundsController.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgroundsController.editCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgroundsController.deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgroundsController.renderEditForm))


module.exports = router