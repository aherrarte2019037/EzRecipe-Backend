'use strict'
const moongoose = require('mongoose')
const Schema = moongoose.Schema;

var RecipeSchema = Schema({
    name: { type: String, require: true },
    description: { type: String, require: true },
    category: { type: String, require: true },
    type: { type: String, require: true },
    dateTime: { type: Date, require: true },
    image: { type: String, default: 'defaultProfile.png'},
    ingredients: [{
        name: String,
        quantify: String
    }],
    steps: [{ type: String, require: true }],
    likes: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
    idPublisher: { type: Schema.Types.ObjectId, ref: 'Users' }
})

module.exports = moongoose.model('Recipe', RecipeSchema);