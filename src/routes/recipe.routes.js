'use strict';

const express = require("express")
const recipeController = require('../controllers/recipe.controllers')
const md_authentication = require('../middlewares/authenticated')

var api = express.Router()

api.post('/addRecipe',md_authentication.ensureAuth,recipeController.createRecipe);
api.get('/getRecipe',md_authentication.ensureAuth,recipeController.getRecipe);
api.get('/getMyRecipes', md_authentication.ensureAuth, recipeController.getMyRecipes);
api.get('/latestRecipes', md_authentication.ensureAuth, recipeController.latestRecipes);
api.put('/giveLikes/:idRecipe', md_authentication.ensureAuth, recipeController.giveLikes);

module.exports = api;