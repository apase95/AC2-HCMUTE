import { PaginationControl } from "../components/sub/PaginationControl";

export interface LeaderBoardEntry {
    id: string;
    name: string;
    userScore: number;
    maxScore: number;
    date: string;
    time: string;
}


export const LeaderBoardForm = ({ LeaderBoardData }: { LeaderBoardData: LeaderBoardEntry[] }) => {

    return (
        <div className="relative min-h-screen h-auto w-full grid-pattern">
            <div className="mx-auto py-16 w-[90%] lg:w-[60%] md:w-[90%] sm:w-[90%]">
                <div className="w-full px-4 py-3 lg:px-12 lg:py-6 flex flex-col items-center bg-white/5 
                        rounded-lg border border-white/30 shadow-xl"
                >
                    <h1 className="w-full flex-center font-semibold text-white text-3xl mb-8">Leader Board</h1>
                    {LeaderBoardData.map((entry) => (
                        <div key={entry.id} className="w-full h-12 mb-[2px] flex-center border border-white/40 space-x-5 rounded-lg">
                            <div className={`w-24 h-full flex-center ${entry.userScore >= 80 ? "bg-green-600/90" : "bg-red-600/80"} border border-white/60 font-semibold rounded-lg`}>
                                {entry.userScore} / {entry.maxScore}
                            </div>
                            <div className="w-full flex-start space-x-3">
                                <div className="text-white font-semibold">{entry.name}</div>
                                <div className="text-gray-300 text-sm">{entry.date}</div>
                            </div>
                            <div className="w-24 h-full bg-yellow-400/60 flex-center border-l border-l-white/80 font-semibold rounded-lg">
                                {entry.time}
                            </div>
                        </div> 
                    ))}
                    <PaginationControl 
                        currentPage={1}
                        totalPages={10}
                        onPageChange={(page: number) => {
                            console.log("Page changed to:", page);
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
