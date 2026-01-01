import { MdAlternateEmail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { FaRegUser } from "react-icons/fa";

interface BoxInputLoginProps {
    placeholder?: string;
    type?: string;
    nameHolder?: string;
    name?: string;
    width?: string;
    subClassname?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const BoxInputLogin = (props: BoxInputLoginProps) => {
    return (
        <div className={`${props.subClassname} ${props.width} flex flex-col justify-start space-y-1`}>
            <span className="text-white">{`${props.placeholder}`}</span>
            <label className={`relative block w-full`}>
                <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                    {props.type === "password" ? (
                        <TbLockPassword size="22" className="text-slate-300" />
                    ) : props.type === "email" ? (
                        <MdAlternateEmail size="22" className="text-slate-300" />
                    ) : (
                        <FaRegUser size="22" className="text-slate-300" />
                    )}
                </span>
                <input
                    className="block bg-black/70 w-full text-white border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none sm:text-sm placeholder:italic placeholder:text-white"
                    placeholder={props.placeholder}
                    type={props.type}
                    name={props.name}
                    value={props.value}
                    onChange={props.onChange}
                />
            </label>
        </div>
    );
};
