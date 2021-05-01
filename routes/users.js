const express = require('express')
const passport = require('passport')
const catchAsync = require('../utils/catchAsync')

const usersController = require('../controllers/users')

const router = express.Router()
router.get('/login', usersController.renderLogin)

router.get('/register', usersController.renderRegister)

router.post('/register', catchAsync(usersController.createUser))

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/users/login' }), usersController.loginUser)

router.get('/logout', usersController.logoutUser)

module.exports = router