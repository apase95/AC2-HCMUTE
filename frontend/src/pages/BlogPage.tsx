import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { BlogsListComponent } from "../components/sub/BlogsListComponent";
import { CategoryFilterComponent } from "../components/sub/CategoryFilterComponent";
import { FeatureBanner } from "../components/sub/FeatureBanner";
import { fetchBlogs } from "../redux/blogSlice";
import { ErrorComponent } from "../components/sub/ErrorComponent";
import { LoadingSpinner } from "../components/sub/LoadingSpinner";
import { LayoutParticles } from "../components/sub/LayoutParticles";

export const BlogPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items: allBlogs, loading, error } = useSelector((state: RootState) => state.blogs);

    const [activeTag, setActiveTag] = useState<string>("All");
    const [activeSort, setActiveSort] = useState<string>("Popular");

    useEffect(() => {
        if (allBlogs.length === 0) {
            dispatch(fetchBlogs());
        }
    }, [dispatch, allBlogs.length]);

    const filteredBlogs = useMemo(() => {
        let result = [...allBlogs];

        if (activeTag !== "All") {
            result = result.filter(blog => blog.tags && blog.tags.includes(activeTag));
        }

        switch (activeSort) {
            case "Latest":
                result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                break;
            case "Oldest":
                result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                break;
            case "Popular":
                result.sort((a, b) => (b.views || 0) - (a.views || 0));
                break;
        }

        return result;
    }, [allBlogs, activeTag, activeSort]);

    const latestBlogs = useMemo(() => {
        return [...allBlogs]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 3);
    }, [allBlogs]);

    return (
        <>
            <LayoutParticles />
            <div className="relative min-h-screen h-auto w-full grid-pattern">
                <div className="mx-auto pt-14 pb-20 w-[90%] md:w-[80%]">
                    {!loading && latestBlogs.length > 0 && (
                        <FeatureBanner blogs={latestBlogs} />
                    )}
                    {loading ? (
                        <LoadingSpinner />
                    ) : error ? (
                        <ErrorComponent error={error} inBlock={true} />
                    ) : (
                        <>
                            <CategoryFilterComponent 
                                tags={["Frontend", "Backend", "Design", "AWS"]} 
                                selectedTag={activeTag}
                                selectedSort={activeSort}
                                onSelectTag={setActiveTag}
                                onSelectSort={setActiveSort}
                            />
                            <BlogsListComponent blogs={filteredBlogs} />
                        </>
                    )}
                </div>
            </div>
        </>
    );
};
