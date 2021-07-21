'use strict'

const recipeModel = require('../models/recipe.model');
const Recipe = require('../models/recipe.model')
const User = require('../models/user.model');

function createRecipe(req, res){

    var params = req.body;

    if(params.name && params.description && params.category){

        var recipeModel = new Recipe({...params});

        if(req.user.rol == 'chef'){
            recipeModel.type = 'premium';
        }else{
            recipeModel.type = 'common'
        }
        
        recipeModel.save((err,savedRecipe)=>{
            if (err) return res.status(500).send({message: 'Error en la petición', err});
            if (!savedRecipe) return res.status(500).send({message: 'Error al guardar la receta'});
            
            return res.status(200).send({message: 'Se agregó la receta',savedRecipe});

        })


    }else{

        return res.status(500).send({message: 'Debe llenar todos los datos'});

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

    createRecipe
    
}