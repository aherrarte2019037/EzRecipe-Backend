'use strict'

const recipeModel = require('../models/recipe.model');
const Recipe = require('../models/recipe.model')
const User = require('../models/user.model');

function createRecipe(req, res){
    var recipeModel = new Recipe();
    var params = req.body;
    if(params.name && params.description && params.category && params.type && params.dateTime && params.){

    }

}