const express = require('express')
const passport = require('passport')
const catchAsync = require('../utils/catchAsync')

const usersController = require('../controllers/users')

const router = express.Router()

router.route('/register')
    .get(usersController.renderRegister)
    .post(catchAsync(usersController.createUser))

router.route('/login')
    .get(usersController.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/users/login' }), usersController.loginUser)

router.get('/logout', usersController.logoutUser)

module.exports = router