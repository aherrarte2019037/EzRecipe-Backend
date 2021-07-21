'use strict'

var jwt = require("jwt-simple")
var moment = require("moment")
var secret = 'key_EZ_RECIPE'

exports.createToken = function (user) {
    var payload = {
        sub: user._id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        username: user.username,
        rol: user.rol,
        image: user.image,
        ezCoins: user.ezCoins,
        iat: moment().unix(),
        exp: moment().day(10, 'days').unix()
    }

    return jwt.encode(payload, secret)
}