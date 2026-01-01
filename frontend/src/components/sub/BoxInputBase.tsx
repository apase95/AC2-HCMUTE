interface BoxInputProps {
    placeholder?: string;
    type?: string;
    nameHolder?: string;
    name?: string;
    width?: string;
    subClassname?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
}

export const BoxInputBase = (props: BoxInputProps) => {
    return (
        <div className={`${props.subClassname} ${props.width} flex flex-col justify-start space-y-1`}>
            <span className="text-white">{`${props.nameHolder}`}</span>
            <label className={`relative block w-full`}>
                <input
                    className="block bg-black/70 w-full text-white border border-slate-300 rounded-md py-2 pl-4 pr-3 shadow-sm focus:outline-none sm:text-sm placeholder:italic placeholder:text-white"
                    placeholder={props.placeholder}
                    type={props.type}
                    name={props.name}
                    value={props.value}
                    onChange={props.onChange}
                    disabled={props.disabled}
                />
            </label>
        </div>
    );
};
