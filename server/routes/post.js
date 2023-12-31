const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const Post = mongoose.model("Post");

router.get("/allpost", (req, res) => {
  Post.find()
    .populate("postedby", "_id name")
    .then((posts) => {
      res.json(posts);
    })
    .catch((err) => {
      console.error(err);
    });
});
router.post("/createpost", requireLogin, (req, res) => {
  const { title, body } = req.body;
  if (!title || !body) {
    res.status(422).json({ error: "please add all of the  fields" });
  }
  req.user.password = undefined;
  const post = new Post({
    title,
    body,
    postedby: req.user,
  });
  post
    .save()
    .then((result) => {
      res.json({ post: result });
    })
    .catch((err) => {
      console.log(err);
    });
});
router.get("/mypost", requireLogin, (req, res) => {
  Post.find({ postedby: req.user._id })
    .populate("postedby", "_id name")
    .then((mypost) => {
      res.json({ mypost });
    })
    .catch((err) => {
      console.log(err);
    });
});
module.exports = router;
