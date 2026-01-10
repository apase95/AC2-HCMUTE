import { FcGoogle } from "react-icons/fc";
import { FaLinkedin } from "react-icons/fa";

interface ButtonBrandProps {
    width?: string;
    name?: string;
    textColor?: string;
    bgColor?: string;
    hoverBgColor?: string;
    subClassName?: string;
    icon?: React.ReactNode;
    onClick?: () => void;
}

export const ButtonBrand = (props: ButtonBrandProps) => {
    return (
        <button
            type="button"
            onClick={props.onClick}
            className={`
                ${props.width}
                ${props.textColor}
                ${props.bgColor}
                ${props.hoverBgColor}
                flex-center py-2 px-4
                rounded-md shadow-sm
                text-sm font-medium
                select-none
                ${props.subClassName}
        `}>
            {props.name === "Google" && <FcGoogle className="mr-2" size='22'/>}
            {props.name === "Linked In" && <FaLinkedin className="mr-2" size='22'/>}
            {
                <div className="flex-row-start space-x-1">
                    { props.name && <span>{props.name}</span> }
                    { props.icon && <span>{props.icon}</span> }
                </div>
            }
        </button>
    )
}
