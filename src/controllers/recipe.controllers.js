'use strict'

const e = require('connect-flash');
const recipeModel = require('../models/recipe.model');
const Recipe = require('../models/recipe.model')
const User = require('../models/user.model');

function createRecipe(req, res) {

    var params = req.body;

    if (params.name && params.description && params.category) {

        var recipeModel = new Recipe(params);
        console.log( params )
        if (req.user.rol == 'chef') {
            recipeModel.type = 'premium';
        } else {
            recipeModel.type = 'common'
        }

        recipeModel.dateTime = new Date(Date.now())
        recipeModel.idPublisher = req.user.sub;

        recipeModel.save((err, savedRecipe) => {
            if (err) return res.status(500).send({ message: 'Error en la petición', err });
            if (!savedRecipe) return res.status(500).send({ message: 'Error al guardar la receta' });

            User.findByIdAndUpdate(req.user.sub, { $inc: { ezCoins: +5 } }, { new: true, useNewUrlParser: false }, (err, ezCoinsAdded) => {
                if (err) return res.status(500).send({ message: 'Error en la petición' })
            })

            return res.status(200).send({ message: 'Receta publicada', savedRecipe });

        })
    } else {

        return res.status(500).send({ message: 'Debe llenar todos los datos' });

    }

}


function getRecipe(req, res) {
    Recipe.find((err, foundRecipes) => {
        if (err) return res.status(500).send({ message: 'Error en la petición' });
        if (!foundRecipes) return res.status(500).send({ message: 'Error al traer las Recetas' });
        return res.status(200).send(foundRecipes);
    }).sort({ dateTime: -1 }).populate('idPublisher', 'name lastname')
}


function getMyRecipes(req, res) {
    var userId = req.user.sub;
    Recipe.find({ idPublisher: userId }, (err, foundMyRecipes) => {
        if (err) return res.status(500).send({ message: 'Error en la petición' });
        if (!foundMyRecipes) return res.status(500).send({ message: 'Error al traer las Recetas' });

        return res.status(200).send({ foundMyRecipes });
    })
}

function getRecipesIdPublisher(req, res) {
    var userId = req.params.userId;
    Recipe.find({ idPublisher: userId }, (err, foundRecipes) => {
        if (err) return res.status(500).send({ message: 'Error en la petición' });
        if (!foundRecipes) return res.status(500).send({ message: 'Error al traer las Recetas' });

        return res.status(200).send({ foundRecipes });
    })
}

async function latestRecipes(req, res) {
    try {
        const normal = await Recipe.find({ type: 'common' }).limit(5).sort({ dateTime: -1 }).populate('idPublisher', 'name lastname image')

        const premium = await Recipe.find({ type: 'premium' }).limit(5).sort({ dateTime: -1 }).populate('idPublisher', 'name lastname image')

        return res.status(200).send(normal.concat(premium))
    } catch (error) {
        return res.status(500).send({ error })
    }
}

function giveLikes(req, res) {
    var idRecipe = req.params.idRecipe;
    var cont = 0;
    Recipe.findById(idRecipe, (err, foundRecipes) => {
        if (err) return res.status(500).send({ massage: 'Error al buscar la receta' })
        if (!foundRecipes) return res.status(500).send({ massage: 'Error al retornar la receta' })
        for (let i = 0; i < foundRecipes.likes.length; i++) {

            if (foundRecipes.likes[i].toString() === req.user.sub) {
                cont++
            }
        }
        if (cont === 1){
            Recipe.findByIdAndUpdate(idRecipe, {$pull: {likes: req.user.sub}}, (err, unlikedPost) => {
                if (err) return res.status(500).send({ massage: 'error al actualizar la receta' })
                return res.status(200).send({ menssage: 'Ya no te gusta la publicacion', user: req.user.sub })
            })
        }else {
            Recipe.findByIdAndUpdate(idRecipe, {$push:{likes: req.user.sub}}, (err, foundRecipes) => {
                if (err) return res.status(500).send({ massage: 'error al actualizar la receta' })
                if (!foundRecipes) return res.status(500).send({ message: 'Error con encontrar la receta' })
                return res.status(200).send({ menssage: 'Te a gustado la publicacion', user: req.user.sub })
            })
        }
        
    })
}

function saveRecipe(req,res){
    var idRecipe = req.params.idRecipe
    var cont = 0

    User.findById(req.user.sub, (err, userFound) => {
        if(err) return res.status(500).send({ message: 'Error en la petición' })

        for (let i = 0; i < userFound.favoriteRecipes.length; i++) {
            
            if(userFound.favoriteRecipes[i].toString() === idRecipe ){
                cont ++;
            }
            
        }

        if(cont === 1){
            User.findByIdAndUpdate(req.user.sub, { $pull: { favoriteRecipes: idRecipe } }, { new: true, useFindAndModify: false}, (err, favoriteRecipe) =>{
                if(err) return res.status(500).send({ message: 'Error en la petición' })
                if(!favoriteRecipe) return res.status(500).send({ message: 'Error al guardar como favorita la receta'})
        
                return res.status(200).send({ message: 'Receta eliminada de favoritas'})
            })

        }else{
            User.findByIdAndUpdate(req.user.sub, { $push: { favoriteRecipes: idRecipe } }, { new: true, useFindAndModify: false}, (err, favoriteRecipe) =>{
                if(err) return res.status(500).send({ message: 'Error en la petición' })
                if(!favoriteRecipe) return res.status(500).send({ message: 'Error al guardar como favorita la receta'})
        
                return res.status(200).send({ message: 'Receta agregada a favoritas'})
            })

        }
    })

}

module.exports = {
    createRecipe,
    getRecipe,
    getMyRecipes,
    latestRecipes,
    giveLikes,
    getRecipesIdPublisher,
    saveRecipe
}