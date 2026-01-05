import { useEffect, useMemo, useState } from "react";
import { QuizInterfaceForm } from "../forms/QuizInterfaceForm";
import { useLocation, useParams } from "react-router-dom";
import type { Question } from "../Types";
import { ErrorComponent } from "../components/sub/ErrorComponent";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { fetchExamById, submitExamResult } from "../redux/examSlice";
import { LoadingSpinner } from "../components/sub/LoadingSpinner";

export const QuizExamPage = () => {
    const { id } = useParams<{ id: string }>();
    // const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch<AppDispatch>();

    const { currentItem: exam, loading, error } = useSelector((state: RootState) => state.exams);
    const partIndex = location.state?.partIndex ?? -1;

    useEffect(() => {
        if (id && (!exam || exam._id !== id)) {
            dispatch(fetchExamById(id));
        }
    }, [id, dispatch, exam]);

    const questionsToDisplay: Question[] = useMemo(() => {
        if (!exam || !exam.parts) return [];
        if (partIndex === -1) {
            return exam.parts.flatMap(part => part.questions);
        } else {
            const selectedPart = exam.parts[partIndex];
            return selectedPart ? selectedPart.questions : [];
        }
    }, [exam, partIndex]);

    const allQuestions: Question[] = useMemo(() => {
        if (!exam || !exam.parts) return [];
        return exam.parts.flatMap(part => part.questions);
    }, [exam]);

    const [bookmarkedQuestions, setBookmarkedQuestions] = useState<(number | string)[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<Record<number | string, string[]>>({});
    const [timeLeft, setTimeLeft] = useState(90 * 60); 
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleFinish = async (forceSubmit = false) => {
        if (!isSubmitted) {
            if (forceSubmit || confirm("Are you sure you want to submit?")) {
                setIsSubmitted(true);

                const correctCount = allQuestions.reduce((acc, q) => {
                    const userAnswer = userAnswers[q.id] || [];
                    const isCorrect = 
                        userAnswer.length === q.correctAnswers.length &&
                        userAnswer.sort().toString() === [...q.correctAnswers].sort().toString();
                    return isCorrect ? acc + 1 : acc;
                }, 0);

                const scorePercent = Math.round((correctCount / allQuestions.length) * 100);

                if (id) {
                    await dispatch(submitExamResult({ id, score: scorePercent }));
                }
            }
        }
    };

    useEffect(() => {
        if (isSubmitted) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 0) {
                    clearInterval(timer);
                    handleFinish(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [isSubmitted]);

    const handleOptionSelect = (optionId: string) => {
        if (isSubmitted) return;

        const questionId = questionsToDisplay[currentQuestionIndex].id as number;
        const currentType = questionsToDisplay[currentQuestionIndex].type;
        
        setUserAnswers(prev => {
            const currentSelected = prev[questionId] || [];
            
            if (currentType === 'single') {
                return { ...prev, [questionId]: [optionId] };
            } else {
                if (currentSelected.includes(optionId)) {
                    return { ...prev, [questionId]: currentSelected.filter(id => id !== optionId) };
                } else {
                    return { ...prev, [questionId]: [...currentSelected, optionId] };
                }
            }
        });
    };

    const handleNext = () => {
        if (currentQuestionIndex < questionsToDisplay.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleJump = (index: number) => {
        setCurrentQuestionIndex(index);
    };

    const handleToggleBookmark = (questionId: number | string) => {
        setBookmarkedQuestions(prev => {
            if (prev.includes(questionId)) {
                return prev.filter(id => id !== questionId);
            } else {
                return [...prev, questionId];
            }
        });
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorComponent error={error} />;
    if (!exam || questionsToDisplay.length === 0) 
        return <ErrorComponent error="Exam not found or has no questions." />;

    return (
        <QuizInterfaceForm
            questions={questionsToDisplay}
            currentQuestionIndex={currentQuestionIndex}
            selectedAnswers={userAnswers[questionsToDisplay[currentQuestionIndex].id] || []}
            userAnswers={userAnswers}
            timeLeft={timeLeft}
            showResult={isSubmitted}
            bookmarkedQuestions={bookmarkedQuestions}
            onToggleBookmark={handleToggleBookmark}
            onOptionSelect={handleOptionSelect}
            onNext={handleNext}
            onPrevious={handlePrev}
            onJumpToQuestion={handleJump}
            onFinish={() => handleFinish(false)}
        />
    );
};