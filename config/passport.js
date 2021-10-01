const {Strategy : JwtStrategy, ExtractJwt} = require('passport-jwt');
const passport = require('passport');
const {User} = require('../models')

const options = {
  // define secret key to verify token
  secretOrKey : process.env.JWT_SECRET_KEY, 
  // define where to extract jwt from
  jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken()
}

// Verify Token 
// if success > run callback (payload,done)
// if invalid > send 401 / unauthorized
const jwtStrategy = new JwtStrategy(options,async (payload,done)=>{
  try {
    console.log(payload)
const user = await User.findOne({where : {id : payload.id}})
if(!user){return done(null,false)}
// Err/user(req.user)/ req.user = 'Success Token Verification', next()
done(null,'Success Token Verification')
  } catch (error) {
    done(error,false)
  }

})

// apply strategy to passport
passport.use('jwt', jwtStrategy)