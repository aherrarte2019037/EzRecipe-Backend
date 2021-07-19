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
    image: { type: String, default: 'defaultProfile.png' },
    idSubscription: {type: Schema.Types.ObjectId, ref: 'Subscriptions'},
    ezCoins: {type: Number, default: 0}
})

module.exports = mongoose.model('Users', UserSchema)