// Grab express to set up the router
const express = require('express')
// We want the router to set up the routes
const router = express.Router()

// A common util to catch errors in async methods
const catchAsync = require('../utils/catchAsync')
// Our controller for landmarks we will send requests to
const landmarksController = require('../controllers/landmarks')

// Looks like http://localhost:3000/landmarks
router.route('/')
    .get(catchAsync(landmarksController.allStates))

// Looks like http://localhost:3000/landmarks/Pennsylvania
router.route('/:stateName')
    .get(catchAsync(landmarksController.stateLandmarks))

// Looks like http://localhost:3000/landmarks/Pennsylvania/60bc507b82492a3b6c7b84fb
router.route('/:stateName/:id')
    .get(catchAsync(landmarksController.specificLandmark))

// Give the router to anyone who wants it
module.exports = router