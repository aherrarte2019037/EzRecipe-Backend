'use strict'

const bcrypt = require('bcrypt-nodejs');
const User = require('../models/user.model');
const jwt = require('../services/jwt');
const Subscription = require('../models/subscription.model');

function createSubscriptions(req,res){

    var subModel1 = new Subscription();
    var description1 = "ezApprenti"
    var price1 = 5;
    var months1 = 3;

    subModel1.description = description1;
    subModel1.price = price1;
    subModel1.months = months1

    var subModel2 = new Subscription();
    var description2 = "ezChef"
    var price2 = 5;
    var months2 = 3;

    subModel2.description = description2;
    subModel2.price = price2;
    subModel2.months = months2;

    var subModel3 = new Subscription();
    var description3 = "ezMaster"
    var price3 = 5;
    var months3 = 3;

    subModel3.description = description3;
    subModel3.price = price3;
    subModel3.months = months3;

    var subModel4 = new Subscription();
    var description4 = "EzFree"
    var price4 = 0;
    var months4 = 0;

    subModel4.description = description4;
    subModel4.price = price4;
    subModel4.months = months4;

    Subscription.findOne({ $or: [
        { description: 'ezApprenti' },
        { description: 'ezChef' },
        { description: 'ezMaster' },
        { description: 'ezFree' }
        ] }).exec((err, subsFound) => {
            if(err) return console.log('Error')

            if(subsFound){
                return console.log('Ya se crearon')
            }else {
                subModel1.save((err,sub1Created)=>{

                    subModel2.save((err,sub2Created)=>{

                        subModel3.save((err,sub3Created)=>{

                            subModel4.save((err,sub4Created)=>{

                                console.log('Se crearon las 4 suscripciones');

                            })

                        })

                    })

                })
            }

        })

}

function assignSubChef(req,res){

    Subscription.findOne({description: 'ezChef'},(err,subFound)=>{

        User.findByIdAndUpdate(req.user.sub,{idSubscription: subFound._id},{new: true, useFindAndModify: false},(err,userUpdated)=>{

            if(userUpdated.idSubscription == subFound._id) return res.status(500).send({message: 'Ya estaba asignado a esta suscripci??n'});

            if(err) return res.status(500).send({ err,message: 'Error en la petici??n'});
            if(!userUpdated) return res.status(500).send({message:'Error al cambiar la suscripci??n'});

            return res.status(200).send({userUpdated});


        })

    })

}

module.exports ={

    createSubscriptions,
    assignSubChef

}