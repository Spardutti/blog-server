const Post = require("../model/Post");
const moment = require("moment");

//DISPLAY HOME PAGE WITH ALL PUBLISHED POST
exports.index = (req, res, next) => {
  Post.find({ published: true })
    .sort({ created: -1 })
    .exec((err, posts) => {
      if (err) return next(err);
      if (!posts || posts.length === 0) {
        return res.json({ msg: "No post published" });
      } else {
        return res.json(posts);
      }
    });
};

//DISPLAY ALL POST IN DB
exports.allPost = (req, res, next) => {
  Post.find({}).exec((err, posts) => {
    if (err) return next(error);
    //Success, display!
    res.json(posts);
  });
};

//DISPLAY A SINGLEPOST WITH COMMENTS
exports.showPost = (req, res, next) => {
  Post.findById(req.params.id).exec((err, post) => {
    if (err) return next(err);
    //SUccess
    res.json(post);
  });
};

//ADD A NEW COMMENT TO THE CURRENT POST
exports.newComment = (req, res, next) => {
  Post.findByIdAndUpdate(
    req.params.id,
    {
      $push: {
        comments: {
          $each: [
            {
              author: req.user.username,
              text: req.body.text,
              time: Date.now(),
            },
          ],
          $position: 0,
        },
      },
    },
    { new: true },
    (err, result) => {
      if (err) return next(err);
      res.json(result);
    }
  );
};

//CREATE A NEW UNPUBLISHED POST
exports.newPost = (req, res, next) => {
  Post.findOne({ title: req.body.title }).exec((err, thePost) => {
    if (err) return next(error);
    if (thePost) res.json({ msg: "title already in use" });
    else {
      const post = new Post({
        author: req.user,
        title: req.body.title,
        text: req.body.text,
      }).save((err, post) => {
        if (err) return next(err);
        //Success, save it!
        res.json(post);
      });
    }
  });
};
//CHANGE THE CURRENT POST STATUS
exports.changePostStatus = (req, res, next) => {
  Post.findById(req.params.id, (err, post) => {
    if (err) return next(err);
    post.published = !post.published;
    post.save((err) => {
      if (err) return next(err);
      else {
        res.json(post);
      }
    });
  });
};

//EDIT POST
exports.editPost = (req, res, next) => {
  Post.findById(req.params.id, (err, post) => {
    if (err) return next(err);
    else {
      (post.title = req.body.title), (post.text = req.body.text);
      post.save((err) => {
        if (err) return next(err);
        else {
          res.json(post);
        }
      });
    }
  });
};
