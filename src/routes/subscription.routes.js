'use strict'

const express = require("express")
const subController = require('../controllers/subscription.controller');
const md_authentication = require('../middlewares/authenticated')

var api = express.Router()

api.get('/assignSubChef',md_authentication.ensureAuth,subController.assignSubChef);

module.exports = api;