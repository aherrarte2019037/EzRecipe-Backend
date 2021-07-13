'use strict'
const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const cors = require("cors");
const fileUpload = require('express-fileupload');


app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
/*app.use( fileUpload({
    abortOnLimit: true,
    responseOnLimit: 'File size is bigger than allowed',
    limits: {
        fileSize: 50 * 1024 * 1024
    },
}) );*/
app.use(cors());




module.exports = app;