'use strict'

const bcrypt = require('bcrypt-nodejs');
const User = require('../models/user.model');
const jwt = require('../services/jwt');
const Recipe = require('../models/recipe.model');
const Subscription = require('../models/subscription.model');

function getUserLogged(req,res){
    User.findById(req.user.sub, (err, userFound) => {
        if(err) return res.status(err).send({ message: 'Error en la petición' })

        return res.status(200).send({ message: 'Usuario encontrado', userFound})
    })

}

function createAdmin(req, res) {
    var userModel = new User();
    var username = "AdminApp"
    var password = "12345"
    var rol = "AdminApp"
    var email = "adminApp@email.com"
    if (username === "AdminApp" && password === "12345" && rol === "AdminApp" && email === "adminApp@email.com") {
        userModel.username = username
        userModel.password = password
        userModel.rol = rol
        userModel.email = email
        userModel.name = 'EzAdmin';
        userModel.lastname = 'EzPana'
        User.find({
            $or: [
                { username: userModel.username }
            ]
        }).exec((err, userFound) => {
            if (err) return console.log("Error en la respuesta")

            if (userFound && userFound.length == 1) {
                console.log(`El usuario ${userModel.username} ya existe`)
            } else {
                bcrypt.hash(password, null, null, (err, passEncrypted) => {
                    userModel.password = passEncrypted

                    userModel.save((err, userSaved) => {
                        if (err) return console.log('Error al guardar al usuario')
                        if (userSaved) {
                            //console.log(userSaved)
                        } else {
                            return console.log('Error al registrar')
                        }
                    })
                })
            }
        })
    }
}

function login(req, res) {
    var params = req.body

    User.findOne({ email: params.email }, (err, userFound) => {
        if (err) return res.status(500).send({ message: 'Error en la petición' })
        if (userFound) {
            bcrypt.compare(params.password, userFound.password, (err, passCorrect) => {
                if (passCorrect) {
                    if (params.getToken === true) {
                        return res.status(200).send({ token: jwt.createToken(userFound), user: userFound })
                    } else {
                        userFound.password = undefined
                        return res.status(200).send({ user: userFound })
                    }
                } else {
                    return res.status(404).send({ message: 'Credenciales incorrectas' })
                }
            })
        } else {
            return res.status(404).send({ message: 'Usuario no registrado' })
        }
    })
}

async function socialLogin( req, res ) {
    try {
        const user = req.body;

        const userFound = await User.findOne({ email: user.email });
        if( userFound ) return res.status(200).send({ token: jwt.createToken(userFound), user: userFound });

        const userCreated = await User.create( user );
        return res.status(200).send({ token: jwt.createToken(userCreated), user: userCreated });

    } catch(error) {
        return res.status(500).send({ message: 'Error inesperado' });
    }
}

function register(req,res){
    var userModel = new User()
    var params = req.body

    delete params.rol

    if(params.name && params.lastname && params.email && params.username && params.password){
        userModel.name = params.name
        userModel.lastname = params.lastname
        userModel.username = params.username
        userModel.email = params.email
        userModel.password = params.password
        userModel.rol = 'Client'

        User.find( { $or:[
            { username: userModel.username },
            { email: userModel.email }
        ] } ).exec((err, userFound ) => {
            if(err) res.status(500).send({ message: 'Error en la petición' })

            if(userFound && userFound.length >= 1){
                return res.status(500).send({ message: 'Usuario ya registrado' })
            }else {
                bcrypt.hash(params.password, null, null, (err, passEncrypted) => {
                    userModel.password = passEncrypted

                    Subscription.findOne({description:'EzFree'},(err,subSaved)=>{

                        userModel.idSubscription = subSaved._id

                        userModel.save((err, userSaved) => {
                            if(err) return res.status(500).send({ message: 'Error al guardar el usuario' })
    
                            if(userSaved){
                                res.status(200).send(userSaved)
                            }else {
                                res.status(404).send({ message: 'No se ha podido guardar el usuario' })
                            }
                        })

                    })

                })
            }
        })

    }else {
        return res.status(500).send({ message: 'Faltan datos por ingresar' })
    }

}

