import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeRaw from "rehype-raw";
import rehypeKatex from "rehype-katex";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { MermaidBlock } from "./MermaidBlock";
import 'katex/dist/katex.min.css';
import { useState, type JSX, type ReactNode } from "react";
import { FaCheck } from "react-icons/fa6";
import { FaCopy } from "react-icons/fa";
import { slugifyFormat } from "../../../utils/textUtils";


interface MarkdownRendererProps {
    content: string;
}

const INTELLIJ_COLORS: Record<string, string> = {
    "blue": "#5CAFEF", "red": "#E06C75", "green": "#98C379",
    "yellow": "#E5C07B", "purple": "#C678DD", "orange": "#D19A66",
    "black": "#ABB2BF", "#1936C9": "#58a6ff"
};

const getNodeText = (node: ReactNode): string => {
    if (["string", "number"].includes(typeof node)) return node!.toString();
    if (node instanceof Array) return node.map(getNodeText).join("");
    if (typeof node === "object" && node && "props" in node) return getNodeText((node as any).props.children);
    return "";
};

const CodeBlock = ({ language, code }: { language: string, code: string }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="relative rounded-md overflow-hidden">                
            <div className="absolute right-0">
                <button 
                    onClick={handleCopy}
                    className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"
                    title="Copy code"
                >
                    {isCopied ? (
                        <>
                            <FaCheck className="text-green-500" size={14} />
                            <span className="text-green-500 font-semibold">Copied!</span>
                        </>
                    ) : (
                        <>
                            <FaCopy size={14} />
                            <span className="group-hover:text-white">Copy</span>
                        </>
                    )}
                </button>
            </div>
            
            <div className="code-scrollbar overflow-x-auto">
                <SyntaxHighlighter
                    PreTag="div"
                    children={code}
                    language={language}
                    style={vscDarkPlus}
                    customStyle={{ 
                        background: '#161b22', margin: 0, padding: '0.5rem',
                        fontSize: '14px', lineHeight: '1.6',
                        fontFamily: 'Consolas, monospace'
                    }}
                />
            </div>
        </div>
    );
};

const HeadingRenderer = ({ level, children }: { level: number, children: ReactNode }) => {
    const text = getNodeText(children);
    const id = slugifyFormat(text);
    const Tag = `h${level}` as keyof JSX.IntrinsicElements;
    return <Tag id={id}>{children}</Tag>;
};

export const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
    
    return (
        <div className="bg-[#14171d] text-[#c9d1d9] p-8 rounded-x-xl rounded-b-xl border border-white/20 shadow-2xl font-sans text-[16px] leading-7">
            <article className="prose prose-invert max-w-none 
                prose-headings:text-[#e6edf3] prose-headings:font-semibold prose-headings:scroll-mt-24
                prose-h1:text-3xl prose-h1:border-b prose-h1:border-[#30363d] prose-h1:pb-2 prose-h1:mb-6
                prose-h2:text-2xl prose-h2:mt-8 prose-h2:border-b prose-h2:border-[#23272c] prose-h2:pb-1
                prose-a:text-[#58a6ff] prose-a:no-underline hover:prose-a:underline
                prose-strong:text-[#e6edf3] prose-strong:font-bold
                prose-blockquote:border-l-4 prose-blockquote:border-[#30363d] prose-blockquote:bg-[#161b22] prose-blockquote:py-1 prose-blockquote:px-4
                prose-pre:bg-[#161b22] prose-pre:border prose-pre:border-[#30363d]

                prose-table:w-full prose-table:border-collapse prose-table:my-6
                prose-thead:bg-[#21262d] prose-thead:border-b prose-thead:border-[#30363d]
                prose-th:p-3 prose-th:text-left prose-th:font-semibold prose-th:text-white prose-th:border prose-th:border-[#30363d]
                prose-td:p-3 prose-td:border prose-td:border-[#30363d] prose-td:text-[#c9d1d9]
                prose-tr:even:bg-[#161b22]"
                style={{ fontFamily: '"Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif' }}
            >
                <ReactMarkdown 
                    remarkPlugins={[remarkGfm, remarkMath]} 
                    rehypePlugins={[rehypeRaw, rehypeKatex]} 
                    components={{
                        code(props) {
                            const {children, className, node, ref, ...rest} = props;
                            const match = /language-(\w+)/.exec(className || '');
                            const codeString = String(children).replace(/\n$/, '');

                            if (match && match[1] === 'mermaid') {
                                return <MermaidBlock chart={codeString} />;
                            }

                            if (match) {
                                return (
                                    <CodeBlock language={match[1]} code={codeString} />
                                );
                            } 
                            return (
                                <code {...rest} className="font-mono text-[85%] text-blue-500 px-1.5 py-0.5">
                                    {children}
                                </code>
                            )
                        },
                        h1: ({ children }) => <HeadingRenderer level={1}>{children}</HeadingRenderer>,
                        h2: ({ children }) => <HeadingRenderer level={2}>{children}</HeadingRenderer>,
                        h3: ({ children }) => <HeadingRenderer level={3}>{children}</HeadingRenderer>,

                        //@ts-ignore
                        font: ({color, children, ...props}) => {
                            const finalColor = INTELLIJ_COLORS[color?.toLowerCase() || ''] || color;
                            return <span style={{ color: finalColor }} {...props}>{children}</span>;
                        },
                        span: ({style, children, ...props}) => <span style={style} {...props}>{children}</span>,

                        img: ({node, ...props}) => (
                            <img {...props} className="max-w-full h-auto rounded border border-[#30363d] my-4 shadow-sm mx-auto" />
                        )
                    }}
                >
                    {content}
                </ReactMarkdown>
            </article>
        </div>
    );
};