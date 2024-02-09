const mongoose = require('mongoose');
const Joi = require('joi');


const postSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    title: { type: String, maxlength: 100, required: true },
    category: { type: String, enum: ['Development', 'Design', 'Innovation', 'Tutorial', 'Business'], required: true },
    content: { type: String, required: true },
    media: { type: [String], default: [] },
    likes: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], default: [] },
    comments: { type: [{ text: String, user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, created_at: { type: Date, default: Date.now } }], default: [] },
    created_at: { type: Date, default: Date.now }
});

const Post = mongoose.model('Post', postSchema);

const postValidationSchema = Joi.object({
    user_id: Joi.string().required(),
    title: Joi.string().max(100).required(),
    category: Joi.string().valid('Development', 'Design', 'Innovation', 'Tutorial', 'Business').required(),
    content: Joi.string().required(),
    media: Joi.array().items(Joi.string().uri()),
    likes: Joi.array().items(Joi.string()),
    comments: Joi.array().items(Joi.object({
        text: Joi.string().required(),
        user_id: Joi.string().required(),
        created_at: Joi.date().default(Date.now)
    })),
    created_at: Joi.date().default(Date.now)
});

module.exports = { Post, postValidationSchema };