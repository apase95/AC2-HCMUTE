import { useState } from "react";
import { FaArrowLeft, FaArrowRight, FaCheck, FaClock, FaTimes } from "react-icons/fa";
import { FaBookmark, FaRegBookmark } from "react-icons/fa6";
import type { Question } from "../Types";
import { LuPanelLeftClose, LuPanelRightClose } from "react-icons/lu";
import { useNavigate, useParams } from "react-router-dom";

interface QuizInterfaceFormProps {
    questions: Question[];
    currentQuestionIndex: number;
    selectedAnswers: string[];
    userAnswers: Record<number | string, string[]>;
    timeLeft: number;
    showResult?: boolean;
    bookmarkedQuestions: (number | string)[];
    onOptionSelect: (optionIs: string) => void;
    onNext: () => void;
    onPrevious: () => void;
    onJumpToQuestion: (index: number) => void;
    onFinish: () => void;
    onToggleBookmark: (questionId: number | string) => void;
};

export const QuizInterfaceForm = ( props : QuizInterfaceFormProps) => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 48 * 16 ? true : false);
    const currentQuestion : Question = props.questions[props.currentQuestionIndex];
    const correctCount = props.questions.reduce((acc, q) => {
        const userAnswer = props.userAnswers[q.id] || [];
        const isCorrect = 
            userAnswer.length === q.correctAnswers.length &&
            userAnswer.sort().toString() === [...q.correctAnswers].sort().toString();
        return isCorrect ? acc + 1 : acc;
    }, 0);

    const answeredCount = Object.keys(props.userAnswers).length;
    const progressText = props.showResult 
        ? `${correctCount}/${props.questions.length}`
        : `${answeredCount}/${props.questions.length}`;

    const progressionPercentage = props.showResult
        ? (correctCount / props.questions.length) * 100
        : (answeredCount / props.questions.length) * 100;

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };
    
    return (
        <div className="w-full flex h-screen bg-neutral-900 text-white
             overflow-hidden code-scrollbar select-none">
            {/* SIDEBAR */}
            {isSidebarOpen && (
                <div className="w-[300px] bg-neutral-800 flex flex-col items-center border-r border-neutral-600">
                    <div className="w-full flex justify-between items-center mt-4 px-1 md:px-6">
                        <span className="font-semibold pl-2 pr-10 md:px-0">Questions List</span>
                        <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400 hover:text-white">
                            <LuPanelLeftClose size={20}/>
                        </button>
                    </div>
                    <span className="w-full mt-[23px] border-b border-neutral-600"></span>
                    <h2 className="w-full px-2 md:px-11 mt-6 mb-2 text-lg font-semibold text-left">
                        {`Question ${props.currentQuestionIndex + 1} `}
                    </h2>

                    <div className="w-full flex-1 overflow-y-auto px-2 md:px-10 pb-4 code-scrollbar">
                        <div className="mt-1 grid grid-cols-4 gap-1 md:grid-cols-5 md:gap-2">
                        {props.questions.map((question, idx) => {
                            const isCurrent = idx === props.currentQuestionIndex;
                            const userAnswer = props.userAnswers[question.id] || [];
                            const isAnswered = userAnswer.length > 0;
                            const isBookmarked = props.bookmarkedQuestions.includes(question.id);

                            let colorClass = "";
                            if (props.showResult) {
                                const isCorrect = 
                                    userAnswer.length === question.correctAnswers.length &&
                                    userAnswer.sort().toString() === [...question.correctAnswers].sort().toString();
                                if (isCorrect) {
                                    colorClass = "bg-green-600/60 border-green-600 text-white";
                                } else {
                                    colorClass = "bg-red-600/60 border-red-600 text-white";
                                }
                                if (isCurrent) colorClass += " ring-2 ring-white border-transparent";
                            } else {
                                if (isCurrent) {
                                    colorClass = "border-purple-500 text-purple-400 bg-purple-500/10 font-bold";
                                } else if (isBookmarked) {
                                    colorClass = "bg-yellow-600/30 border-yellow-600 text-white";
                                } else if (isAnswered) {
                                    colorClass = "bg-accent/60 border-accent text-white";
                                } else {
                                    colorClass = "border-gray-400 text-gray-400 hover:border-gray-200 hover:text-gray-200";
                                }
                            }

                            return (
                                <button 
                                    key={question.id}
                                    onClick={() => props.onJumpToQuestion(idx)}
                                    className={`
                                        aspect-square w-full flex-center border transition-all-300 rounded-lg
                                        ${colorClass}
                                    `}
                                >
                                    {idx + 1}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
            )}

            {/* CONTENT */}
            <main className="w-full flex-1 flex flex-col relative">
                <header className="h-16 border-b border-neutral-600 flex items-center justify-between px-1 md:px-6">
                    <div className="flex items-center gap-4 w-full">
                        {!isSidebarOpen && (
                            <button onClick={() => setIsSidebarOpen(true)} 
                                className="mr-2 text-gray-400 hover:text-white">
                                <LuPanelRightClose size={20} />
                            </button>
                        )}
                        <span className="px-2 py-1 bg-neutral-800/50 text-xs font-semibold rounded border border-neutral-600 text-gray-300">
                            {props.showResult ? "Result Mode" : "Exam Mode"}
                        </span>
                        
                        <div className="flex-1 flex items-center gap-4 max-w-xl mx-auto">
                            <span className={`text-sm w-16 text-right font-medium 
                                    ${props.showResult ? 'text-green-400' : 'text-gray-300'}`}
                            >
                                {progressText}
                            </span>
                            <div className="flex-1 hidden md:block h-2 bg-neutral-800 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full transition-all duration-300
                                        ${props.showResult ? 'bg-green-500' : 'bg-gray-300'}`}
                                    style={{ width: `${progressionPercentage}%` }}
                                ></div>
                            </div>
                            {!props.showResult && (
                                <span className="text-sm font-mono text-gray-300 flex items-center gap-2">
                                    <FaClock /> {formatTime(props.timeLeft)}
                                </span>
                            )}
                        </div>

                        {!props.showResult ? (
                            <button 
                                onClick={props.onFinish}
                                className="px-4 py-1.5 border border-purple-400 text-purple-400
                                    text-sm font-semibold rounded hover:bg-purple-900/60 transition-colors"
                            >
                                Finish test
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button onClick={() => window.location.reload()}
                                    className="px-4 py-1.5 bg-purple-700 text-white text-sm font-semibold
                                        rounded hover:bg-purple-600 transition-colors"
                                >
                                    Retry
                                </button>
                                <button onClick={() => navigate(`/exams/${id}`)}
                                        className="px-4 py-1.5 border border-purple-400 text-purple-400
                                            text-sm font-semibold rounded hover:bg-purple-900/60 transition-colors"
                                >
                                    Exit
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                <div className="flex-1 px-4 md:px-8 overflow-y-auto py-6 max-w-5xl mx-auto w-full">
                    <div className="mb-4  flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-400 text-md">
                            <span className="font-semibold">Question {props.currentQuestionIndex + 1}:</span>
                        </div>
                        
                        <button 
                            onClick={() => props.onToggleBookmark(currentQuestion.id)}
                            className={`flex items-center gap-2 px-3 py-1 rounded border transition-colors
                                ${props.bookmarkedQuestions.includes(currentQuestion.id) 
                                    ? "bg-yellow-600/20 border-yellow-600 text-yellow-500" 
                                    : "border-neutral-600 text-gray-400 hover:border-gray-400"}
                            `}
                        >
                            {props.bookmarkedQuestions.includes(currentQuestion.id) ? <FaBookmark /> : <FaRegBookmark />}
                            <span className="text-sm font-medium">Marked</span>
                        </button>
                    </div>

                    <h2 className="text-xl lg:text-2xl font-medium mb-2 leading-relaxed text-white">
                        {currentQuestion.text}
                    </h2>
                    
                    <div className="space-y-4 mt-8">
                        {currentQuestion.options.map((option) => {
                            const isSelected = props.selectedAnswers.includes(option.id);
                            const isCorrect = currentQuestion.correctAnswers?.includes(option.id);
                            
                            let containerClass = "border-neutral-600 bg-transparent hover:border-gray-500";
                            let icon = null;

                            if (props.showResult) {
                                if (isCorrect) {
                                    containerClass = "border-green-500 bg-green-900/20";
                                    icon = <FaCheck className="text-green-500" size={12} />;
                                } else if (isSelected && !isCorrect) {
                                    containerClass = "border-red-500 bg-red-900/20";
                                    icon = <FaTimes className="text-red-500" size={12} />;
                                } else {
                                    containerClass = "border-neutral-600 opacity-50";
                                }
                            } else {
                                if (isSelected) {
                                    containerClass = "border-white";
                                    icon = <FaCheck size={12} />;
                                }
                            }

                            return (
                                <div
                                    key={option.id}
                                    onClick={() => !props.showResult && props.onOptionSelect(option.id)}
                                    className={`
                                        group relative p-4 rounded-lg border cursor-pointer transition-all flex items-start gap-4
                                        ${containerClass}
                                    `}
                                >
                                    <div className={`
                                        w-5 h-5 mt-0.5 rounded border flex items-center justify-center flex-shrink-0
                                        ${props.showResult && isCorrect ? 'border-green-500' : ''}
                                        ${props.showResult && isSelected && !isCorrect ? 'border-red-500' : ''}
                                        ${!props.showResult && isSelected ? 'bg-white border-white text-black' : 'border-gray-500'}
                                    `}>
                                        {icon}
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-gray-300 text-base">{option.text}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    
                    {/* Explain */}
                    {props.showResult && (
                        <div className="mt-8 p-4 bg-blue-900/20 border border-blue-800 rounded-lg text-blue-200">
                            <strong>Correct Answer: </strong> 
                            {currentQuestion.options.filter(o => currentQuestion.correctAnswers?.includes(o.id)).map(o => o.text).join(", ")}
                        </div>
                    )}
                </div>

                <footer className="h-16 border-t border-neutral-600 px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* Placeholder */}
                    </div>
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={props.onPrevious}
                            disabled={props.currentQuestionIndex === 0}
                            className="w-10 h-10 flex-center border-2 border-purple-500 rounded 
                                text-purple-500 disabled:opacity-30 hover:bg-purple-500/30"
                        >
                            <FaArrowLeft />
                        </button>
                        <button 
                            onClick={props.onNext}
                            disabled={props.currentQuestionIndex === props.questions.length - 1}
                            className="w-10 h-10 flex items-center justify-center rounded 
                                bg-purple-700 text-white hover:bg-purple-600 disabled:opacity-30"
                        >
                            <FaArrowRight />
                        </button>
                    </div>
                </footer>
            </main>
        </div>
    );
}

