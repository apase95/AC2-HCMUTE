import { Link } from "react-router-dom";

interface LogoComponentProps {
    to: string;
    alt: string;
    src: string;
    height?: string;
    mainClassName?: string;
    subClassName?: string;
}

export const LogoComponent = (props: LogoComponentProps) => {
    return (
        <Link
            to={props.to}
            className={`
                ${props.height}
                ${props.mainClassName}
                inline-block hover:scale-105 transition-all-300`}
        >
            <img 
                src={props.src}
                alt={props.alt}
                className={`${props.subClassName} h-full w-auto`} />
        </Link>
    );
};
