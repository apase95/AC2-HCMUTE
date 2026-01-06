import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { fetchDocumentById, clearCurrentItem as clearDoc } from "../redux/documentSlice";
import { fetchBlogById, clearCurrentItem as clearBlog } from "../redux/blogSlice";
import { PostDetailForm } from "../forms/PostDetailForm";
import { ErrorComponent } from "../components/sub/ErrorComponent";

export const PostDetailPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const dispatch = useDispatch<AppDispatch>();

    const isBlog = location.pathname.includes("blogs");

    const blogState = useSelector((state: RootState) => state.blogs);
    const docState = useSelector((state: RootState) => state.documents);

    const { currentItem, loading, error } = isBlog ? blogState : docState;

    useEffect(() => {
        if (!id) return;
        if (isBlog) dispatch(fetchBlogById(id));
        else dispatch(fetchDocumentById(id));
        return () => {
            if (isBlog) dispatch(clearBlog());
            else dispatch(clearDoc());
        };
    }, [id, isBlog, dispatch]);

    if (error) return <ErrorComponent error={error} />;

    if (!currentItem) {
        return <PostDetailForm loading={true} title="" content="" authorName="" createdAt="" readTime="" tags={[]} />;
    }

    return (
        <>
            <PostDetailForm
                loading={loading}
                title={currentItem.title}
                content={currentItem.content}
                coverImage={currentItem.coverImage}
                authorName={currentItem.author?.displayName || "Unknown Author"}
                authorAvatar={currentItem.author?.avatarURL}
                createdAt={currentItem.createdAt}
                readTime={currentItem.readTime || "5 minutes"}
                tags={currentItem.tags || []}
                id={currentItem._id}
                authorId={currentItem.author?._id}
                type={isBlog ? "Blog" : "DocumentSchema"}
            />
        </>
    );
};
