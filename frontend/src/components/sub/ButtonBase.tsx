interface ButtonBaseProps {
    width?: string;
    name?: string;
    textColor?: string;
    bgColor?: string;
    hoverBgColor?: string;
    subClassName?: string;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
}

export const ButtonBase = (props: ButtonBaseProps) => {
  return (
    <button
      type={props.type || "button"}
      onClick={props.onClick}
      className={`
        flex-center py-2 px-4
        border border-transparent rounded-md shadow-sm 
        text-sm font-medium transition-all-300
        disabled:opacity-50 disabled:cursor-not-allowed
        ${props.subClassName}
        ${props.width}
        ${props.textColor}
        ${props.bgColor}
        ${props.hoverBgColor}
    `}>
      {props.name}
    </button>
  )
}
