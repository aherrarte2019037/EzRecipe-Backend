'use strict'
const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const cors = require("cors");
const fileUpload = require('express-fileupload');

const userController = require('./src/controllers/user.controllers')
const subController = require('./src/controllers/subscription.controller');

const userRoutes = require('./src/routes/user.routes');
const recipeRoutes = require('./src/routes/recipe.routes');
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cors());

/*app.use( fileUpload({
    abortOnLimit: true,
    responseOnLimit: 'File size is bigger than allowed',
    limits: {
        fileSize: 50 * 1024 * 1024
    },
}) );*/

userController.createAdmin();
subController.createSubscriptions();


app.use('/api', userRoutes)
app.use('/api',recipeRoutes);



module.exports = app;