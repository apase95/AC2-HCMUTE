import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { fetchExamById } from "../redux/examSlice";
import { LeaderBoardForm } from "../forms/LeaderBoardForm";
import { LoadingSpinner } from "../components/sub/LoadingSpinner";
import { ErrorComponent } from "../components/sub/ErrorComponent";

export const LeaderBoardPage = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch<AppDispatch>();

    const { currentItem, loading, error } = useSelector((state: RootState) => state.exams);

    useEffect(() => {
        if (id) {
            dispatch(fetchExamById(id));
        }
    }, [id, dispatch]);

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorComponent error={error} />;

    const leaderboardData = currentItem?.leaderboard || [];

    return <LeaderBoardForm LeaderBoardData={leaderboardData} examTitle={currentItem?.title || "Exam Leaderboard"} />;
};
