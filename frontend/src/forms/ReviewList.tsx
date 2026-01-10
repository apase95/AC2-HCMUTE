import { useState } from "react";
import { FaStar } from "react-icons/fa6";
import { ButtonBase } from "../components/sub/ButtonBase";
import type { ExamType, User } from "../Types";
import { ReviewItem } from "./ReviewItem";

interface ReviewListProps {
    exam: ExamType;
    currentUser: User | null;
    userScore: number;
    onDeleteReview: (reviewId: string) => void;
    onSubmitReview: (rating: number, comment: string) => void;
}

export const ReviewList = (props: ReviewListProps) => {
    const [visibleReviews, setVisibleReviews] = useState(3);

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const canReview = props.userScore >= 80;

    const handlePostReview = () => {
        if (rating === 0 || comment.trim() === "") return alert("Please rate and write a comment");
        props.onSubmitReview(rating, comment);
        setRating(0);
        setComment("");
    };

    return (
        <>
            <div className="bg-white/5 p-4 rounded-lg mb-6 border border-white/40 select-none">
                {!canReview ? (
                    <p className="text-red-600 text-sm italic mb-2">
                        *You need to achieve at least 80% score to write a review. (Your best: {props.userScore}%)
                    </p>
                ) : (
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-gray-300 text-sm font-semibold">Your Rating:</span>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button key={star} onClick={() => setRating(star)}>
                                <FaStar className={star <= rating ? "text-yellow-400" : "text-gray-600"} size={18} />
                            </button>
                        ))}
                    </div>
                )}

                <div className="flex gap-2">
                    <input
                        disabled={!canReview}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className={
                            `flex-1 bg-transparent text-white border border-white/40
                            rounded-lg px-4 py-2 shadow-inner focus:outline-none focus:border-white/80
                            placeholder:text-gray-500 transition-all-300 ${
                            !canReview ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        placeholder={canReview ? "Write a review..." : "Complete exam to review"}
                    />

                    <ButtonBase
                        name="Post"
                        width="w-24"
                        textColor="text-white"
                        bgColor={canReview ? "bg-secondary/80" : "bg-gray-700"}
                        hoverBgColor={canReview ? "hover:bg-secondary/40" : ""}
                        subClassName={`font-semibold rounded-lg ${!canReview ? "cursor-not-allowed" : ""}`}
                        onClick={handlePostReview}
                        disabled={!canReview}
                    />
                </div>
            </div>
            <div className="space-y-4">
                {props.exam.reviews && props.exam.reviews.length > 0 ? (
                    <>
                        {props.exam.reviews.slice(0, visibleReviews).map((review) => (
                            <ReviewItem 
                                key={review._id}
                                review={review}
                                currentUser={props.currentUser}
                                exam={props.exam}
                                onDeleteReview={props.onDeleteReview}
                            />
                        ))}

                        {visibleReviews < props.exam.reviews.length && (
                            <div className="w-full flex justify-center mt-4">
                                <ButtonBase
                                    name="Show More"
                                    onClick={() => setVisibleReviews((prev) => prev + 3)}
                                    bgColor="transparent"
                                    hoverBgColor="hover:underline"
                                    textColor="text-white/80"
                                />
                            </div>
                        )}
                    </>
                ) : (
                    <p className="text-gray-400 text-sm text-center">No reviews yet.</p>
                )}
            </div>
        </>
    );
};
