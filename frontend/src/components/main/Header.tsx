import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BoxSearch } from "../sub/BoxSearch";
import { LogoComponent } from "../sub/LogoComponent";
import { IoLogInOutline, IoMenu, IoPersonAddOutline } from "react-icons/io5";
import { PopupMenu } from "../../forms/PopupMenu";
import { useClickOutside } from "../../hooks/useClickOutside";
import type { AppDispatch, RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth, logoutUser } from "../../redux/authSlice";
import { PopupAvatar } from "../../forms/PopupAvatar";


export const Header = () => {
    const location = useLocation();
    const linkNavigationForPage = [
        { to: "/blogs", label: "Blogs" },
        { to: "/documents", label: "Documents" },
        { to: "/exams", label: "Exams" },
    ];

    const [popupAvatarIsOpen, setPopupAvatarIsOpen] = useState<boolean>(false);
    const [popupMenuIsOpen, setPopupMenuIsOpen] = useState<boolean>(false);

    const avatarRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useClickOutside(avatarRef, () => setPopupAvatarIsOpen(false));
    useClickOutside(menuRef, () => setPopupMenuIsOpen(false));

    const dispatch = useDispatch<AppDispatch>();
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(checkAuth());
    }, [dispatch]);

    const handleLogout = async () => {
        await dispatch(logoutUser());
        setPopupAvatarIsOpen(false);
        navigate("/login");
    };
    
    return (
        <div className="z-20 fixed flex-between items-center w-full h-14 md:px-10 lg:px-10 px-4
            bg-primary/95 border-b border-blue-500/20
        ">
            <div className="w-[30%] h-full flex-row-start space-x-12">
                <LogoComponent 
                    to="/" 
                    alt="Logo" 
                    src="/logo-cloud-club-white.png" 
                    height="h-[70%]"
                />
                <BoxSearch
                    maxWidth="max-w-30"
                    currentWidth="w-[60%]"
                    currentHeight="h-[70%]"
                    bgColor="bg-primary-dark/15"
                    hoverBgColor="hover:bg-primary-dark/50"
                    textColor="text-white"
                    subClassName="hidden lg:block"
                />
            </div>
            <div className="hidden lg:flex w-[40%] flex-row justify-center space-x-8 font-base">
                <a href="https://roadmap.sh/dashboard" 
                    className="text-font-underline-hover"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Roadmap
                </a>
                {linkNavigationForPage.map((link) => {
                    const isActive = location.pathname.startsWith(link.to);
                    return (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`${isActive ? "underline-hover-active" : "text-font-underline-hover"}`}
                        >
                            {link.label}
                        </Link>
                    );
                })}
            </div>
            <div className="relative w-[30%] flex flex-row items-center justify-end space-x-4">
                {isAuthenticated ? (
                    <div ref={avatarRef} className="relative">
                        <button 
                            className="h-10 w-10 aspect-square flex-shrink-0 rounded-full
                                p-[2px] animated-rgb-border
                                overflow-hidden hover:scale-105 transition-all-300 block"
                            onClick={() => {
                                setPopupAvatarIsOpen(!popupAvatarIsOpen)
                                setPopupMenuIsOpen(false);
                            }}
                        >
                            <img 
                                src={user?.avatarURL || "/logo.jpg"}
                                alt="Avatar User" 
                                draggable={false}
                                className="h-full w-full object-cover rounded-full bg-black" 
                            />
                        </button>
                        <PopupAvatar 
                            isOpen={popupAvatarIsOpen}
                            user={user}
                            onClose={() => setPopupAvatarIsOpen(false)}
                            onLogout={handleLogout}
                        />
                    </div>
                ) : (
                    <>
                        <div className="flex lg:hidden flex-row items-center space-x-6 mr-2">
                            <Link to="/login" className="text-white hover:text-accent transition-colors duration-300">
                                <IoLogInOutline size={28} title="Log In" />
                            </Link>
                            <Link to="/register" className="text-white hover:text-accent transition-colors duration-300">
                                <IoPersonAddOutline size={24} title="Sign Up" />
                            </Link>
                        </div>

                        <div className="hidden lg:flex items-center justify-center flex-row space-x-6 font-base">
                            <Link to="/login" className="text-font-underline-hover">
                                Log In
                            </Link>
                            <Link to="/register" className="px-4 py-1 rounded-2xl border-[1.5px] border-accent text-accent btn-rgb-shadow hover:text-blue-300 hover:border-blue-300 transition-all-300">
                                Sign Up
                            </Link>
                        </div>
                    </>
                )}
                <div ref={menuRef} className="relative lg:hidden">
                    <button className="text-white block"
                        onClick={() => {
                            setPopupMenuIsOpen(!popupMenuIsOpen)
                            setPopupAvatarIsOpen(false);
                        }}
                    >
                        <IoMenu size='28'/>
                    </button>
                    <PopupMenu isOpen={popupMenuIsOpen} onClose={() => setPopupMenuIsOpen(false)}/>
                </div>
            </div>
        </div>
    );
};