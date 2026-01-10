import { LeaderBoardForm, type LeaderBoardEntry } from "../forms/LeaderBoardForm"

export const LeaderBoardPage = () => {

    const leaderboard: LeaderBoardEntry[] = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        userScore: 80 - i,
        maxScore: 100,
        name: "User Name",
        date: "January 10, 2025",
        time: "1:24:30",
    }));

    return (
        <LeaderBoardForm LeaderBoardData={leaderboard} />
    )
}
