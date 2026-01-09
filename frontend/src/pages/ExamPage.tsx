import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { CategoryFilterComponent } from "../components/sub/CategoryFilterComponent";
import { ExamCard } from "../forms/ExamCard";
import { fetchExams } from "../redux/examSlice";
import { LoadingSpinner } from "../components/sub/LoadingSpinner";
import { ErrorComponent } from "../components/sub/ErrorComponent";
import { LayoutParticles } from "../components/sub/LayoutParticles";
import { PaginationControl } from "../components/sub/PaginationControl";

export const ExamPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items: allExams, loading, error, pagination } = useSelector((state: RootState) => state.exams);

    const [activeTag, setActiveTag] = useState<string>("All");
    const [activeSort, setActiveSort] = useState<string>("Popular");

    useEffect(() => {
        dispatch(fetchExams({ page, limit: 12 }));
    }, [dispatch, page]);

    const filteredExams = useMemo(() => {
        let result = [...allExams];

        if (activeTag !== "All") {
            result = result.filter((exam) => exam.tags && exam.tags.includes(activeTag));
        }

        switch (activeSort) {
            case "Latest":
                result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                break;
            case "Oldest":
                result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                break;
            case "Popular":
                result.sort((a, b) => (b.submittedCount || 0) - (a.submittedCount || 0));
                break;
        }
        return result;
    }, [allExams, activeTag, activeSort]);

    return (
        <>
            <LayoutParticles />
            <div className="relative min-h-screen h-auto w-full grid-pattern">
                <div className="mx-auto py-12 lg:w-[80%] md:w-[90%] sm:w-[80%] w-[90%]">
                    <CategoryFilterComponent
                        tags={["CP", "SA", "DOE", "SO", "AN"]}
                        selectedTag={activeTag}
                        selectedSort={activeSort}
                        onSelectTag={(tag) => setActiveTag(tag)}
                        onSelectSort={(sort) => setActiveSort(sort)}
                    />

                    <div className="w-full mt-3 grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-8">
                        {loading ? (
                            <LoadingSpinner />
                        ) : error ? (
                            <ErrorComponent error={error} inBlock={true} />
                        ) : filteredExams.length > 0 ? (
                            filteredExams.map((exam) => (
                                <ExamCard
                                    key={exam._id}
                                    bgColor="bg-primary-dark/40"
                                    currentWidth="w-full"
                                    data={exam}
                                    disableZoom={false}
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-center text-white/60">No exams found.</div>
                        )}
                    </div>

                    {pagination && (
                        <div className="mb-12">
                            <PaginationControl
                                currentPage={pagination.currentPage}
                                totalPages={pagination.totalPages}
                                onPageChange={setPage}
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
