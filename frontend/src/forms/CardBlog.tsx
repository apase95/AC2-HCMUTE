import { FaBookOpen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { TagListComponent } from "../components/sub/TagListComponent";
import { IoMdMore } from "react-icons/io";
import React, { useRef, useState } from "react";
import { PopupMoreOption } from "./PopupMoreOption";
import { useClickOutside } from "../hooks/useClickOutside";
import type { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../redux/store";
import { deleteBlog } from "../redux/blogSlice";
import { deleteDocument } from "../redux/documentSlice";

interface CardProps {
    id?: string;
    type?: "blog" | "document";
    subClassName?: string;
    maxWidth?: string;
    minWidth?: string;
    currentWidth: string;
    bgColor?: string;
    title: string;
    author: string;
    authorId?: string;
    subscription?: string;
    tags: string[];
    views: number;
    duration: string;
    logoURL?: string;
    disableZoom?: boolean;
}

export const CardBlog: React.FC<CardProps> = (props: CardProps) => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const zoomClass = props.disableZoom ? "" : "hover:scale-105";
    const { user } = useSelector((state: RootState) => state.auth);
    const isOwnerOrAdmin = user && (user.role === "admin" || user._id === props.authorId);
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useClickOutside(menuRef, () => setIsOpen(false));

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if ((e.target as HTMLElement).closest(".more-btn")) return;
        if (props.id && props.type) {
            navigate(`/${props.type}s/${props.id}`);
        }
    };
    const handleDelete = async () => {
        setIsOpen(false);
        if (!props.id) return;

        if (confirm("Are you sure you want to delete this?")) {
            if (props.type === "blog") {
                dispatch(deleteBlog(props.id));
            } else if (props.type === "document") {
                dispatch(deleteDocument(props.id));
            }
        }
    };
    const handleEdit = () => {
        setIsOpen(false);
        navigate(`/${props.type}s/edit/${props.id}`);
    };

    return (
        <div
            onClick={handleClick}
            className={`
            ${props.maxWidth} ${props.minWidth} ${props.currentWidth} ${props.bgColor}
            pb-4 h-full flex flex-col items-start justify-start rounded-lg transition-all-300 cursor-pointer 
            ${props.subClassName} ${zoomClass}`}
        >
            <button
                className="w-full aspect-[16/9] rounded-lg overflow-hidden
            outline outline-[1px] outline-primary-dark/80 shadow-lg"
            >
                <img src={props.logoURL || "/card-default.jpg"} alt="card" draggable={false} />
            </button>

            <TagListComponent tags={props.tags} />
            <div className="w-full flex-between flex-row">
                <button className="px-4 w-full leading-8 text-2xl text-left font-bold text-white line-clamp-1">
                    {props.title}
                </button>
                {isOwnerOrAdmin && (
                    <div ref={menuRef} className="relative more-btn">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsOpen(!isOpen);
                            }}
                            className="relative font-bold p-2 rounded-full hover:bg-white/10 transition-all-300"
                        >
                            <IoMdMore size={22} />
                        </button>
                        {isOpen && <PopupMoreOption isOpen={isOpen} onEdit={handleEdit} onDelete={handleDelete} />}
                    </div>
                )}
            </div>

            {props.subscription && (
                <button className="px-4 w-full text-sm text-left font-semibold text-white/60 line-clamp-2 break-all">
                    {props.subscription}
                </button>
            )}

            <button
                className="mt-auto px-4 text-sm text-left font-semibold text-white line-clamp-1 break-all
            hover:text-white/60 transition-all-300"
            >
                {props.author}
            </button>

            <div className="pl-4 w-full flex flex-row items-center justify-start space-x-2">
                <div className="text-white/60">
                    <FaBookOpen size="16" />
                </div>
                <p className="text-white/60">{props.duration}</p>
                <div className="text-white/60">•</div>
                <p className="text-white/60">
                    {props.views > 1 ? `${props.views} views` : `${props.views} view`}
                </p>
            </div>
        </div>
    );
};
