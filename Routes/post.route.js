const express = require('express');
const router = express.Router();
const { Post }= require('../Models/post.model');
const authMiddleware = require('../Middleware/authMiddleware');

// GET all posts
router.get('/posts', async (req, res) => {
    try {
        const { page = 1, limit = 10, category, title } = req.query;
        const query = {};
        if (category) query.category = category;
        if (title) query.title = { $regex: title, $options: 'i' };

        const posts = await Post.find(query)
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .exec();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET post by ID
router.get('/posts/:post_id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST a new post
router.post('/posts', async (req, res) => {
    try {
        const post = new Post(req.body);
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT/PATCH update post
router.put('/posts/:post_id', authMiddleware, async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.post_id, req.body, { new: true });
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE a post
router.delete('/posts/:post_id', authMiddleware, async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.post_id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(202).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST like a post
router.post('/posts/:post_id/like', authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        if (!post.likes.includes(req.user._id)) {
            post.likes.push(req.user._id);
            await post.save();
        }
        res.status(201).json({ message: 'Post liked successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST comment on a post
router.post('/posts/:post_id/comment', authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        const { text } = req.body;
        post.comments.push({ text, user_id: req.user._id });
        await post.save();
        res.status(201).json({ message: 'Comment added successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
