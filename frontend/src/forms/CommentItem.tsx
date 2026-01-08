import { useRef, useState } from "react";
import { IoMdMore } from "react-icons/io";
import { PopupMoreOption } from "./PopupMoreOption";
import { useClickOutside } from "../hooks/useClickOutside";
import { ButtonBase } from "../components/sub/ButtonBase";

interface CommentType {
    _id: string;
    content: string;
    author: {
        _id: string;
        displayName: string;
        avatarURL?: string;
    };
    createdAt: string;
}

interface CommentItemProps {
    comment: CommentType;
    currentUserId?: string;
    postAuthorId?: string;
    onDelete: (id: string) => void;
    onEdit: (id: string, content: string) => void;
}

export const CommentItem = ({ comment, currentUserId, postAuthorId, onDelete, onEdit }: CommentItemProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useClickOutside(menuRef, () => setIsOpen(false));

    const isOwner = currentUserId === (typeof comment.author === "string" ? comment.author : comment.author?._id);
    const isPostOwner = currentUserId === postAuthorId;
    const canDelete = isOwner || isPostOwner;
    const canEdit = isOwner;

    const handleEditSave = () => {
        if (editContent.trim() !== "") {
            onEdit(comment._id, editContent);
            setIsEditing(false);
        }
    };

    const handleDelete = () => {
        setIsOpen(false);
        if (confirm("Are you sure you want to delete this comment?")) {
            onDelete(comment._id);
        }
    };

    return (
        <div className="bg-white/5 p-4 rounded-lg border border-white/40 mb-4 flex flex-col items-start w-full">
            <div className="flex justify-between items-start w-full mb-2">
                <div className="flex items-center gap-3">
                    <img
                        src={comment.author.avatarURL || "/logo.jpg"}
                        alt={comment.author.displayName}
                        className="w-10 h-10 rounded-full object-cover border border-white/20"
                    />
                    <div className="flex flex-col">
                        <span className="text-white font-bold text-sm">
                            {comment.author.displayName}
                        </span>
                        <span className="text-white/40 text-xs">
                            {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                {(canEdit || canDelete) && !isEditing && (
                    <div ref={menuRef} className="relative more-btn">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsOpen(!isOpen);
                            }}
                            className="p-2 rounded-full hover:bg-white/10 transition-all 
                                text-white/70 hover:text-white"
                        >
                            <IoMdMore size={20} />
                        </button>
                        {isOpen && (
                            <PopupMoreOption
                                isOpen={isOpen}
                                onEdit={
                                    canEdit
                                        ? () => {
                                              setIsOpen(false);
                                              setIsEditing(true);
                                          }
                                        : undefined
                                }
                                onDelete={canDelete ? handleDelete : undefined}
                            />
                        )}
                    </div>
                )}
            </div>

            <div className="w-full pl-12">
                {isEditing ? (
                    <div className="w-full flex flex-col gap-2">
                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="custom-scrollbar w-full bg-white/5 text-white border border-white/40 rounded-md 
                                p-3 focus:outline-none focus:border-white/80 min-h-[80px]"
                        />
                        <div className="flex justify-end gap-2">
                            <ButtonBase
                                type="submit" 
                                onClick={() => setIsEditing(false)}
                                width="w-22"
                                name={"Cancel"}
                                textColor="text-white"
                                bgColor="bg-gray-400/30"
                                subClassName="hover:bg-gray-500/30"
                                disabled={false}
                            />
                            <ButtonBase
                                type="submit" 
                                onClick={handleEditSave}
                                width="w-22"
                                name={"Save"}
                                textColor="text-white"
                                bgColor="bg-secondary/80"
                                subClassName="hover:bg-secondary/40"
                                disabled={false}
                            />
                        </div>
                    </div>
                ) : (
                    <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">
                        {comment.content}
                    </p>
                )}
            </div>
        </div>
    );
};
