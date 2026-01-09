import { useEffect, useState } from "react";

interface HeadingItem {
    id: string;
    text: string;
    level: number;
}

interface TableOfContentProps {
    headings: HeadingItem[];
}

export const TableOfContent = ({ headings }: TableOfContentProps) => {
    const [activeId, setActiveId] = useState<string>("");

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            const headerOffset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: "smooth" });
            setActiveId(id);
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            {
                rootMargin: "-100px 0px -70% 0px",
                threshold: 0.1,
            }
        );

        const timer = setTimeout(() => {
            headings.forEach((heading) => {
                const element = document.getElementById(heading.id);
                if (element) {
                    observer.observe(element);
                }
            });
        }, 150);

        return () => {
            clearTimeout(timer);
            observer.disconnect();
        };
    }, [headings]);

    return (
        <nav className="hidden lg:block w-[280px] shrink-0 sticky top-20 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar px-4 pb-6">
            <h4 className="text-white/80 font-semibold text-lg mb-2">Table of Contents</h4>
            <ul className="space-y-1">
                {headings.map((heading) => (
                    <li key={heading.id} style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}>
                        <a
                            href={`#${heading.id}`}
                            onClick={(e) => handleClick(e, heading.id)}
                            className={`block py-1 text-sm transition-all duration-300 border-l-2 pl-3 
                                ${
                                    activeId === heading.id
                                        ? "border-accent text-accent font-semibold scale-105 origin-left"
                                        : "border-transparent text-gray-400 hover:text-white hover:border-gray-600"
                                }`}
                        >
                            {heading.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};
