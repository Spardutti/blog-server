const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  published: { type: Boolean, default: false },
  comments: [{
    author: {type: String,},
    text: {type: String},
    time: {type: Date,}
  }
  ],
  created: { type: Date, default: Date.now() },
});

PostSchema.virtual("url").get(() => {
  return "/posts/" + this._id;
});

module.exports = mongoose.model("Post", PostSchema);