function editUser(req,res){

    var idUser = req.params.idUser;
    var params = req.body;

    delete params.password;
    delete params.rol;

    User.find({ $or: [
        { username: params.username },
        { email: params.email }
    ] }).exec(( err, userFound ) => {
        if(err) return res.status(500).send({ message: 'Error en la petición' })
        if(userFound && userFound.length >= 1){
            return res.status(500).send({ message: 'El usuario ya existe' })

        }else {
            User.findByIdAndUpdate(idUser, params, {new: true, useFindAndModify: false}, (err, editedUser) => {
                if(err) return res.status(500).send({ message: 'Error en la petición' })
                if(!editedUser) return res.status(500).send({ message: 'No se ha podido encontrar el usuario' })
                editedUser.password = undefined;
                editedUser.__v = undefined;
                return res.status(200).send( editedUser )
            })
        }
    } )
}


function deleteUser(req,res){

    var idUser = req.params.idUser;

    if(idUsuer == req.user.sub){

        User.findByIdAndDelete(idUser,(err,deleteuser)=>{

            if(err) return res.status(500).send({ message: 'Error en la petición'});
            if(!deleteuser) return res.status(500).send({ message: 'Error al editar el Usuario'});

            return res.status(200).send({deleteuser});

        })

    }else{

        return res.status(500).send({message: 'No posee los permisos'});

    }

}

function getRegisteredUsers(req,res){
    if(req.user.rol != 'AdminApp') return res.status(500).send({ message: 'No tienes permisos' })

    User.find((err, usersFounds) => {
        if(err) return res.status(500).send({ message: 'Error en la petición' })
        if(!usersFounds) return res.status(500).send({ message: 'No se encontraron usuarios' })
        return res.status(200).send({ usersFounds })
    }).populate('followers following', 'name lastname username')
}

async function uploadProfileImage( req, res ) {
    const fileExtensions = ['png', 'jpg', 'gif', 'jpeg' ];
    if( !req.files ) return res.status(400).send({ message: 'Archivo no encontrado' });
    if( !req.params.id ) return res.status(400).send({ message: 'Faltan datos' });

    const user = req.params.id;
    const file = req.files?.files;
    const type = file.mimetype.split('/')[1];
    const filename = `profileImg${user}.${type}`
    if( !fileExtensions.includes(type) ) return res.status(400).send({ fileUploaded: false, error: 'Invalid file extension', extension: type, availableExtensions: fileExtensions });

    try {
        const userFound = await User.findById( user );
        if( userFound?.image && userFound?.image !== 'defaultProfile.png' ) await fs.unlink(`uploads/${userFound?.image}`);
        await file.mv( `uploads/${filename}` );
        await User.findByIdAndUpdate( user, { image: filename } );
        res.status(200).send({ message: 'Imagen de  perfil editada', filename: `${filename}` });

    } catch (error) {
        console.log(error)
        res.status(400).send({ message: 'Error inesperado' });
    }
}

async function getProfileImage( req, res ) {
    const file = req.params.id;

    try {
        await fs.access(`uploads/${file}`);
        res.download(`uploads/${file}`, (error) => {
            if( error ) return res.status(404).send({ message: error });
        })
    }catch (error) {
        res.download(`uploads/defaultProfile.gif`, (error) => {
            if( error ) return res.status(404).send({ message: error });
        })
    }
    
}

function chefRequests(req,res){
    if(req.user.rol != 'AdminApp') return res.status(200).send({ message: 'No tienes los permisos'})
    var boolean = true;

    User.find({requestRoleChef: boolean}, (err, usersFounds) => {
        if(err) return res.status(500).send({ message: 'Error en la petición' })
        if(!usersFounds) return res.status(200).send({ message: 'No hay solicitudes de chef'})
        
        return res.status(200).send(usersFounds)
    })

}

