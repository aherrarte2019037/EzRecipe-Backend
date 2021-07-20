'use strict'

const bcrypt = require('bcrypt-nodejs');
const User = require('../models/user.model');
const jwt = require('../services/jwt')

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
        userModel.image = null;
        userModel.name = 'Angel';
        userModel.lastname = 'Herrarte'
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
                    userModel.save((err, userSaved) => {
                        if(err) return res.status(500).send({ message: 'Error al guardar el usuario' })

                        if(userSaved){
                            res.status(200).send(userSaved)
                        }else {
                            res.status(404).send({ message: 'No se ha podido guardar el usuario' })
                        }
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

    User.findByIdAndUpdate(idUser,params,{new: true, useFindAndModify: false},(err,edituser)=>{

        if(err) return res.status(500).send({ message: 'Error en la petición'});
        if(!edituser) return res.status(500).send({ message: 'Error al editar el Usuario'});

        return res.status(200).send({edituser});

    })

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

        return res.status(500).send({message: 'No posee los permisos para realizar esta acción'});

    }

}


module.exports = {
    createAdmin,
    login,
    register,
    socialLogin,
    editUser,
    deleteUser
}