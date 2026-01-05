import { useRef, useState } from "react";
import type { ExamType } from "../Types";
import { useClickOutside } from "../hooks/useClickOutside";
import { FaChevronDown, FaChevronUp, FaStar } from "react-icons/fa6";
import { CiWarning } from "react-icons/ci";
import { AiOutlineGlobal } from "react-icons/ai";
import { ButtonBase } from "../components/sub/ButtonBase";
import { MdFilterListAlt } from "react-icons/md";
import { ButtonBrand } from "../components/sub/ButtonBrand";
import { FaRegFileAlt } from "react-icons/fa";

interface PreviewExamFormProps {
    exam: ExamType;
    onStartExam: () => void;
    isFilterOpen: boolean;
    onToggleFilter: () => void;
    onCloseFilter: () => void;
    onSelectFilter: (filter: string) => void;
    onStartPart: (partIndex: number) => void;
    userScore: number;
    onSubmitReview: (rating: number, comment: string) => void;
}

export const PreviewExamForm = (props: PreviewExamFormProps) => {
    const filterRef: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
    useClickOutside(filterRef, props.onCloseFilter);

    const [isPartsOpen, setIsPartsOpen] = useState(true);
    const totalQuestions = props.exam.parts?.reduce((acc, part) => acc + part.questions.length, 0) || 0;

    const RatingInfo = [
        {
            label: props.exam.rating?.toFixed(1) || "0.0",
            value: `${props.exam.ratingsCount || 0} Ratings`,
            icon: <FaStar className="text-yellow-400" size={18} />,
        },
        {
            label: props.exam.submittedCount?.toString() || "0",
            value: "Submitted",
            icon: null,
        },
        {
            label: `${props.exam.totalTime || 0} min`,
            value: "Total Time",
            icon: null,
        },
    ];

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const canReview = props.userScore >= 80;

    const handlePostReview = () => {
        if (rating === 0 || comment.trim() === "") return alert("Please rate and write a comment");
        props.onSubmitReview(rating, comment);
        setRating(0);
        setComment("");
    };

    const ExamInfo = [
        {
            icon: <CiWarning size={22} className="text-yellow-300" />,
            label: `Last updated ${new Date(props.exam.updatedAt || props.exam.createdAt).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
            })}`,
        },
        {
            icon: <AiOutlineGlobal size={22} className="text-blue-400" />,
            label: `Language: ${props.exam.language || "English"}`,
        },
    ];

    return (
        <div className="relative min-h-screen h-auto w-full grid-pattern">
            <div className="mx-auto py-16 w-[90%] lg:w-[60%] md:w-[90%] sm:w-[90%]">
                <div
                    className="w-full px-4 py-3 lg:px-12 lg:py-8 flex flex-col items-start bg-white/5 
                    rounded-lg border border-white/30 shadow-xl"
                >
                    <h1 className="text-2xl md:text-4xl font-bold text-white mb-6 leading-tight">{props.exam.title}</h1>

                    <div className="grid grid-cols-3 gap-6 w-full mb-6 border-b border-white/30 pb-6">
                        {RatingInfo.map((item, idx) => (
                            <div className="flex flex-col items-center justify-center" key={idx}>
                                <div className="flex items-center space-x-1 text-white font-bold text-lg">
                                    <span>{item.label}</span>
                                    {item.icon && <span>{item.icon}</span>}
                                </div>
                                <span className="font-light text-sm text-gray-400">{item.value}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col justify-start space-y-3 mb-8 w-full">
                        {ExamInfo.map((item, idx) => (
                            <div className="flex items-center text-gray-300" key={idx}>
                                <span className="mr-2">{item.icon}</span>
                                <span className="text-sm font-medium">{item.label}</span>
                            </div>
                        ))}
                    </div>

                    <div className="w-full">
                        <ButtonBase
                            type="button"
                            name="Start All Tests"
                            bgColor="bg-secondary/80"
                            hoverBgColor="hover:bg-secondary/40"
                            textColor="text-white"
                            subClassName="w-full font-bold py-3"
                            onClick={() => props.onStartPart(-1)}
                        />
                    </div>

                    <div className="w-full mt-6">
                        <div
                            className="group flex items-center justify-between cursor-pointer py-2 mb-2 select-none"
                            onClick={() => setIsPartsOpen(!isPartsOpen)}
                        >
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-bold text-white">Practice Tests</h2>
                                <span className="text-gray-300 text-sm">({totalQuestions} questions)</span>
                            </div>
                            {isPartsOpen ? (
                                <FaChevronUp className="text-gray-400 group-hover:text-white" />
                            ) : (
                                <FaChevronDown className="text-gray-400 group-hover:text-white" />
                            )}
                        </div>

                        {isPartsOpen && (
                            <div className="border border-white/40 rounded-lg overflow-hidden bg-white/5 animate-fade-in-up">
                                {props.exam.parts && props.exam.parts.length > 0 ? (
                                    props.exam.parts.map((part, idx) => (
                                        <button
                                            key={part._id || idx}
                                            onClick={() => props.onStartPart(idx)}
                                            className="w-full flex items-center p-4 border-b border-white/40 
                                                last:border-b-0 hover:bg-accent/20 transition-all-300"
                                        >
                                            <div className="flex-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-accent/20 flex-center text-white">
                                                    <FaRegFileAlt size={14} />
                                                </div>
                                                <div className="flex flex-col items-start">
                                                    <span className="w-full text-left text-gray-200 font-semibold line-clamp-1">
                                                        {part.title}
                                                    </span>
                                                    <span className="text-xs text-gray-400">
                                                        {part.questions.length} questions
                                                    </span>
                                                </div>
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-gray-200 italic">No parts available.</div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="w-full mt-10 border-t border-white/30 pt-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Comments & Reviews</h2>

                        {/* Input Form */}
                        <div className="bg-black/30 p-4 rounded-lg mb-6">
                            {!canReview ? (
                                <p className="text-red-400 text-sm italic mb-2">
                                    * You need to achieve at least 80% score to write a review. (Your best:{" "}
                                    {props.userScore}%)
                                </p>
                            ) : (
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-gray-300 text-sm">Your Rating:</span>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button key={star} onClick={() => setRating(star)}>
                                            <FaStar
                                                className={star <= rating ? "text-yellow-400" : "text-gray-600"}
                                                size={18}
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div className="flex gap-2">
                                <input
                                    disabled={!canReview}
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className={`flex-1 bg-transparent text-white border border-gray-600
                        rounded-lg px-4 py-2 shadow-inner focus:outline-none focus:border-secondary
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

                        {/* List Reviews */}
                        <div className="space-y-4">
                            {props.exam.reviews && props.exam.reviews.length > 0 ? (
                                props.exam.reviews.map((review) => (
                                    <div key={review._id} className="bg-white/5 p-4 rounded-lg border border-white/10">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <img
                                                    src={review.user?.avatarURL || "/logo.jpg"}
                                                    className="w-6 h-6 rounded-full"
                                                />
                                                <span className="font-bold text-sm text-white">
                                                    {review.user?.displayName || "User"}
                                                </span>
                                            </div>
                                            <div className="flex text-yellow-400 text-xs">
                                                {[...Array(5)].map((_, i) => (
                                                    <FaStar
                                                        key={i}
                                                        className={
                                                            i < review.rating ? "text-yellow-400" : "text-gray-700"
                                                        }
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-gray-300 text-sm">{review.comment}</p>
                                        <span className="text-xs text-gray-600 mt-2 block">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-sm text-center">No reviews yet.</p>
                            )}
                        </div>
                    </div>

                    {/* <div className="w-full mt-6 border-t border-white/30 pt-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Comments & Reviews</h2>

                        <div className="flex gap-2 relative">
                            <input
                                className="flex-1 bg-black/30 text-white border border-gray-600
                                rounded-lg px-4 py-2 shadow-inner focus:outline-none 
                                focus:border-secondary focus:ring-1 focus:ring-secondary
                                placeholder:text-gray-300 transition-all-300"
                                placeholder="Write a comment..."
                            />

                            <ButtonBase
                                name="Post"
                                width="w-24"
                                textColor="text-white"
                                bgColor="bg-secondary/80"
                                hoverBgColor="hover:bg-secondary/40"
                                subClassName="font-semibold rounded-lg"
                            />

                            <div className="relative" ref={filterRef}>
                                <ButtonBrand
                                    width="w-12"
                                    name=""
                                    icon={<MdFilterListAlt size="22" />}
                                    textColor="text-gray-200"
                                    hoverBgColor="hover:text-white hover:bg-gray-300/30"
                                    subClassName="border border-gray-200/60"
                                    onClick={props.onToggleFilter}
                                />

                                {props.isFilterOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-neutral-800/80 rounded-lg z-50 overflow-hidden  animate-fade-in-up">
                                        <div className="flex flex-col p-1">
                                            {["Newest First", "Oldest First", "Top Rated"].map((option) => (
                                                <button
                                                    key={option}
                                                    onClick={() => props.onSelectFilter(option)}
                                                    className="w-full text-left px-4 py-2.5 text-sm text-white hover:bg-white/10 transition-colors"
                                                >
                                                    {option}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 w-full">
                        <div className="flex items-center justify-between text-white border-b border-white/10 pb-2 mb-4">
                            <h2 className="text-lg font-semibold">Questions in this exam</h2>
                            <span className="bg-white/10 px-2 py-0.5 rounded text-sm text-gray-300">0 Questions</span>
                        </div>
                        <div className="text-gray-200 text-sm text-center py-4 italic">
                            Start the exam to view all questions.
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
};
