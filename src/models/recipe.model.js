'use strict'
const moongoose = require('mongoose')
const Schema = moongoose.Schema;

var RecipeSchema = Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    type: { type: String, required: true },
    dateTime: { type: Date, required: true, default: Date.now()},
    image: [{ type: String }],
    ingredients: [{
        name: String,
        quantity: String
    }],
    steps: [{ type: String, required: true }],
    likes: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
    idPublisher: { type: Schema.Types.ObjectId, ref: 'Users' }
})

module.exports = moongoose.model('Recipe', RecipeSchema);