import { useRef } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

interface CarouselProps {
    title: string;
    count: number;
    children: React.ReactNode;
}

export const CarouselComponent = ({ title, count, children }: CarouselProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 400;
            
            if (direction === "left") {
                current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: "smooth" });
            }
        }
    };

    return (
        <div className="w-full flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/40 pb-2">
                <div className="flex items-end gap-3">
                    <h3 className="text-2xl text-accent font-bold">{title}</h3>
                    <span className="text-white/50 text-sm mb-1">({count} results)</span>
                </div>
                
                <div className="flex gap-2">
                    <button 
                        onClick={() => scroll("left")}
                        className="p-2 rounded-full bg-primary-dark/50 hover:bg-accent/50 hover:text-white text-accent transition-all duration-300"
                    >
                        <IoChevronBack size={20} />
                    </button>
                    <button 
                        onClick={() => scroll("right")}
                        className="p-2 rounded-full bg-primary-dark/50 hover:bg-accent/50 hover:text-white text-accent transition-all duration-300"
                    >
                        <IoChevronForward size={20} />
                    </button>
                </div>
            </div>

            <div 
                ref={scrollRef}
                className="flex overflow-x-auto gap-6 pb-4 snap-x scrollbar-hide scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {children}
            </div>
        </div>
    );
};