import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import type { ExamType } from "../Types";
import { useNavigate } from "react-router-dom";
import { IoMdMore } from "react-icons/io";
import { useRef, useState } from "react";
import { PopupMoreOption } from "./PopupMoreOption";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { useClickOutside } from "../hooks/useClickOutside";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../redux/store";
import { deleteExam } from "../redux/examSlice";

interface ExamCardProps {
    maxWidth?: string;
    minWidth?: string;
    currentWidth: string;
    bgColor?: string;
    subClassName?: string;
    disableZoom?: boolean;
    data: ExamType;
}

export const ExamCard = ({
    maxWidth,
    minWidth,
    currentWidth,
    bgColor,
    subClassName,
    disableZoom,
    data,
}: ExamCardProps) => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const { user } = useSelector((state: RootState) => state.auth);
    const isOwner = user && data.author && user._id === data.author._id;
    const isAdmin = user && user.role === "admin";
    const canEdit = isOwner;
    const canDelete = isOwner || isAdmin;

    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useClickOutside(menuRef, () => setIsOpen(false));

    let userScore = 0;
    if (user?._id && data.userScores) {
        const scoreData = data.userScores[user._id];
        if (typeof scoreData === "number") {
            userScore = scoreData;
        } else if (scoreData && typeof scoreData === "object") {
            userScore = scoreData.total || 0;
        }
    }

    const progress = Math.min(Math.max(userScore, 0), 100);

    const renderStars = (rating: number = 0) => {
        const stars = [];
        const roundedRating = Math.round(rating * 2) / 2;
        for (let i = 1; i <= 5; ++i) {
            if (roundedRating >= i) {
                stars.push(<FaStar key={i} size={12} className="text-yellow-400" />);
            } else if (roundedRating >= i - 0.5) {
                stars.push(<FaStarHalfAlt key={i} size={12} className="text-yellow-400" />);
            } else {
                stars.push(<FaRegStar key={i} size={12} className="text-gray-500" />);
            }
        }
        return stars;
    };

    const handleStartExam = (e: React.MouseEvent<HTMLButtonElement>) => {
        if ((e.target as HTMLElement).closest(".more-btn")) return;
        navigate(`/exams/${data._id}`);
    };
    const handleDelete = async () => {
        setIsOpen(false);
        if (confirm("Are you sure you want to delete this?")) {
            dispatch(deleteExam(data._id));
        }
    };
    const handleEdit = () => {
        setIsOpen(false);
        navigate(`/exams/upload?id=${data._id}`);
    };

    return (
        <button
            onClick={handleStartExam}
            className={` 
                ${maxWidth} ${minWidth} ${currentWidth} ${bgColor} 
                pb-4 h-full flex flex-col items-start justify-center rounded-lg transition-all-300
                ${subClassName} ${disableZoom ? "" : "hover:scale-105"}`}
        >
            <div
                className="w-full aspect-[16/9] rounded-lg overflow-hidden 
                outline outline-[1px] outline-primary-dark/80 shadow-lg"
            >
                <img
                    src={data.coverImage || "/card-default.jpg"}
                    alt={data.title}
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="w-full flex-between">
                <div className="px-4 pt-2 w-full text-2xl text-left font-bold text-white line-clamp-2">
                    {data.title}
                </div>
                {(canEdit || canDelete) && (
                    <div ref={menuRef} className="relative more-btn ml-2 -mt-1">
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsOpen(!isOpen);
                            }}
                            className="relative font-bold p-2 rounded-full hover:bg-white/10 transition-all-300 cursor-pointer"
                        >
                            <IoMdMore size={22} />
                        </div>
                        {isOpen && (
                            <PopupMoreOption
                                isOpen={isOpen}
                                onEdit={canEdit ? handleEdit : undefined}
                                onDelete={canDelete ? handleDelete : undefined}
                            />
                        )}
                    </div>
                )}
            </div>

            <div className="px-4 w-full text-sm text-left font-semibold text-white/60 line-clamp-1 break-all">
                {data.author?.displayName || "Unknown Author"}
            </div>

            <div className="w-full py-2 px-4 mt-auto">
                <div className="w-full h-[3px] bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-secondary/90 transition-all-300 ease-out"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>

            <div className="w-full px-4 pt-1 flex-between flex-row">
                <span className="text-white/80 text-xs font-semibold">
                    {userScore > 0 ? `${userScore}% Score` : "Start Course"}
                </span>
                <div className="flex text-yellow-300 gap-0.5">{renderStars(data.rating)}</div>
            </div>
        </button>
    );
};
