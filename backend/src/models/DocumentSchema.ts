import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
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
        required: true,
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
    view: {
        type: Number,
        default: 0,
    },
    readTime: {
        type: String,
        default: "5 minutes",
    },
    subscription: {
        type: String,
        default: "AWS Cloud Club in HCMUTE University",
        trim: true,
    },
}, {timestamps: true});

const DocumentSchema = mongoose.model("DocumentSchema", documentSchema);
export default DocumentSchema;