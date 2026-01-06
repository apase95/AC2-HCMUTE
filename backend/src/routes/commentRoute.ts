import express from "express";
import { protectedRoute } from "../middlewares/authMiddleware.ts";
import { createComment, getCommentsByPostId, editComment, deleteComment } from "../controllers/commentController.ts";

const router = express.Router();

router.get("/:id", getCommentsByPostId);
router.post("/", protectedRoute, createComment);
router.put("/:id", protectedRoute, editComment);
router.delete("/:id", protectedRoute, deleteComment);

export default router;
