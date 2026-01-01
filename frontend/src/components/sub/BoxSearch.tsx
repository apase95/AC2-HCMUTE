import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { useSearchParams } from "react-router-dom";

interface BoxSearchProps {
    maxWidth?: string;
    maxHeight?: string;
    currentWidth?: string;
    currentHeight?: string;
    bgColor?: string;
    hoverBgColor?: string;
    textColor?: string;
    subClassName?: string;
}

export const BoxSearch = (props: BoxSearchProps) => {

    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState<string>("");

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        setSearchTerm(searchParams.get("search") || "");
    }, [searchParams]);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!searchTerm.trim()) {
            const newParams = new URLSearchParams(searchParams);
            newParams.delete("search");
            setSearchParams(newParams);
            return;
        }
        if (location.pathname !== "/") {
            navigate(`/?search=${encodeURIComponent(searchTerm)}`);
        } else {
            const newParams = new URLSearchParams(searchParams);
            newParams.set("search", searchTerm);
            setSearchParams(newParams);
        }
    };


    return (
        <form 
            className={`
                ${props.subClassName}
                ${props.maxWidth} 
                ${props.currentWidth} 
                ${props.currentHeight} 
                ${props.bgColor} 
                ${props.hoverBgColor} 
                btn-rgb-shadow
                relative rounded-full transition-all-300
            `}
            onSubmit={handleSearch}
        >
            <button 
                type="submit"
                className={`absolute-center-y translate-x-4 ${props.textColor} font-bold`}
            >
                <CiSearch size="22" />
            </button>
            <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                type="text"
                id="search"
                placeholder="Search"
                className="absolute-center-y w-full pl-12 pr-4 
                    text-white bg-transparent outline-none placeholder:text-white/70"
            />
        </form>
    );
};
