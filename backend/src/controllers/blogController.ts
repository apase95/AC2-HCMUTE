import Blog from "../models/Blog.ts";

const toTitleCase = (str: string) => {
    if (!str) return "";
    return str
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

const formatBlogResponse = (blog: any) => {
    const blogObj = blog.toObject ? blog.toObject() : blog;

    if (blogObj.author && typeof blogObj.author === "object") {
        const firstName = blogObj.author.firstName || "";
        const lastName = blogObj.author.lastName || "";
        let rawName = `${firstName} ${lastName}`.trim();

        if (!rawName) {
            rawName = blogObj.author.username || blogObj.author.email || "Unknown Author";
        }

        const displayName = toTitleCase(rawName);

        return {
            ...blogObj,
            author: {
                _id: blogObj.author._id,
                displayName: displayName,
                avatarURL: blogObj.author.avatarURL || "",
            },
        };
    }
    return blogObj;
};

export const createBlog = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized: User not identified" });
        }

        const { title, tags, readTime, subscription } = req.body;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const thumbnailFile = files["thumbnail"]?.[0];
        const documentFile = files["document"]?.[0];

        if (!title || !thumbnailFile || !documentFile) {
            return res.status(400).json({ message: "Title, thumbnail and content are required" });
        }

        let processedTags = [];
        if (tags && typeof tags === "string") {
            processedTags = tags.split(",").map((tag: string) => tag.trim());
        }

        let newBlog = await Blog.create({
            title,
            content: documentFile.path,
            coverImage: thumbnailFile.path,
            author: req.user._id,
            tags: processedTags,
            readTime: readTime || "5 minutes",
            subscription: subscription || "",
        });

        await newBlog.populate("author", "firstName lastName avatarURL username email");
        res.status(201).json(formatBlogResponse(newBlog));
    } catch (error) {
        console.error("Error creating blog:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find()
            .populate("author", "firstName lastName avatarURL username email")
            .sort({ createdAt: -1 });

        const formattedBlogs = blogs.map((blog) => formatBlogResponse(blog));
        res.status(200).json(formattedBlogs);
    } catch (error) {
        console.error("Error fetching blogs:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getBlogById = async (req, res) => {
    try {
        const { id } = req.params;

        const blog = await Blog.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true }).populate(
            "author",
            "firstName lastName avatarURL username email"
        );

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        res.status(200).json(formatBlogResponse(blog));
    } catch (error) {
        console.error("Error fetching blog by ID:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, coverImage, tags, readTime, subscription } = req.body;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
        const thumbnailFile = files?.["thumbnail"]?.[0];
        const documentFile = files?.["document"]?.[0];

        const blog = await Blog.findById(id);
        if (!blog) return res.status(404).json({ message: "Blog not found" });
        if (title) blog.title = title;
        if (subscription) blog.subscription = subscription;
        if (readTime) blog.readTime = readTime;
        if (tags) {
            if (typeof tags === "string") {
                blog.tags = tags.split(",").map((tag: string) => tag.trim());
            } else {
                blog.tags = tags;
            }
        }
        if (thumbnailFile) {
            blog.coverImage = thumbnailFile.path;
        } else if (coverImage) {
            blog.coverImage = coverImage;
        }
        if (documentFile) {
            blog.content = documentFile.path;
        } else if (content) {
            blog.content = content;
        }

        await blog.save();
        await blog.populate("author", "firstName lastName avatarURL username email");
        res.status(200).json(formatBlogResponse(blog));
    } catch (error) {
        console.error("Error updating blog:", error);
        res.status(500).json({ message: "Internal server error" + error.message });
    }
};

export const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        if (blog.author.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this blog" });
        }

        await blog.deleteOne();
        res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) {
        console.error("Error deleting blog:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
