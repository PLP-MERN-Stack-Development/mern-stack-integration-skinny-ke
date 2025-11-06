const Post = require('../models/Post');
const Category = require('../models/Category');

// GET /api/posts
exports.getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find().populate('author', 'name email').populate('category').sort({ createdAt: -1 }).skip(skip).limit(limit),
      Post.countDocuments()
    ]);

    res.json({ posts, total, page, pages: Math.ceil(total/limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/posts/:id
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name email').populate('category');
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    await post.incrementViewCount();
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// SEARCH
exports.searchPosts = async (req, res) => {
  try {
    const q = req.query.q || '';
    const posts = await Post.find({ title: new RegExp(q, 'i') })
      .limit(50)
      .populate('category')
      .populate('author', 'name');
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// CREATE
exports.createPost = async (req, res) => {
  try {
    const errors = [];
    if (!req.body.title) errors.push('Title required');
    if (!req.body.content) errors.push('Content required');
    if (!req.body.category) errors.push('Category required');
    if (errors.length) return res.status(400).json({ success: false, errors });

    // Generate slug from title
    const slug = req.body.title.toLowerCase().replace(/\s+/g, '-');

    const postData = {
      title: req.body.title,
      content: req.body.content,
      excerpt: req.body.excerpt || '',
      slug, // ✅ required field
      author: req.user._id,
      category: req.body.category,
      tags: req.body.tags ? req.body.tags.split(',').map(t => t.trim()) : [],
      isPublished: req.body.isPublished === 'true' || req.body.isPublished === true,
    };

    if (req.file) postData.featuredImage = `/uploads/${req.file.filename}`;

    const post = new Post(postData);
    await post.save();

    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// UPDATE
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    if (post.author.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: 'Not authorized' });

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;
    post.excerpt = req.body.excerpt || post.excerpt;
    post.tags = req.body.tags ? req.body.tags.split(',').map(t => t.trim()) : post.tags;
    if (req.body.category) post.category = req.body.category;
    if (req.file) post.featuredImage = `/uploads/${req.file.filename}`;
    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// DELETE
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    if (post.author.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: 'Not authorized' });
    await post.remove();
    res.json({ success: true, message: 'Post removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ADD COMMENT
exports.addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    post.comments.push({ user: req.user._id, content: req.body.content });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
