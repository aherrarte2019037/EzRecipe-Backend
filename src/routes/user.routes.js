'use strict'
const express = require("express")
const userController = require('../controllers/user.controllers')
const md_authentication = require('../middlewares/authenticated')

var api = express.Router()

api.post('/login', userController.login);

module.exports = api;