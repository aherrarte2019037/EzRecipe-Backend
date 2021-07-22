'use strict'
const express = require("express")
const userController = require('../controllers/user.controllers')
const md_authentication = require('../middlewares/authenticated')

var api = express.Router()

api.get('/profileImg/:id', userController.getProfileImage);
api.get('/getRegisteredUsers', md_authentication.ensureAuth, userController.getRegisteredUsers);
api.post('/login', userController.login);
api.post('/register', userController.register);
api.post('/login/social', userController.socialLogin);
api.post('/profileImg/:id', md_authentication.ensureAuth, userController.uploadProfileImage);
api.put('/editUser/:idUser',md_authentication.ensureAuth,userController.editUser);
api.get('/getChefRequests', md_authentication.ensureAuth, userController.chefRequests);

module.exports = api;