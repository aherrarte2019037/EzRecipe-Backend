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
api.get('/addThreeCoins', md_authentication.ensureAuth, userController.addThreeCoins);
api.put('/followUser/:idUser', md_authentication.ensureAuth, userController.followUser);
api.get('/getUserLogged', md_authentication.ensureAuth, userController.getUserLogged);
api.put('/purchasedRecipes/:purchasedRecipes', md_authentication.ensureAuth, userController.purchasedRecipes);
api.get('/petitionChefRequest',md_authentication.ensureAuth,userController.petitionChefRequest);
api.get('/confirmChefRequest/:idUser', md_authentication.ensureAuth, userController.confirmChefRequest);
api.get('/cancelChefRequest/:idUser', md_authentication.ensureAuth, userController.cancelChefRequest);
api.get('/getUserID/:username', md_authentication.ensureAuth, userController.getUserUsername)

module.exports = api;