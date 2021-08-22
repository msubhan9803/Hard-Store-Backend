var router = require("express").Router();
var mongoose = require("mongoose");
var auth = require("../auth");
var multer = require("multer");
var Blog = require("../../models/blog");
var path = require("path");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

var upload = multer({ storage: storage });

router.post("/createBlog", upload.single("blogImg"), async (req, res) => {
  try {
    const file = req.file;
    const blog = new Blog();
    blog.slug = req.body.slug;
    blog.title = req.body.title;
    blog.description = req.body.description;
    blog.tags = req.body.tags;
    blog.imgUrl = file.filename;
    const savedBlog = await blog.save();
    if (savedBlog) {
      return res.status(200).send(savedBlog);
    }
  } catch (err) {
    console.log(err, "err");
    return res.status(400).send(err);
  }
});

router.get("/getBlogs", async (req, res) => {
  try {
    const blog = await Blog.find();
    if (!blog) return res.status(200).send("blog not found");
    return res.status(200).send(blog);
  } catch (err) {
    return res.status(400).send(err);
  }
});

router.get("/getBlogById/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(400).send("blog not found");
    return res.status(200).send(blog);
  } catch (err) {
    return res.status(400).send(err);
  }
});

router.delete("/deleteBlog", async (req, res) => {
  try {
    Blog.deleteOne({ _id: { $eq: req.body.blog_id } })
      .then(async (resp) => {
        if (resp) {
          const blog = await Blog.find();
          if (blog != null && blog != "") return res.status(200).send(blog);
          else return res.status(400).send("Empty");
        }
      })
      .catch((err) => {
        return res.status(400).send(err);
      });
  } catch (err) {
    return res.status(400).send(err);
  }
});

router.post("/searchByTags", async (req, res) => {
  Blog.find(
    { tags: { $regex: req.body.query, $options: "i" } },
    function (err, blogs) {
      if (err) throw err;
      else if (blogs) {
        if (blogs != null && blogs != "") {
          return res.status(200).json({ result: blogs });
        } else {
          Blog.find(
            { title: { $regex: req.body.query, $options: "i" } },
            function (err, blogs) {
              if (err) throw err;
              return res.status(200).send(blogs);
            }
          );
        }
      }
    }
  );
});

router.put("/UpdateBLogImg/:Id", upload.single("blogImg"), async (req, res) => {
  try {
    const file = req.file;
    const isBlog = await Blog.findById(req.params.Id);
    if (!isBlog) return res.status(400).send("Blog not found");
    isBlog.imgUrl = file.filename;
    const savedBlog = await isBlog.save();
    if (savedBlog) {
      return res.status(200).send(savedBlog);
    }
  } catch (err) {
    console.log(err, "err");
    return res.status(400).send(err);
  }
});

router.put("/updateBlog/:Id", async (req, res) => {
  try {
    const isBlog = await Blog.findById(req.params.Id);
    if (!isBlog) return res.status(400).send("Blog not found");
    isBlog.title = req.body.title;
    isBlog.tags = req.body.tags;
    isBlog.description = req.body.description;
    isBlog.slug = req.body.slug;

    const savedBlog = await isBlog.save();
    if (savedBlog) {
      return res.status(200).send(savedBlog);
    }
  } catch (err) {
    console.log(err, "err");
    return res.status(400).send(err);
  }
});

module.exports = router;
