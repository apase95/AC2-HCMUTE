import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
    coverImage: {
        type: String,
        default: "",
        trim: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    tags: [{
        type: String,
        trim: true,
    }],
    views: {
        type: Number,
        default: 0
    },
    subscription: {
        type: String,
        default: "",
        trim: true,
    },
    readTime: {
        type: String,
        default: "5 minutes"
    },
}, {
    timestamps: true,
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;