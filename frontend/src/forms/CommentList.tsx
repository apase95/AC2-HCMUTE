import { useState, useEffect } from "react";
import api from "../libs/api";
import { CommentItem } from "./CommentItem";
import { LoadingSpinner } from "../components/sub/LoadingSpinner";
import { ButtonBase } from "../components/sub/ButtonBase";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import type { CommentType } from "../Types";

interface CommentListProps {
    postId: string;
    postAuthorId?: string;
    onModel: string;
}

export const CommentList = ({ postId, postAuthorId, onModel }: CommentListProps) => {
    const [comments, setComments] = useState<CommentType[]>([]);
    const [visibleCount, setVisibleCount] = useState(3);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [newComment, setNewComment] = useState("");
    const { user } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        const fetchComments = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/comments/${postId}`);
                setComments(res.data);
                setError("");
            } catch (err) {
                console.error(err);
                setError("Failed to load comments");
            } finally {
                setLoading(false);
            }
        };

        if (postId) fetchComments();
    }, [postId]);

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        try {
            const res = await api.post("/comments", {
                content: newComment,
                relatedId: postId,
                onModel: onModel,
            });
            setComments([res.data, ...comments]);
            setNewComment("");
        } catch (err) {
            console.error(err);
            alert("Failed to post comment");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/comments/${id}`);
            setComments(comments.filter((c) => c._id !== id));
        } catch (err) {
            console.error(err);
            alert("Failed to delete comment");
        }
    };

    const handleEdit = async (id: string, content: string) => {
        try {
            const res = await api.put(`/comments/${id}`, { content });
            setComments(comments.map((c) => (c._id === id ? res.data : c)));
        } catch (err) {
            console.error(err);
            alert("Failed to edit comment");
        }
    };

    return (
        <div className="w-full mt-10 border-t border-white/40 pt-8">
            <h3 className="text-2xl font-bold text-white mb-6 select-none">
                Comments ({comments.length})
            </h3>

            {user ? (
                <div className="flex gap-4 mb-8">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-white/80 select-none">
                        <img
                            src={user.avatarURL || "/logo.jpg"}
                            alt={user.displayName}
                            draggable={false}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex-1 flex flex-col gap-2 items-end select-none">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            className="custom-scrollbar w-full bg-white/5 border border-white/40 rounded-lg p-3 
                                text-white focus:border-white/80 focus:outline-none min-h-[100px]"
                        />
                        <ButtonBase
                            type="submit"
                            onClick={handleAddComment}
                            name={"Post Comment"}
                            textColor="text-white"
                            bgColor="bg-secondary/80"
                            subClassName="hover:bg-secondary/40"
                            disabled={false}
                        />
                    </div>
                </div>
            ) : (
                <p className="text-white/60 mb-8 italic">Please login to comment.</p>
            )}
            {error && <p className="text-red-400 mb-4 text-sm">{error}</p>}

            {loading ? (
                <LoadingSpinner />
            ) : (
                <div className="flex flex-col gap-4">
                    {comments.slice(0, visibleCount).map((comment) => (
                        <CommentItem
                            key={comment._id}
                            comment={comment}
                            currentUserId={user?._id}
                            postAuthorId={postAuthorId}
                            onDelete={handleDelete}
                            onEdit={handleEdit}
                        />
                    ))}
                    {comments.length === 0 && (
                        <p className="w-full text-center text-gray-200 italic">No comments yet.</p>
                    )}

                    {visibleCount < comments.length && (
                        <div className="w-full flex-center">
                            <ButtonBase
                                name="Show More"
                                onClick={() => setVisibleCount((prev) => prev + 3)}
                                bgColor="transparent"
                                hoverBgColor="hover:underline"
                                textColor="text-white/90"
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
