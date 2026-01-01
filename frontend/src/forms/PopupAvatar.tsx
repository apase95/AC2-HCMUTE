import { PopupComponent } from "../components/sub/PopupComponent";
import { IoLogOut, IoPerson, IoSettings } from "react-icons/io5";
import type { IconButtonType, User } from "../Types";
import { FaCloudUploadAlt } from "react-icons/fa";

interface PopupAvatar {
    isOpen: boolean,
    user: User | null;
    onLogout: () => void;
    onClose?: () => void;
}

export const PopupAvatar = ({ isOpen, user, onLogout, onClose }: PopupAvatar) => {
    
    let allLinks: IconButtonType[] = [
        {
            icon: <IoPerson size="22" />,
            title: "Profile",
            url: "/profile",
            onClick: onClose,
        },
    ];
    if (user && user.role === 'admin') {
        allLinks.push({
            icon: <FaCloudUploadAlt size="22" />,
            title: "Upload",
            url: "/upload",
            onClick: onClose,
        });
    }
    allLinks.push(
        {
            icon: <IoSettings size="22" />,
            title: "Settings",
            url: "/settings",
            onClick: onClose,
        },
        {
            icon: <IoLogOut size="22" />,
            title: "Logout",
            url: "#",
            onClick: onLogout,
        }
    );

    return (
        <div className={`
                absolute right-0 top-full mt-4
                p-[2px] rounded-md shadow-lg animated-rgb-border
                transition-all-300 transform
                ${isOpen ? 
                    "opacity-100 translate-y-0" :
                    "opacity-0 -translate-y-2 pointer-events-none"}`}
        >
            <PopupComponent links={allLinks} />
        </div>
    );
};
