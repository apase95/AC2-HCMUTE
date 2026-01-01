
interface TagListComponentProps {
  tags: string[];
  widthBlock?: string;
  paddingButton?: string;
}

export const TagListComponent = (props: TagListComponentProps) => {
  return (
    <ul className={` ${props.widthBlock || "w-[90%]"} flex flex-row flex-nowrap items-center overflow-hidden gap-3 pl-3 py-2`}>
        {props.tags.map((tag, index) => (
            <button key={index}
            className={`btn-rgb-shadow flex-shrink-0 ${props.paddingButton || "px-2"}
              bg-primary-dark/30 text-sm text-center text-accent 
              rounded-lg outline outline-[1px] outline-accent/40 
              hover:text-blue-200 hover:bg-primary-dark/80 
              hover:outline-accent/80 transition-all-300`}>
                {tag}
            </button>
        ))}
    </ul>
  )
}
