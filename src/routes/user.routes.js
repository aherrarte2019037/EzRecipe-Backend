'use strict'
const express = require("express")
const userController = require('../controllers/user.controllers')
const md_authentication = require('../middlewares/authenticated')

var api = express.Router()

api.post('/login', userController.login);
api.post('/register', userController.register);
api.post('/login/social', userController.socialLogin);

module.exports = api;