import { Link } from "react-router-dom";
import type { IconButtonType } from "../../Types";
import { BoxSearch } from "./BoxSearch";

interface PopupComponentProps {
    links: IconButtonType[];
    hasSearch?: boolean;
    subClassName?: string;
    bgColor?: string;
}

export const PopupComponent = ({ links, hasSearch, subClassName, bgColor }: PopupComponentProps) => {
    const itemClass = "w-full px-12 py-3 text-white flex flex-row items-center justify-start space-x-3 rounded-sm hover:bg-primary-dark/40 transition-all-300 cursor-pointer";

    return (
        <div className={`rounded flex flex-col min-w-[160px] ${bgColor ? bgColor : "bg-primary"}`}>
            {hasSearch && (
                <div className="px-4 pt-2">
                    <BoxSearch
                        currentWidth="w-full"
                        currentHeight="h-10"
                        bgColor="bg-primary-dark/30"
                        hoverBgColor="hover:bg-primary-dark/50"
                        textColor="text-white"
                    />
                </div>
            )}
            {links.map((link) => {
                if (link.url && link.url !== "#") {
                    return (
                        <Link
                            key={link.title}
                            to={link.url}
                            className={subClassName ? subClassName : itemClass}
                            onClick={link.onClick}
                        >
                            {link.icon}
                            <span>{link.title}</span>
                        </Link>
                    );
                }
                
                return (
                    <button
                        key={link.title}
                        onClick={link.onClick}
                        className={subClassName ? subClassName : itemClass}
                    >
                        {link.icon}
                        <span>{link.title}</span>
                    </button>
                );
            })}
        </div>
    );
};
