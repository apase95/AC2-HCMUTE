import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Header } from "../components/main/Header";
import { Footer } from "../components/main/Footer";
import { fetchBlogs } from "../redux/blogSlice";
import { fetchDocuments } from "../redux/documentSlice";
import { fetchExams } from "../redux/examSlice";
import type { AppDispatch, RootState } from "../redux/store";
import { BannerHomePage } from "../forms/BannerHomePage";
import { SearchResultForm } from "../forms/SearchResultForm";
import { LoadingSpinner } from "../components/sub/LoadingSpinner";

export const HomePage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [searchParams] = useSearchParams();
    const searchTerm = searchParams.get("search")?.toLowerCase() || "";

    const { items: blogs, loading: blogLoading } = useSelector((state: RootState) => state.blogs);
    const { items: documents, loading: docLoading } = useSelector((state: RootState) => state.documents);
    const { items: exams, loading: examLoading } = useSelector((state: RootState) => state.exams);

    useEffect(() => {
        if (blogs.length === 0) dispatch(fetchBlogs());
        if (documents.length === 0) dispatch(fetchDocuments());
        if (exams.length === 0) dispatch(fetchExams());
    }, [dispatch, blogs.length, documents.length, exams.length]);

    const filteredResults = useMemo(() => {
        if (!searchTerm) return { blogs: [], documents: [], exams: [] };
        
        const matchesSearch = (item: any) => {
            return (
                item.tags?.some((tag: string) => tag.toLowerCase().includes(searchTerm)) ||
                item.title.toLowerCase().includes(searchTerm) ||
                item.author?.displayName.toLowerCase().includes(searchTerm) ||
                (item.content && item.content.toLowerCase().includes(searchTerm))
            );
        }
        return {
            blogs: blogs.filter(matchesSearch),
            documents: documents.filter(matchesSearch),
            exams: exams.filter(matchesSearch)
        };
    }, [searchTerm, blogs, documents, exams]);

    const isLoading = blogLoading || docLoading || examLoading;

    return (
        <>
            <Header />
            <div className="relative min-h-screen h-auto w-full grid-pattern">
                <div className="mx-auto py-24 w-[90%] lg:w-[80%]">        
                    {isLoading && (
                        <LoadingSpinner />
                    )}

                    {!isLoading && !searchTerm && (
                        <BannerHomePage />
                    )}

                    {!isLoading && searchTerm && (
                        <SearchResultForm searchTerm={searchTerm} filteredResults={filteredResults} />
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};