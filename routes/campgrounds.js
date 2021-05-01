const express = require('express')
const router = express.Router()

const catchAsync = require('../utils/catchAsync')
const campgroundsController = require('../controllers/campgrounds')

const { isLoggedIn, isAuthor, validateCampground } = require('../middleware')

router.route('/')
    .get(catchAsync(campgroundsController.index))
    .post(isLoggedIn, validateCampground, catchAsync(campgroundsController.createCampground))

router.get('/new', isLoggedIn, campgroundsController.renderNewForm)

router.route('/:id')
    .get(catchAsync(campgroundsController.showCampground))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgroundsController.editCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgroundsController.deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgroundsController.renderEditForm))


module.exports = router