function petitionChefRequest(req,res){

    if(req.user.rol!= 'Client') return res.status(500).send({message: 'No tiene permisos para realizar esta acción'});

    User.findByIdAndUpdate(req.user.sub,{requestRoleChef: true},{new: true, useFindAndModify: false},(err,UserUpdated)=>{

        if(err) return res.status(500).send(err,{message: 'error en la petición'});
        if(!UserUpdated) return res.status(500).send({message: 'Error al ascender al usuario'});

        return res.status(200).send({UserUpdated, message: 'Solocitud de chef aprobada'})


    })

}

function confirmChefRequest(req,res){

    if(req.user.rol != 'AdminApp') return res.status(500).send({ message: 'No tienes los permisos'})
    var idUser = req.params.idUser;

    User.findByIdAndUpdate(idUser,{rol: 'chef', requestRoleChef: false},{new: true, useFindAndModify: false},(err, userUpdated)=>{

        if(err) return res.status(500).send(err,{message: 'error en la petición'});
        if(!userUpdated) return res.status(500).send({message: 'Error al ascender al usuario'});

        return res.status(200).send({userUpdated, message: 'Solocitud de chef aprobada'})

    })

}

function cancelChefRequest(req,res){

    if(req.user.rol != 'AdminApp') return res.status(500).send({ message: 'No tienes los permisos'})
    var idUser = req.params.idUser;

    User.findByIdAndUpdate(idUser,{requestRoleChef: false},{new: true, useFindAndModify: false},(err, userUpdated)=>{

        if(err) return res.status(500).send(err,{message: 'error en la petición'});
        if(!userUpdated) return res.status(500).send({message: 'Error al ascender al usuario'});

        return res.status(200).send({userUpdated, message:'Solicitud de chef cancelada'})

    })

}

function addThreeCoins(req, res){

    User.findOneAndUpdate({_id: req.user.sub}, {$inc:{ezCoins: 3}} , {new: true, useFindAndModify: false}, (err, addedCoins)=>{
        if(err) return res.status(500).send({ message: 'Error en la petición' });
        if(!addedCoins) return res.status(200).send({ message: 'No se agregaron las Coins'});
        
        return res.status(200).send({ addedCoins });
    })
}

function followUser(req,res){
    var idUser = req.params.idUser
    var cont = 0

    if(idUser === req.user.sub) return res.status(500).send({ message: 'No puedes seguirte a ti mismo'})

    User.findById(idUser, (err, userFound) => {
        if(err) return res.status(err).send({ message: 'Error en la petición' });

        for (let i = 0; i < userFound.followers.length; i++) {
            
            if(userFound.followers[i].toString() === req.user.sub){
                cont++
            }
            
        }

        if(cont === 1){
            User.findByIdAndUpdate(idUser, { $pull: { followers: req.user.sub }}, (err, userUnfollowed) => {
                if(err) return res.status(err).send({ message: 'Error en la petición' })

                User.findByIdAndUpdate(req.user.sub, { $pull: { following: idUser } }, (err, followingUsers) => {
                    if(err) return res.status(err).send({ message: 'Error en la petición'})
                })

                return res.status(200).send({ message: 'Dejaste de seguir al usuario'})
            })
        }else {
            User.findByIdAndUpdate(idUser, { $push: { followers: req.user.sub } }, (err, userFollowed) => {
                if(err) return res.status(err).send({ message: 'Error en la petición' });

                User.findByIdAndUpdate(req.user.sub, { $push: { following: idUser } }, (err, followingUsers) => {
                    if(err) return res.status(err).send({ message: 'Error en la petición'})
                })

                return res.status(200).send({ message: 'Usuario seguido'})
            })
        }

    })

}

function getUserLogged(req,res){
    User.findById(req.user.sub, (err, userFound) => {
        if(err) return res.status(err).send({ message: 'Error en la petición' })

        return res.status(200).send({ message: 'Usuario encontrado', userFound})
    }).populate('idSubscription','description')

}

