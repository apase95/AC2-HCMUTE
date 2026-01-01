import { LogoComponent } from "./LogoComponent";

interface LogoTitleComponentProps {
    title: string;
    subtitle: string;
    width?: string;
    height?: string;
    subClassName?: string;
}

export const LogoTitleComponent = (props: LogoTitleComponentProps) => {
    return (
        <div className={`
            ${props.width}
            ${props.height}
            ${props.subClassName}
            flex flex-row items-start justify-start space-x-4
        `}>
            <LogoComponent 
                to="/"
                alt="Logo"
                src="/logo-cloud-club-white.png"
                height="h-full" 
            />
            <div className="h-full flex-center flex-col">
                <span className="text-white text-2xl font-bold">{props.title}</span>
                <span className="text-gray-400 text-md font-semibold">{props.subtitle}</span>
            </div>
        </div>
    );
};
