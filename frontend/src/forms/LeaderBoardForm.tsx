import { useState, useEffect } from "react";
import { PaginationControl } from "../components/sub/PaginationControl";
import type { LeaderBoardEntry } from "../Types";

interface LeaderBoardFormProps {
    LeaderBoardData: LeaderBoardEntry[];
    examTitle: string;
    onGetRankIcon?: (index: number) => React.ReactNode;
    onGetRowStyle?: (index: number) => string;
    onFormattedDate?: (dateString: string) => string;
}

export const LeaderBoardForm = (props: LeaderBoardFormProps) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(props.LeaderBoardData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = props.LeaderBoardData.slice(startIndex, startIndex + itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [props.LeaderBoardData.length]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="relative min-h-screen h-auto w-full grid-pattern">
            <div className="mx-auto py-16 w-[90%] lg:w-[60%] md:w-[90%] sm:w-[90%]">
                <div className="w-full px-4 py-3 lg:px-12 lg:py-6 flex flex-col items-center bg-white/5 
                    rounded-lg border border-white/30 shadow-xl"
                >
                    <h1 className="w-full text-center font-bold text-3xl md:text-4xl mb-2">
                        Leaderboard
                    </h1>
                    <p className="text-white font-semibold mb-10 text-xl">
                        {props.examTitle}
                    </p>

                    <div className="w-full flex flex-col space-y-3">
                        {currentData.length > 0 ? (
                            currentData.map((entry, index) => {
                                const realIndex = startIndex + index;
                                return (
                                    <div key={entry.user._id || realIndex}
                                        className={`w-full flex items-center p-4 rounded-xl border transition-all duration-300
                                            ${props.onGetRowStyle?.(realIndex)}`}
                                    >
                                        <div className="w-16 flex-center">
                                            {props.onGetRankIcon?.(realIndex)}
                                        </div>

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
                                                <span className="mt-1 text-gray-300 text-xs">
                                                    {props.onFormattedDate?.(entry.date)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="w-24 text-right flex-center flex-col">
                                            <div className="text-xl font-bold text-white">
                                                {typeof entry.score === "number"
                                                    ? Math.round(entry.score)
                                                    : entry.score}
                                            </div>
                                            <div className="text-xs text-gray-300">Points</div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="mb-2 text-center text-lg text-gray-300">No scores yet.</p>
                        )}
                    </div>

                    {totalPages > 1 && (
                        <PaginationControl
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
