'use strict';

const express = require("express")
const recipeController = require('../controllers/recipe.controllers')
const md_authentication = require('../middlewares/authenticated')

var api = express.Router()

api.post('/addRecipe',md_authentication.ensureAuth,recipeController.createRecipe);
api.get('/getRecipe',md_authentication.ensureAuth,recipeController.getRecipe);
api.get('/getMyRecipes', md_authentication.ensureAuth, recipeController.getMyRecipes);
api.get('/latestRecipes', md_authentication.ensureAuth, recipeController.latestRecipes);
api.get('/giveLikes/:idRecipe', md_authentication.ensureAuth, recipeController.giveLikes);
api.get('/getRecipesIdPublisher/:userId', md_authentication.ensureAuth, recipeController.getRecipesIdPublisher);
api.put('/saveRecipe/:idRecipe', md_authentication.ensureAuth, recipeController.saveRecipe)

module.exports = api;