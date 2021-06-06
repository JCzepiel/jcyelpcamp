const express = require('express')
const router = express.Router()

const catchAsync = require('../utils/catchAsync')
const landmarksController = require('../controllers/landmarks')

router.route('/')
    .get(catchAsync(landmarksController.index))

router.route('/:stateName')
    .get(catchAsync(landmarksController.stateLandmarks))

router.route('/:stateName/:id')
    .get(catchAsync(landmarksController.specificLandmark))

module.exports = router