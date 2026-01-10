import Exam from "../models/Exam.ts";
import User from "../models/User.ts";

const toTitleCase = (str: string) => {
    if (!str) return "";
    return str
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

const formatExamResponse = (exam: any) => {
    const examObj = exam.toObject ? exam.toObject() : exam;

    if (examObj.userScores && examObj.userScores instanceof Map) {
        examObj.userScores = Object.fromEntries(examObj.userScores);
    }

    if (examObj.author && typeof examObj.author === "object") {
        const firstName = examObj.author.firstName || "";
        const lastName = examObj.author.lastName || "";
        let rawName = `${firstName} ${lastName}`.trim();

        if (!rawName) {
            rawName = examObj.author.username || examObj.author.email || "Unknown Author";
        }

        const displayName = toTitleCase(rawName);

        examObj.author = {
            _id: examObj.author._id,
            displayName: displayName,
            avatarURL: examObj.author.avatarURL || "",
        };
    }

    if (examObj.reviews && Array.isArray(examObj.reviews)) {
        examObj.reviews = examObj.reviews.map((review: any) => {
            if (review.user && typeof review.user === "object") {
                const firstName = review.user.firstName || "";
                const lastName = review.user.lastName || "";
                let rawName = `${firstName} ${lastName}`.trim();

                if (!rawName) {
                    rawName = review.user.username || review.user.email || "Unknown User";
                }

                const displayName = toTitleCase(rawName);
                return {
                    ...review,
                    user: {
                        _id: review.user._id,
                        displayName: displayName,
                        avatarURL: review.user.avatarURL || "",
                    },
                };
            }
            return review;
        });
    }

    return examObj;
};

export const createExam = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { title, content, coverImage, tags, parts, rating, ratingCount, submittedCount, totalTime, language } =
            req.body;

        let newExam = await Exam.create({
            title,
            content,
            coverImage,
            author: req.user._id,
            tags: tags || [],
            parts: parts || [],
            rating: rating || 0,
            ratingCount: ratingCount || 0,
            submittedCount: submittedCount || 0,
            totalTime: totalTime || 0,
            language: language || "en",
            completionCount: 0,
        });

        newExam = await newExam.populate("author", "firstName lastName avatarURL username email");
        res.status(201).json(formatExamResponse(newExam));
    } catch (error) {
        console.error("Error creating exam:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const validateExamData = (data: any) => {
    if (!data.title || !data.content || !data.parts || !Array.isArray(data.parts)) {
        return false;
    }
    return true;
};
export const createExamFromJson = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { examData } = req.body;
        if (!validateExamData(examData)) {
            return res.status(400).json({ message: "Invalid exam data" });
        }
        examData.author = req.user._id;
        if (!examData.tags) examData.tags = [];
        const newExam = await Exam.create(examData);
        await newExam.populate("author", "firstName lastName avatarURL username email");
        res.status(201).json(formatExamResponse(newExam));
    } catch (error) {
        console.error("Error creating exam from JSON:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllExams = async (req, res) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 12;
        const skip = (page - 1) * limit;

        const totalItems = await Exam.countDocuments();
        const totalPages = Math.ceil(totalItems / limit);

        const exams = await Exam.find()
            .populate("author", "firstName lastName avatarURL username email")
            .populate("reviews.user", "firstName lastName avatarURL username email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const formattedExams = exams.map((exam) => formatExamResponse(exam));

        res.status(200).json({
            data: formattedExams,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems,
            },
        });
    } catch (error) {
        console.error("Error fetching exams:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getExamById = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Populate các thông tin cơ bản của Exam
        const exam = await Exam.findById(id)
            .populate("author", "firstName lastName avatarURL username email")
            .populate("reviews.user", "firstName lastName avatarURL username email");

        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }

        const examObj = formatExamResponse(exam);
        let leaderboard: any[] = [];

        if (exam.userScores && exam.userScores.size > 0) {
            const userIds = Array.from(exam.userScores.keys());
            const users = await User.find({ _id: { $in: userIds } }).select(
                "firstName lastName avatarURL username email createdAt"
            );

            leaderboard = users.reduce((acc, user) => {
                const scoreData = exam.userScores.get(user._id.toString());
                let totalScore = 0;

                if (typeof scoreData === "number") {
                    totalScore = scoreData;
                } else if (scoreData && typeof scoreData === "object" && "total" in scoreData) {
                    totalScore = scoreData.total || 0;
                }

                if (totalScore >= 80) {
                    const firstName = user.firstName || "";
                    const lastName = user.lastName || "";
                    let rawName = `${firstName} ${lastName}`.trim();
                    if (!rawName) rawName = user.displayName || user.email || "Unknown User";

                    acc.push({
                        user: {
                            _id: user._id,
                            displayName: toTitleCase(rawName),
                            avatarURL: user.avatarURL || "",
                            email: user.email,
                        },
                        score: totalScore,
                        date: user.createdAt, 
                    });
                }
                return acc;
            }, [] as any[]);
            leaderboard.sort((a, b) => b.score - a.score);
        }
        examObj.leaderboard = leaderboard;
        res.status(200).json(examObj);
    } catch (error) {
        console.error("Error fetching exam by ID:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateExam = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title,
            content,
            coverImage,
            tags,
            completionCount,
            parts,
            rating,
            ratingCount,
            submittedCount,
            totalTime,
            language,
        } = req.body;
        const userId = req.user._id.toString();

        const exam = await Exam.findById(id);
        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }
        if (exam.author.toString() !== userId) {
            return res.status(403).json({ message: "Forbidden: You are not the author of this exam" });
        }

        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
        const thumbnailFile = files?.["thumbnail"]?.[0];

        if (title) exam.title = title;
        if (content) exam.content = content;
        if (thumbnailFile) {
            exam.coverImage = thumbnailFile.path;
        } else if (coverImage) {
            exam.coverImage = coverImage;
        }
        if (tags) {
            if (typeof tags === "string") {
                try {
                    exam.tags = JSON.parse(tags);
                } catch (error) {
                    exam.tags = tags.split(",").map((tag: string) => tag.trim());
                }
            } else {
                exam.tags = tags;
            }
        }
        if (parts) {
            if (typeof parts === "string") {
                try {
                    exam.parts = JSON.parse(parts);
                } catch (error) {
                    console.log("Error parsing parts JSON:", error);
                    return res.status(400).json({ message: "Invalid parts format" });
                }
            } else {
                exam.parts = parts;
            }
        }
        if (completionCount) exam.completionCount = completionCount;
        if (rating) exam.rating = rating;
        if (ratingCount) exam.ratingsCount = ratingCount;
        if (submittedCount) exam.submittedCount = submittedCount;
        if (totalTime) exam.totalTime = totalTime;
        if (language) exam.language = language;

        await exam.save();
        await exam.populate("author", "firstName lastName avatarURL username email");
        await exam.populate("reviews.user", "firstName lastName avatarURL username email");
        res.status(200).json(formatExamResponse(exam));
    } catch (error) {
        console.error("Error updating exam:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteExam = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id.toString();

        const exam = await Exam.findById(id);
        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }
        if (exam.author.toString() !== userId && req.user.role !== "admin") {
            return res.status(403).json({ message: "You are not the author of this exam" });
        }
        await exam.deleteOne();
        res.status(200).json({ message: "Exam deleted successfully" });
    } catch (error) {
        console.error("Error deleting exam:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const submitExamScore = async (req, res) => {
    try {
        const { id } = req.params;
        const { score, partIndex } = req.body;
        const userId = req.user._id.toString();

        const exam = await Exam.findById(id);
        if (!exam) return res.status(404).json({ message: "Exam not found" });

        exam.submittedCount = (exam.submittedCount || 0) + 1;

        let userData = exam.userScores.get(userId);
        if (typeof userData === "number") {
            userData = { total: userData, parts: {} };
        } else if (!userData) {
            userData = { total: 0, parts: {} };
        }

        if (partIndex !== undefined && partIndex !== -1) {
            userData.parts = userData.parts || {};

            const currentPartScore = userData.parts[partIndex] || 0;
            if (score > currentPartScore) {
                userData.parts[partIndex] = score;
            }

            const totalParts = exam.parts.length;
            if (totalParts > 0) {
                let sum = 0;
                for (let i = 0; i < totalParts; i++) {
                    sum += userData.parts[i] || 0;
                }
                const newTotal = Math.round(sum / totalParts);
                userData.total = newTotal;
            } else {
                userData.total = score;
            }
        } else {
            if (score > userData.total) {
                userData.total = score;
            }
        }

        exam.userScores.set(userId, userData);
        exam.markModified("userScores");
        await exam.save();

        res.status(200).json({
            message: "Score saved",
            id: exam._id,
            highScore: userData.total,
            submittedCount: exam.submittedCount,
        });
    } catch (error) {
        console.error("Error saving score:", error);
        res.status(500).json({ message: "Error Saving Score" });
    }
};

export const addReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user._id.toString();

        const exam = await Exam.findById(id);
        if (!exam) return res.status(404).json({ message: "Exam not found" });

        const userData = exam.userScores.get(userId);
        let userHighScore = 0;

        if (typeof userData === "number") {
            userHighScore = userData;
        } else if (userData && typeof userData === "object") {
            userHighScore = userData.total || 0;
        }

        if (userHighScore < 80) {
            return res.status(403).json({
                message: `
                You need at least 80% score to review. 
                Your best: ${userHighScore}%`,
            });
        }

        const alreadyReviewed = exam.reviews.find((r) => r.user.toString() === userId);
        if (alreadyReviewed) return res.status(400).json({ message: "You have already reviewed this exam" });

        const newReview = { user: userId, rating: Number(rating), comment };
        exam.reviews.push(newReview);

        const totalRating = exam.reviews.reduce((sum, r) => sum + r.rating, 0);
        exam.rating = totalRating / exam.reviews.length;
        exam.ratingsCount = exam.reviews.length;

        await exam.save();
        await exam.populate("reviews.user", "firstName lastName avatarURL username email");

        res.status(201).json(formatExamResponse(exam));
    } catch (error) {
        console.log("Error adding review:", error);
        res.status(500).json({ message: "Error adding review" });
    }
};

