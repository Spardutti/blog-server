const User = require("../model/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
require("dotenv").config();

//display create user form
exports.createUserForm = (req, res, next) => {
  res.json("please fill the fills");
};

//create a new user and send
exports.createNewUser = [
  body("password")
    .isLength({ min: 4 })
    .withMessage("Password must be at least 4 characters long"),

  body("username")
    .isLength({ min: 4 })
    .withMessage("Username must be at least 4 characters long"),

  body("confirm", "passwords must match")
    .exists()
    .custom((value, { req }) => value === req.body.password),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.json({ errors: errors.array() });
    } else {
      //Destructuring
      const { username, password } = req.body;
      //check if user exist
      User.findOne({ username }).exec((err, theUser) => {
        if (err) return next(err);
        if (theUser) res.json({ msg: "User already exist" });
        //if user does not exist, create it...
        // encrypt the password and save the new user to DB
        else {
          bcrypt.hash(password, 10, (err, hash) => {
            if (err) return next(err);
            const user = new User({
              username,
              password: hash,
            }).save((err, user) => {
              if (err) return next(error);
              res.json({
                msg: "User created",
                user: user,
              });
            });
          });
        }
      });
    }
  },
];

//LOG IN AND VALIDATE
exports.logUser = (req, res, next) => {
  //Validate the fields using the passport local strategy
  //using the set up in /auth/passport.
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) res.json(err);
    else {
      req.login(user, { session: false }, (err) => {
        if (err) return next(err);
        //create a token
        const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
          expiresIn: "60m",
        });
        res.json({
          msg: "logged in succesfuly",
          user: req.user,
          token: token,
        });
      });
    }
  })(req, res, next);
};

//LOG OUT
exports.logOut = (req, res, next) => {
  req.logout();
};
