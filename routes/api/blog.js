const express = require("express");
const router = express.Router();
const jwtAuth = require("../../auth/jwtAuth");
const passport = require("passport");

const userController = require("../../controllers/userController");
const postController = require("../../controllers/postController");

//creating a variable to simplify
const jwtProtected = passport.authenticate("jwt", { session: false });

//////////////////////// POST ROUTES /////////////////////////////////
////////////////////////  VISITORS //////////////////////////////////

//DISPLAY HOME PAGE WITH PUBLISHED POST
router.get("/blog", postController.index);

//DISPLAY A SINGLE POST
router.get("/blog/:id", postController.showPost);

//ADD A COMMENT TO THE POST
router.put("/blog/:id", jwtProtected, postController.newComment);

////////////////////////  ADMIN PAGE ///////////////////////////////////

//CREATE A NEW UNPUBLISHED POST
router.post("/admin/blog/new", jwtProtected, postController.newPost);

//DISPLAY ALL POST PUBLISHED & UNPUBLISHED
router.get("/admin/blog/all", jwtProtected, postController.allPost)

/////////////////////////////////// USER ////////////////////////////////

//SEND NEW USE DATA
router.post("/new/user", userController.createNewUser);

//LOG IN USER
router.post("/login", userController.logUser);

//LOG OUT USER
router.get("/logout", userController.logOut);
module.exports = router;
