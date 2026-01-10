import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { fetchExamById } from "../redux/examSlice";
import { LeaderBoardForm } from "../forms/LeaderBoardForm";
import { LoadingSpinner } from "../components/sub/LoadingSpinner";
import { ErrorComponent } from "../components/sub/ErrorComponent";
import { FaMedal, FaTrophy } from "react-icons/fa6";
import { LayoutParticles } from "../components/sub/LayoutParticles";

export const LeaderBoardPage = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch<AppDispatch>();
    
    const { currentItem, loading, error } = useSelector((state: RootState) => state.exams);

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

    useEffect(() => {
        if (id) {
            dispatch(fetchExamById(id));
        }
    }, [id, dispatch]);

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorComponent error={error} />;

    const leaderboardData = currentItem?.leaderboard || [];

    return (
        <>
            <LayoutParticles />
            <LeaderBoardForm 
                LeaderBoardData={leaderboardData} 
                examTitle={currentItem?.title || "Exam Leaderboard"} 
                onGetRankIcon={getRankIcon}
                onGetRowStyle={getRowStyle}
                onFormattedDate={formattedDate}
            />
        </>
    );  
};      