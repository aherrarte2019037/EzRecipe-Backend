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

        recipeModel.dateTime = new Date(Date.now())
        recipeModel.idPublisher = req.user.sub;

        recipeModel.save((err,savedRecipe)=>{
            if (err) return res.status(500).send({message: 'Error en la petición', err});
            if (!savedRecipe) return res.status(500).send({message: 'Error al guardar la receta'});

            User.findByIdAndUpdate(req.user.sub, { $inc: { ezCoins: +5 } }, {new: true, useNewUrlParser: false}, (err, ezCoinsAdded) => {
                if(err) return res.status(500).send({message: 'Error en la petición'})
            })
            
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


function getMyRecipes(req, res){
    var userId = req.user.sub;
    Recipe.find({idPublisher: userId}, (err, foundMyRecipes)=>{
        if(err) return res.status(500).send({ message: 'Error en la petición'});
        if(!foundMyRecipes) return res.status(500).send({ message: 'Error al traer las Recetas'});

        return res.status(200).send({foundMyRecipes});
    })
}

async function latestRecipes(req,res){
    try {
        const normal = await Recipe.find({type: 'common'}).limit(2).sort({dateTime:-1})

        const premium = await Recipe.find({type: 'premium'}).limit(2).sort({dateTime:-1})
    
        return res.status(200).send(normal.concat(premium))
    } catch (error) {
        return res.status(500).send({error})
    }
}

module.exports={
    createRecipe,
    getRecipe,
    getMyRecipes,
    latestRecipes
}