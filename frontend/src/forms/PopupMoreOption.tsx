import { PopupComponent } from "../components/sub/PopupComponent";
import { FaEdit, FaTrash } from "react-icons/fa";
import type { IconButtonType } from "../Types";

interface PopupMoreOptionProps {
    isOpen: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
}

export const PopupMoreOption = (props: PopupMoreOptionProps) => {
    const allLinks: IconButtonType[] = [];

    if (props.onEdit) {
        allLinks.push({
            icon: <FaEdit size="22" />,
            title: "Edit",
            url: "#",
            onClick: (e: any) => {
                e?.stopPropagation();
                props.onEdit!();
            },
        });
    }

    if (props.onDelete) {
        allLinks.push({
            icon: <FaTrash size="22" />,
            title: "Delete",
            url: "#",
            onClick: (e: any) => {
                e?.stopPropagation();
                props.onDelete!();
            },
        });
    }

    return (
        <div
            className={`
                  absolute right-0 top-full mt-4
                  p-[2px] rounded-md shadow-lg border border-white/40
                  transition-all-300 transform
                  ${props.isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}`}
        >
            <PopupComponent
                links={allLinks}
                hasSearch={false}
                bgColor="bg-white/20"
                subClassName="w-full py-2 pl-10 text-white flex-start flex-row space-x-2 rounded-sm 
                    font-bold hover:bg-primary-dark/80 transition-all-300 cursor-pointer"
            />
        </div>
    );
};
