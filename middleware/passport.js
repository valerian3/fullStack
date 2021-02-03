const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const mongoose = require('mongoose')
const User = mongoose.model('users') // ще один спосіб підключення
const keys = require('../config/keys')

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // беремо токен з хедера
    secretOrKey: keys.jwt // ключ шифрування
}

module.exports = (passport) => {
    passport.use(
        new JwtStrategy(options, async (payload, done) => {
            try{
                const user = await User.findById(payload.userId).select('email id') // дані беруться з токена

                if(user){
                    done(null, user) // першим параметром в node завжди йде помилка, а потім дані
                }else {
                    done(null, false)
                }
            }
            catch (e){
                console.log(e)
            }
        })
    )
}
