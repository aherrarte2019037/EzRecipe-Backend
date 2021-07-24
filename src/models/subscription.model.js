'use strict'
const moongoose = require('mongoose')
const Schema = moongoose.Schema;

var SubscriptionSchema = Schema({
description: {type: String, required: true},
price: {type: Number, required: true},
months: {type: Number, required: true}
})

module.exports = moongoose.model('Subscription', SubscriptionSchema);