import Comment from "../models/Comment.ts";
import Blog from "../models/Blog.ts";
import DocumentSchema from "../models/DocumentSchema.ts";
import Exam from "../models/Exam.ts";

const populateComment = (query) => {
    return query.populate("author", "firstName lastName avatarURL username email");
};

export const createComment = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { content, relatedId, onModel } = req.body;

        if (!content || !relatedId || !onModel) {
            return res.status(400).json({ message: "Content, relatedId and onModel are required" });
        }

        const newComment = await Comment.create({
            content,
            author: req.user._id,
            relatedId,
            onModel
        });

        await newComment.populate("author", "firstName lastName avatarURL username email");
        res.status(201).json(newComment);
    } catch (error) {
        console.error("Error creating comment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getCommentsByPostId = async (req, res) => {
    try {
        const { id } = req.params;
        const comments = await Comment.find({ relatedId: id })
            .populate("author", "firstName lastName avatarURL username email")
            .sort({ createdAt: -1 });

        res.status(200).json(comments);
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const editComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const userId = req.user._id.toString();

        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (comment.author.toString() !== userId) {
            return res.status(403).json({ message: "You can only edit your own comments" });
        }

        comment.content = content;
        await comment.save();
        await comment.populate("author", "firstName lastName avatarURL username email");
        
        res.status(200).json(comment);
    } catch (error) {
        console.error("Error editing comment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id.toString();

        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        let isAuthorized = false;

        if (comment.author.toString() === userId) {
            isAuthorized = true;
        } else {
            let post = null;
            if (comment.onModel === 'Blog') {
                post = await Blog.findById(comment.relatedId);
            } else if (comment.onModel === 'DocumentSchema') {
                post = await DocumentSchema.findById(comment.relatedId);
            } else if (comment.onModel === 'Exam') {
                post = await Exam.findById(comment.relatedId);
            }

            if (post && post.author.toString() === userId) {
                isAuthorized = true;
            }
        }

        if (!isAuthorized) {
            return res.status(403).json({ message: "You are not authorized to delete this comment" });
        }

        await comment.deleteOne();
        res.status(200).json({ message: "Comment deleted successfully", id: id });
    } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