function getUserUsername(req,res){
    var username = req.params.username
    User.findOne({username: username}, (err, userFound) => {
        if(err) return res.status(err).send({ message: 'Error en la petición' })

        return res.status(200).send({ message: 'Usuario encontrado', userFound})
    })
}

async function userStats(req, res){
    var recipeId = req.params.recipeId;
    try{
        const myRecipes = await Recipe.find({idPublisher: req.user.sub},{name: 1, likes: 1} ).limit(3).sort({dateTime: -1})
        const myLikes = await Recipe.find({idPublisher: req.user.sub}, {name: 1, likes: 1})
        const recipeUser  = await User.findById(req.user.sub,{favoriteRecipes: 1, purchasedRecipes: 1})

        let favoriteRecipe = recipeUser.favoriteRecipes.length
        let purchasedRecipe = recipeUser.purchasedRecipes.length
        let quantityRecipe = myLikes.length
        let likes = 0;
        
        for (let i = 0; i < quantityRecipe; i++) {
            likes = likes+ myLikes[i].likes.length
        }   
             


        return res.status(200).send({myRecipes, quantityRecipe, likes, favoriteRecipe, purchasedRecipe})
    }catch(error){
        return res.status(500).send({ error })
    }
    
}
    

function purchasedRecipes(req, res){
    var recipeId = req.params.recipeId;
    User.findById(req.user.sub, (err, foundUser)=>{
        if (foundUser.ezCoins >= 45) {
        
            for (let i = 0; i < foundUser.purchasedRecipes.length; i++) {
                
                if(foundUser.purchasedRecipes[i] === recipeId){
                    return res.status(500).send({ message: 'Esta Receta ya esta comprada'});
                }
                
            }

            User.findByIdAndUpdate(req.user.sub, {$inc:{ezCoins: -45}, $push:{purchasedRecipes: recipeId}},
            {new: true, useFindAndModify: false}, (err, purchasedRecipe)=>{
                if(err) return res.status(500).send({ message: 'Error en la petición' });
                if(!purchasedRecipe) return res.status(200).send({ message: 'No se realizó la compra'});                    
                return res.status(200).send({ purchasedRecipe });
            })

        }else{
            return res.status(500).send({ message: 'No tienes las EzCoins suficientes'});
        }      
            
    })
}

function showPurchasedRecipes(req,res){

    User.findById(req.user.sub).exec((err,userFound)=>{

        Recipe.find({_id: userFound.purchasedRecipes}).populate('idPublisher','name lastname image username').exec((err, recipeFound)=>{


            return res.status(200).send(recipeFound)
        })


    })

}

function getSavedRecipes(req,res){

    User.findById(req.user.sub).exec((err,userFound)=>{

        Recipe.find({_id: userFound.favoriteRecipes}).populate('idPublisher','name lastname image username').exec((err, recipeFound)=>{


            return res.status(200).send(recipeFound)
        })


    })

}

async function search(req,res){
    try {
        var textToFind = req.params.term

        const recipes = await Recipe.aggregate([
            {
                $match: { name: { $regex: textToFind, $options: 'i' } }
            }
        ])

        const users = await User.aggregate([
            {
                $match: { $or: [ { name: { $regex: textToFind, $options: 'i' } }, { lastname: { $regex: textToFind, $options: 'i' } }, { username: { $regex: textToFind, $options: 'i' } } ] }
            }
        ])

        return res.status(200).send({users: users, recipes: recipes})
    } catch (error) {
        return res.status(500).send({ error })
    }
}


module.exports = {
    createAdmin,
    login,
    register,
    socialLogin,
    editUser,
    deleteUser,
    getRegisteredUsers,
    uploadProfileImage,
    getProfileImage,
    chefRequests,
    addThreeCoins,
    followUser,
    getUserLogged,
    purchasedRecipes,
    confirmChefRequest,
    cancelChefRequest,
    petitionChefRequest,
    getUserUsername,
    showPurchasedRecipes,
    userStats,
    getSavedRecipes,
    search
}