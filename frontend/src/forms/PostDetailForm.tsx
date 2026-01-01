import { useEffect, useState } from "react";
import { FaCalendarAlt, FaClock, FaFileAlt } from "react-icons/fa";
import { LoadingSpinner } from "../components/sub/LoadingSpinner";
import { TagListComponent } from "../components/sub/TagListComponent";
import { MarkdownRenderer } from "../components/handleFilePreview/markdown/MarkdownRenderer";
import { TableOfContent } from "../components/sub/TableOfContent";
import { slugifyFormat } from "../utils/textUtils";

interface PostDetailFormProps {
    title: string;
    content: string;
    coverImage?: string;
    authorName: string;
    authorAvatar?: string;
    createdAt: string;
    readTime: string;
    tags?: string[];
    loading: boolean;
}

const unescapeMarkdown = (text: string) => {
    if (!text) return "";
    return text
         .replace(/^\\#/gm, '#')
        .replace(/\\\*/g, '*')
        .replace(/^\\-/gm, '-')
        .replace(/\\`/g, '`')
        .replace(/\\\[/g, '[')
        .replace(/\\\]/g, ']')
        .replace(/^\\\|/gm, '|')
        .replace(/\\\|/g, '|');
};

const extractHeadings = (markdown: string) => {
    const lines = markdown.split('\n');
    const headings = [];
    const regex = /^(#{1,3})\s+(.*)$/;
    
    for (const line of lines) {
        const match = line.match(regex);
        if (match) {
            const rawText = match[2].trim();
            const displayText = rawText.replace(/(\*\*|__)(.*?)\1/g, '$2')
                                       .replace(/(\*|_)(.*?)\1/g, '$2')
                                       .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
                                       .replace(/<[^>]*>?/gm, ''); 
            headings.push({
                level: match[1].length,
                text: displayText,
                id: slugifyFormat(displayText)
            });
        }
    }
    return headings;
};

export const PostDetailForm = (props: PostDetailFormProps) => {
    const [textContent, setTextContent] = useState<string>("");
    const [fileType, setFileType] = useState<string>("");
    const [headings, setHeadings] = useState<{level: number; text: string; id: string;}[]>([]);

    useEffect(() => {
        const getExtension = (url: string) => url ? url.split(/[#?]/)[0].split('.').pop()?.toLowerCase() || "" : "";
        const ext = getExtension(props.content);
        setFileType(ext);

        if (ext === "md" || ext === "txt") {
            fetch(props.content)
                .then((res) => res.text())
                .then((text) => {
                    const cleanMarkdown = unescapeMarkdown(text);
                    setTextContent(cleanMarkdown);
                    setHeadings(extractHeadings(cleanMarkdown));
                })
                .catch((err) => console.error("Error fetching text content:", err));
        }
    }, [props.content]);

    if (props.loading) return <LoadingSpinner />;

    const renderMainContent = () => {
        if (fileType === "md" || fileType === "txt") {
            return <MarkdownRenderer content={textContent} />;
        }
        if (fileType === "pdf") {
            return (
                <iframe 
                    src={props.content} 
                    className="w-full h-screen rounded-lg border border-white/10 bg-white" 
                    title="PDF Viewer"
                />
            );
        }
        if (fileType === "doc" || fileType === "docx") {
            return (
                <iframe 
                    src={`https://docs.google.com/gview?url=${props.content}&embedded=true`} 
                    className="w-full h-[800px] rounded-lg border border-white/20 bg-white"
                    title="Office Viewer"
                />
            )
        }
        if (["jpg", "jpeg", "png", "gif", "webp"].includes(fileType)) {
            return (
                <div className="flex justify-center bg-[#151718] p-4 rounded-xl border border-white/10">
                    <img 
                        src={props.content} 
                        alt="Content" 
                    className="max-w-full rounded-lg shadow-lg" />
                </div>      
            );
        }
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-white/5
                rounded-xl border border-dashed border-white/20 gap-6"
            >
                <div className="text-center space-y-2">
                    <h3 className="text-2xl font-bold text-white">Preview not available</h3>
                    <p className="text-white/60">Please open the original file to view it.</p>
                </div>
            </div>
        );
    };

    return (
        <div className="relative min-h-screen h-auto w-full pt-16 pb-20 !overflow-visible grid-pattern">
            <div className={`mx-auto w-[90%] ${fileType === "md" || fileType === "txt" ? "lg:w-[90%]" : "lg:w-[60%]"} 
                flex flex-col lg:flex-row gap-5 items-start
            `}>
                <div className="flex-1 min-w-0 w-full">
                    <div className="bg-white/5 p-6 md:p-8 rounded-t-xl border-x border-t border-white/20">
                        <h1 className="mb-4 text-3xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
                            {props.title}
                        </h1>
                        <TagListComponent tags={props.tags || []} paddingButton="px-3 py-1" />
                        <div className="w-full mt-4 flex items-center gap-6 text-sm font-medium text-gray-400">
                            <div className="flex items-center gap-2">
                                <img src={props.authorAvatar || "/logo.jpg"} alt="author" className="w-8 h-8 rounded-full border border-gray-600" /> 
                                <span className="text-white">{props.authorName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaCalendarAlt /> <span>{new Date(props.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaClock /> <span>{props.readTime}</span>
                            </div>
                        </div>
                    </div>

                    {renderMainContent()}

                    <div className="mt-6 flex justify-end">
                        <a href={props.content} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-purple-700 text-white font-bold rounded-lg transition-all"
                        >
                            <FaFileAlt /> <span>Open original file</span>
                        </a>
                    </div>
                </div>

                {(fileType === "md" || fileType === "txt") && headings.length > 0 && (
                    <TableOfContent headings={headings} />
                )}
            </div>
        </div>
    );
};