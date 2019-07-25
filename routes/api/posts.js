const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator/check");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const Post = require("../../models/Post");
//@router POST /api/posts
//@desc   Create a POST
//access  Public
router.post(
  "/",
  [
    auth,
    [
      check("text", "text is required")
        .not()
        .isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        user: req.user.id,
        avatar: user.avatar,
      });
      const post = await newPost.save();
      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  },
);
// GET /api/POSTS GET ALL POSTS
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({
      date: -1,
    });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
//GET POST BY ID
router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        msg: "POST NOT FOUND",
      });
    }
    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      return res.status(404).json({
        msg: "POST NOT FOUND",
      });
    }
    res.status(500).send("Server Error");
  }
});
// DELETE /api/posts DELETE A POSTS
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        msg: "POST NOT FOUND",
      });
    }
    //Check USEr POST OR NOT
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({
        msg: "user not Authorised",
      });
    }
    await post.remove();
    res.json({
      msg: "Post removed",
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      return res.status(404).json({
        msg: "POST NOT FOUND",
      });
    }
    res.status(500).send("Server Error");
  }
});

//PUT  /api/posts/like/:id LIke the Post
router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    //check if the post has already been liked
    if (
      post.likes.filter(like => like.user.toString() == req.user.id).length > 0
    ) {
      return res.status(400).json({
        msg: "Post already Liked",
      });
    }
    post.likes.unshift({
      user: req.user.id,
    });
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//PUT  /api/posts/unlike/:id Unlike The Post
router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    //check if the post has already been liked
    if (
      post.likes.filter(like => like.user.toString() == req.user.id).length == 0
    ) {
      return res.status(400).json({
        msg: "Post has not been Liked",
      });
    }
    //Get Remove Index
    const removeIndex = post.likes
      .map(like => like.user.toString())
      .indexOf(req.user.id);
    post.likes.splice(removeIndex, 1);
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
// Comment on a post POST REQUEST /api/posts/comment/:id
router.post(
  "/comment/:id",
  [
    auth,
    [
      check("text", "text is required")
        .not()
        .isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    try {
      const user = await User.findById(req.user.id).select("-password");
      const post = await Post.findById(req.params.id);
      const newComment = new Post({
        text: req.body.text,
        name: user.name,
        user: req.user.id,
        avatar: user.avatar,
      });
      post.comments.unshift(newComment);
      await post.save();
      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  },
);
// Delete Comment DELETE  /api/post/comment/:id/:commentid
router.delete("/comment/:id/:commentid", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    //PUll Out comment
    const comment = post.comments.find(
      comment => comment.id == req.params.commentid,
    );
    if (!comment) {
      return res.status(404).json({
        msg: "comment does't exists",
      });
    }
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({
        msg: "unauthurised user",
      });
    }
    //Get Remove Index
    const removeIndex = post.comments
      .map(comment => comment.user.toString())
      .indexOf(req.params.comment_id);
    post.comments.splice(removeIndex, 1);
    await post.save();
    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
module.exports = router;
