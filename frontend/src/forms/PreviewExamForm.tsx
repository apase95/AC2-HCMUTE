import { useRef, useState } from "react";
import type { ExamType, User } from "../Types";
import { useClickOutside } from "../hooks/useClickOutside";
import { FaChevronDown, FaChevronUp, FaStar } from "react-icons/fa6";
import { CiWarning } from "react-icons/ci";
import { AiOutlineGlobal } from "react-icons/ai";
import { ButtonBase } from "../components/sub/ButtonBase";
import { FaRegFileAlt } from "react-icons/fa";
import { ReviewList } from "./ReviewList";

interface PreviewExamFormProps {
    exam: ExamType;
    userScore: number;
    isFilterOpen: boolean;
    currentUser: User | null;
    onStartExam: () => void;
    onToggleFilter: () => void;
    onCloseFilter: () => void;
    onSelectFilter: (filter: string) => void;
    onStartPart: (partIndex: number) => void;
    onSubmitReview: (rating: number, comment: string) => void;
    onDeleteReview: (reviewId: string) => void;
    onNavigateLeaderBoard: () => void;
}

export const PreviewExamForm = (props: PreviewExamFormProps) => {
    const filterRef: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null!);
    useClickOutside(filterRef, props.onCloseFilter);
    const [isPartsOpen, setIsPartsOpen] = useState(true);
    const totalQuestions = props.exam.parts?.reduce((acc, part) => acc + part.questions.length, 0) || 0;

    const RatingInfo = [
        {
            label: props.exam.rating?.toFixed(1) || "0.0",
            value: `${props.exam?.ratingsCount || 0} Ratings`,
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

                    <div className="w-full mt-10 border-t border-white/40 pt-6">
                        <div className="w-full flex items-center justify-between mb-4">
                            <div className="text-xl font-semibold text-white">Comments & Reviews</div>
                            <ButtonBase
                                type="button"
                                name="Leader Board"
                                bgColor="transparent"
                                hoverBgColor="text-font-underline-hover"
                                textColor="text-white"
                                subClassName="!text-xl !p-0"
                                onClick={props.onNavigateLeaderBoard}
                            />
                        </div>
                        <ReviewList
                            exam={props.exam}
                            currentUser={props.currentUser}
                            userScore={props.userScore}
                            onSubmitReview={props.onSubmitReview}
                            onDeleteReview={props.onDeleteReview}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
