const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Category = require('../models/Category');

// GET /api/categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort('name');
    res.json(categories);
  } catch (err) {
    console.error(err); res.status(500).json({ success:false, message:'Server error' });
  }
});

// POST /api/categories
router.post('/',
  body('name').notEmpty().withMessage('Name required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success:false, errors: errors.array() });
    try {
      const { name } = req.body;
      const slug = name.toLowerCase().replace(/\s+/g, '-');
      const exists = await Category.findOne({ slug });
      if (exists) return res.status(400).json({ success:false, message:'Category exists' });
      const category = new Category({ name, slug });
      await category.save();
      res.status(201).json(category);
    } catch (err) {
      console.error(err); res.status(500).json({ success:false, message:'Server error' });
    }
  }
);

module.exports = router;
