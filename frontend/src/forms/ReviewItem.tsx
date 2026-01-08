import { useState } from "react";
import type { ExamType, Review, User } from "../Types";
import { FaStar, FaTrash } from "react-icons/fa6";

interface ReviewListProps {
    exam: ExamType;
    review: Review;
    onDeleteReview: (reviewId: string) => void;
    currentUser: User | null;
}

export const ReviewItem = (props: ReviewListProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const lineCount = props.review.comment.split(/\r\n|\r|\n/).length;
    const isLongContent = props.review.comment.length >= 200 || lineCount >= 3;

    return (
        <div key={props.review._id} className="bg-white/5 p-4 rounded-lg border border-white/40">
            
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                    <img src={props.review.user?.avatarURL || "/logo.jpg"} 
                        className="w-6 h-6 rounded-full" 
                    />
                    <span className="font-bold text-sm text-white">
                        {props.review.user?.displayName || "User"}
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex text-yellow-400 text-xs">
                        {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={i < props.review.rating ? "text-yellow-400" : "text-gray-700"} />
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="w-full">
                <p
                    className={`text-white/80 text-sm leading-relaxed whitespace-pre-wrap transition-all duration-300
                        ${!isExpanded ? "line-clamp-2" : ""}`}
                >
                    {props.review.comment}
                </p>
                {isLongContent && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-xs text-gray-200 hover:text-gray-500/80 font-semibold 
                            underline focus:outline-none"
                    >
                        {isExpanded ? "Show less" : "show more"}
                    </button>
                )}
            </div>
           
            <div className="w-full flex items-center justify-between">
                <span className="text-xs text-gray-400 mt-2 block">
                    {new Date(props.review.createdAt).toLocaleDateString()}
                </span>
                {(props.currentUser?._id === props.review.user?._id ||
                    props.currentUser?.role === "admin" ||
                    props.currentUser?._id === props.exam.author?._id) && (
                    <button
                        onClick={() => props.onDeleteReview(props.review._id)}
                        className="p-2 bg-white/10 rounded-full text-white/40 
                            hover:bg-white/20 hover:text-white transition-colors"
                        title="Delete Review"
                    >
                        <FaTrash size={12} />
                    </button>
                )}
            </div>
        </div>
    );
};
