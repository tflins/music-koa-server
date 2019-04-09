const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const secretOrKey = require('./keys').secretOrKey
const mongoose = require('mongoose')
const opts = {}

const User = mongoose.model('user')

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = secretOrKey

module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      // console.log(jwt_payload)
      const user = await User.findById(jwt_payload.id)
      if (user) {
        return done(null, user)
      } else {
        return done(null, false)
      }
    })
  )
}
