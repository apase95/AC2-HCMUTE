import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface PaginationControlProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const PaginationControl: React.FC<PaginationControlProps> = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages + 2) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);

            let startPage = Math.max(2, currentPage - 1);
            let endPage = Math.min(totalPages - 1, currentPage + 1);

            if (currentPage <= 3) {
                startPage = 2;
                endPage = 4;
            }

            if (currentPage >= totalPages - 2) {
                startPage = totalPages - 3;
                endPage = totalPages - 1;
            }

            if (startPage > 2) {
                pages.push("...");
            }

            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }

            if (endPage < totalPages - 1) {
                pages.push("...");
            }

            pages.push(totalPages);
        }
        return pages;
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <div className="flex items-center justify-center space-x-2 mt-12">
            <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className={`w-9 h-9 flex-center rounded-lg transition-colors ${
                    currentPage === 1
                        ? "text-white/30 cursor-not-allowed"
                        : "text-white/70 hover:bg-primary hover:text-white"
                }`}
            >
                <FaChevronLeft size={16} />
            </button>

            {getPageNumbers().map((page, index) => (
                <React.Fragment key={index}>
                    {page === "..." ? (
                        <span className="text-white/50 px-2">...</span>
                    ) : (
                        <button
                            onClick={() => onPageChange(page as number)}
                            className={`w-9 h-9 flex-center rounded-lg text-sm font-medium transition-all ${
                                currentPage === page
                                    ? "bg-primary text-white shadow-lg shadow-primary/30"
                                    : "text-white/70 hover:bg-primary hover:text-white"
                            }`}
                        >
                            {page}
                        </button>
                    )}
                </React.Fragment>
            ))}

            <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`w-9 h-9 flex-center rounded-lg transition-colors ${
                    currentPage === totalPages
                        ? "text-white/30 cursor-not-allowed"
                        : "text-white/70 hover:bg-primary hover:text-white"
                }`}
            >
                <FaChevronRight size={16} />
            </button>
        </div>
    );
};
