import DocumentSchema from "../models/DocumentSchema.ts";

const toTitleCase = (str: string) => {
    if (!str) return "";
    return str
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

const formatDocumentResponse = (doc: any) => {
    const docObj = doc.toObject ? doc.toObject() : doc;

    if (docObj.author && typeof docObj.author === "object") {
        const firstName = docObj.author.firstName || "";
        const lastName = docObj.author.lastName || "";
        let rawName = `${firstName} ${lastName}`.trim();

        if (!rawName) {
            rawName = docObj.author.username || docObj.author.email || "Unknown Author";
        }
        const displayName = toTitleCase(rawName);

        return {
            ...docObj,
            author: {
                _id: docObj.author._id,
                displayName: displayName,
                avatarURL: docObj.author.avatarURL || "",
            },
        };
    }
    return docObj;
};

export const createDocument = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized: User not identified" });
        }

        const { title, tags, readTime, subscription } = req.body;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const thumbnailFile = files["thumbnail"]?.[0];
        const documentFile = files["document"]?.[0];

        if (!thumbnailFile || !documentFile) {
            return res.status(400).json({ message: "Thumbnail and document files are required" });
        }
        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }
        let processedTags = [];
        if (tags) {
            if (typeof tags === "string") {
                processedTags = tags
                    .split(",")
                    .map((t: string) => t.trim())
                    .filter((t: string) => t);
            } else if (Array.isArray(tags)) {
                processedTags = tags;
            }
        }

        let newDocument = await DocumentSchema.create({
            title,
            content: documentFile.path,
            coverImage: thumbnailFile.path,
            author: req.user._id,
            tags: processedTags,
            readTime: readTime || "5 minutes",
            subscription: subscription || "",
        });

        newDocument = await newDocument.populate("author", "firstName lastName avatarURL username");
        res.status(201).json(newDocument);
    } catch (error) {
        console.error("Error creating document:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllDocuments = async (req, res) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 6;
        const skip = (page - 1) * limit;

        const totalItems = await DocumentSchema.countDocuments();
        const totalPages = Math.ceil(totalItems / limit);

        const documents = await DocumentSchema.find()
            .populate("author", "firstName lastName avatarURL username")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const formattedDocs = documents.map((doc) => formatDocumentResponse(doc));

        res.status(200).json({
            data: formattedDocs,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems,
            },
        });
    } catch (error) {
        console.error("Error fetching documents:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getDocumentById = async (req, res) => {
    try {
        const { id } = req.params;
        const document = await DocumentSchema.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true }).populate(
            "author",
            "firstName lastName avatarURL username"
        );
        if (!document) {
            return res.status(404).json({ message: "Document not found" });
        }
        res.status(200).json(formatDocumentResponse(document));
    } catch (error) {
        console.error("Error fetching document by ID:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, coverImage, tags, readTime, subscription } = req.body;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
        const thumbnailFile = files?.["thumbnail"]?.[0];
        const documentFile = files?.["document"]?.[0];

        const document = await DocumentSchema.findById(id);
        if (!document) return res.status(404).json({ message: "Document not found" });
        if (title) document.title = title;
        if (subscription) document.subscription = subscription;
        if (readTime) document.readTime = readTime;
        if (tags) {
            if (typeof tags === "string") {
                document.tags = tags.split(",").map((tag: string) => tag.trim());
            } else {
                document.tags = tags;
            }
        }
        if (thumbnailFile) {
            document.coverImage = thumbnailFile.path;
        } else if (coverImage) {
            document.coverImage = coverImage;
        }
        if (documentFile) {
            document.content = documentFile.path;
        } else if (content) {
            document.content = content;
        }

        await document.save();
        await document.populate("author", "firstName lastName avatarURL username email");
        res.status(200).json(formatDocumentResponse(document));
    } catch (error) {
        console.error("Error updating document:", error);
        res.status(500).json({ message: "Internal server error" + error.message });
    }
};

export const deleteDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id.toString();

        const document = await DocumentSchema.findById(id);
        if (!document) {
            return res.status(404).json({ message: "Document not found" });
        }
        if (document.author.toString() !== userId) {
            return res.status(403).json({ message: "Forbidden: You are not the author of this document" });
        }
        await document.deleteOne();
        res.status(200).json({ message: "Document deleted successfully" });
    } catch (error) {
        console.error("Error deleting document:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
