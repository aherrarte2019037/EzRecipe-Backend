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


function getRecipe(req, res){
    Recipe.find((err, foundRecipes) =>{
        if(err) return res.status(500).send({ message: 'Error en la petición'});
        if(!foundRecipes) return res.status(500).send({ message: 'Error al traer las Recetas'});

        return res.status(200).send({foundRecipes});
    })
}


module.exports={
    
}