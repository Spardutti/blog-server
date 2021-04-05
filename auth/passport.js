const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const User = require("../model/User");
const bcrypt = require("bcryptjs");

passport.use(
  new localStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (isMatch) {
          return done(null, user);
        }
        //wrong password
        else {
          return done(null, false, { message: "wrong password" });
        }
      });
    });
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
