import mongoose from "mongoose";


const questionSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    text: { 
        type: String, 
        required: true 
    },
    type: { 
        type: String, 
        enum: ['single', 'multiple'], 
        default: 'single' 
    },
    options: [{
        id: String,
        text: String,
        label: String
    }],
    correctAnswers: [String],
    explanation: String
}, { _id: false });

const partSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    questions: [questionSchema]
}, { _id: false });

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});


const examSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true, 
    },
    content: {
        type: String,
        required: true,
    },
    coverImage: {
        type: String,
        default: "", 
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
    rating: { 
        type: Number, 
        default: 0 
    },
    ratingCount: { 
        type: Number, 
        default: 0 
    },
    submittedCount: { 
        type: Number, 
        default: 0 
    },
    totalTime: { 
        type: Number, 
        default: 60 
    },
    language: { 
        type: String, 
        default: "English" 
    },
    completionCount: {
        type: Number,
        default: 0
    },
    parts: [partSchema],
    reviews: [reviewSchema],
    userScores: {
        type: Map,
        of: Number,
        default: {}
    }
}, { timestamps: true });

const Exam = mongoose.model("Exam", examSchema);
export default Exam;