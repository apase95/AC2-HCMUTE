import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { AppDispatch, RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { addExamReview, fetchExamById } from "../redux/examSlice";
import { LoadingSpinner } from "../components/sub/LoadingSpinner";
import { PreviewExamForm } from "../forms/PreviewExamForm";
import { ErrorComponent } from "../components/sub/ErrorComponent";
import { LayoutParticles } from "../components/sub/LayoutParticles";

export const PreviewExamPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    
    const { user } = useSelector((state: RootState) => state.auth);
    const { currentItem, loading, error } = useSelector((state: RootState) => state.exams);

    const [isFilterOpen, setIsFilterOpen] = useState(false);

    useEffect(() => {
        if (id) { dispatch(fetchExamById(id)); }
    }, [id, dispatch]);

    const handleStartPart = (partIndex: number) => {
        if (currentItem && confirm(`Are you sure you want to start ${partIndex === -1 ? "the entire exam" : `part ${partIndex + 1}`} of this exam?`)) {
            navigate(`/exams/${currentItem._id}/take`, { state: { partIndex } });
        }
    };

    const handleToggleFilter = () => {
        setIsFilterOpen(prev => !prev);
    };

    const handleCloseFilter = () => {
        setIsFilterOpen(false);
    };

    const handleSelectFilter = (filter: string) => {
        console.log("Selected filter:", filter);
        setIsFilterOpen(false);
    };

    let userScore: number = 0;
    if (currentItem) {
        if (user && currentItem.userScores && currentItem.userScores[user._id]) {
            const scoreData = currentItem.userScores[user._id];
            if (typeof scoreData === 'number') {
                userScore = scoreData;
            } else if (typeof scoreData === 'object' && scoreData.total !== undefined) {
                userScore = scoreData.total;
            }
        }
    }
        
    const handleSubmitReview = (rating: number, comment: string) => {
        if (currentItem) {
            dispatch(addExamReview({ id: currentItem._id, rating, comment }));
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorComponent error={error} />;
    if (!currentItem) return <ErrorComponent error="Exam not found." />;

    return (
        <>
            <LayoutParticles />
            <PreviewExamForm 
                exam={currentItem}
                onStartExam={() => handleStartPart(-1)}
                onStartPart={handleStartPart}
                isFilterOpen={isFilterOpen}
                onToggleFilter={handleToggleFilter}
                onCloseFilter={handleCloseFilter}
                onSelectFilter={handleSelectFilter}
                userScore={userScore}
                onSubmitReview={handleSubmitReview}
            />
        </>
    );
};