import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
    startOnLoad: false,
    theme: "dark",
    securityLevel: "loose",
});

export const MermaidBlock = ({ chart }: { chart: string }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [svg, setSvg] = useState<string>("");

    useEffect(() => {
        const renderChart = async () => {
            if (ref.current) {
                try {
                    const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
                    const { svg } = await mermaid.render(id, chart);
                    setSvg(svg);
                } catch (error) {
                    console.error("Mermaid render error:", error);
                    setSvg(`<div style="color: red; padding: 10px; border: 1px solid red;">Invalid Mermaid Syntax</div>`);
                }
            }
        };
        renderChart();
    }, [chart]);

    return (
        <div 
            ref={ref} 
            className="flex justify-center bg-[#1e1f22] p-4 my-4 rounded border border-[#4e5157]"
            dangerouslySetInnerHTML={{ __html: svg }} 
        />
    );
};