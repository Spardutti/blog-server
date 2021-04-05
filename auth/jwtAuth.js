const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const passport = require("passport");
require("dotenv").config();
const User = require("../model/User");

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    (jwtPayload, done) => {
      User.findById(jwtPayload._id).exec((err, user) => {
        if (err) return done(err);
        return done(null, user);
      });
    }
  )
);
