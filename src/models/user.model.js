'use strict'

const mongoose = require("mongoose")
var Schema = mongoose.Schema

var UserSchema = Schema({
    name: String,
    lastname: String,
    email: String,
    username: String,
    password: String,
    rol: String,
    image: { type: String, default: 'defaultProfile.png' },
    ezCoins: {type: Number, default: 0}
})

module.exports = mongoose.model('Users', UserSchema)