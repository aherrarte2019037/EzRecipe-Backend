'use strict'

const mongoose = require("mongoose")
var Schema = mongoose.Schema

var UserSchema = Schema({
    name: String,
    lastname: String,
    email: String,
    username: String,
    password: String,
    followers: [{type: Schema.Types.ObjectId, ref: 'Users'}],
    following: [{type: Schema.Types.ObjectId, ref: 'Users'}],
    rol: String,
    image: { type: String, default: 'imageAvatar' },
    idSubscription: {type: Schema.Types.ObjectId, ref: 'Subscriptions'},
    ezCoins: {type: Number, default: 10},
    requestRoleChef: {type: Boolean, default: false},
    purchasedRecipes: [{type: Schema.Types.ObjectId, ref: 'Users'}]
})

module.exports = mongoose.model('Users', UserSchema)