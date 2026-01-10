import { useState } from "react";
import { PaginationControl } from "../components/sub/PaginationControl";
import type { LeaderBoardEntry } from "../Types";
import { FaTrophy, FaMedal } from "react-icons/fa";

interface LeaderBoardFormProps {
    LeaderBoardData: LeaderBoardEntry[];
    examTitle: string;
}

export const LeaderBoardForm = ({ LeaderBoardData, examTitle }: LeaderBoardFormProps) => {
    const [visibleCount, setVisibleCount] = useState(10);

    const getRankIcon = (index: number) => {
        if (index === 0) return <FaTrophy className="text-yellow-400" size={20} />;
        if (index === 1) return <FaMedal className="text-gray-300" size={20} />;
        if (index === 2) return <FaMedal className="text-amber-600" size={20} />;
        return <span className="font-bold text-white/60">#{index + 1}</span>;
    };

    const getRowStyle = (index: number) => {
        if (index === 0) return "bg-yellow-500/30 border-yellow-500/50";
        if (index === 1) return "bg-gray-400/30 border-gray-400/50";
        if (index === 2) return "bg-amber-600/30 border-amber-600/50";
        return "border-white/20";
    };

    const formattedDate = (dateString: string) => {
        return new Date(dateString).toLocaleString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        });
    };

    const displayedData = LeaderBoardData.slice(0, visibleCount);

    return (
        <div className="relative min-h-screen h-auto w-full grid-pattern">
            <div className="mx-auto py-16 w-[90%] lg:w-[60%] md:w-[90%] sm:w-[90%]">
                <div
                    className="w-full px-4 py-3 lg:px-12 lg:py-6 flex flex-col items-center bg-white/5 
                        rounded-lg border border-white/30 shadow-xl"
                >
                    <h1 className="w-full text-center font-bold text-3xl md:text-4xl mb-2">Leaderboard</h1>
                    <p className="text-gray-300 mb-10 text-lg">{examTitle}</p>

                    <div className="w-full flex flex-col space-y-3">
                        {displayedData.length > 0 ? (
                            displayedData.map((entry, index) => (
                                <div
                                    key={entry.user._id || index}
                                    className={`w-full flex items-center p-4 rounded-xl border transition-all duration-300 ${getRowStyle(
                                        index
                                    )}`}
                                >
                                    <div className="w-16 flex-center">{getRankIcon(index)}</div>

                                    <div className="flex-1 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden flex-center border border-white/20">
                                            <img
                                                src={entry.user.avatarURL || "/logo.jpg"}
                                                alt="avatar"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-white font-bold text-lg leading-tight">
                                                {entry.user.displayName}
                                            </span>
                                            <span className="text-gray-500 text-xs">{formattedDate(entry.date)}</span>
                                        </div>
                                    </div>

                                    <div className="w-24 text-right flex-center flex-col">
                                        <div className="text-xl font-bold text-white">
                                            {typeof entry.score === "number" ? Math.round(entry.score) : entry.score}
                                        </div>
                                        <div className="text-xs text-gray-300">Points</div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="mb-2 text-center text-lg text-gray-300">No scores yet.</p>
                        )}
                    </div>

                    {LeaderBoardData.length > 10 && (
                        <div className="mt-8">
                            <PaginationControl currentPage={1} totalPages={1} onPageChange={() => {}} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
