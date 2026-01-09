import express from "express";
import { createBlog, deleteBlog, getAllBlogs, getBlogById, updateBlog } from "../controllers/blogController.ts";
import { checkAdmin, checkOwnerOrAdmin, protectedRoute } from "../middlewares/authMiddleware.ts";
import { uploadCloudinary } from "../libs/uploadCloudinary.ts";

const router = express.Router();

router.get("/", getAllBlogs);
router.get("/:id", protectedRoute, getBlogById);

router.post(
    "/",
    (req, res, next) => {
        next();
    },
    protectedRoute,
    checkAdmin,
    uploadCloudinary.fields([
        { name: "thumbnail", maxCount: 1 },
        { name: "document", maxCount: 1 },
    ]),
    createBlog
);
router.put(
    "/:id",
    protectedRoute,
    checkOwnerOrAdmin("blog"),
    uploadCloudinary.fields([
        { name: "thumbnail", maxCount: 1 },
        { name: "document", maxCount: 1 },
    ]),
    updateBlog
);
router.delete("/:id", protectedRoute, checkOwnerOrAdmin("blog"), deleteBlog);

export default router;