export const deleteReview = async (req, res) => {
    try {
        const { id, reviewId } = req.params;
        const userId = req.user._id.toString();

        const exam = await Exam.findById(id);
        if (!exam) return res.status(404).json({ message: "Exam not found" });

        const reviewIndex = exam.reviews.findIndex((r) => r._id.toString() === reviewId);
        if (reviewIndex === -1) {
            return res.status(404).json({ message: "Review not found" });
        }

        const review = exam.reviews[reviewIndex];
        const isReviewAuthor = review.user.toString() === userId;
        const isExamAuthor = exam.author.toString() === userId;
        const isAdmin = req.user.role === "admin";

        if (!isReviewAuthor && !isExamAuthor && !isAdmin) {
            return res.status(403).json({ message: "Unauthorized to delete this review" });
        }

        exam.reviews.splice(reviewIndex, 1);

        if (exam.reviews.length > 0) {
            const totalRating = exam.reviews.reduce((sum, r) => sum + r.rating, 0);
            exam.rating = totalRating / exam.reviews.length;
        } else {
            exam.rating = 0;
        }
        exam.ratingsCount = exam.reviews.length;

        await exam.save();
        await exam.populate("reviews.user", "firstName lastName avatarURL username email");

        res.status(200).json(formatExamResponse(exam));
    } catch (error) {
        console.error("Error deleting review:", error);
        res.status(500).json({ message: "Error deleting review" });
    }
};
