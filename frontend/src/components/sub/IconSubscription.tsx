

interface IconSubscriptionProps {
  icon: React.ReactNode;
  title: string;
  sizeIcon?: string;
  sizeText?: string;
  colorIcon?: string;
  colorText?: string;
  href?: string;
}

export const IconSubscription = (props: IconSubscriptionProps) => {
  return(
    <div className="flex-row-start space-x-2">
      <p
        className={`${props.sizeIcon || "text-lg"} ${props.colorIcon || "text-accent"}`}
        style={{ fontSize: props.sizeIcon }}
      >
        {props.icon}
      </p>
      <a
        href={props.href}
        className={`${props.sizeText || "text-md"} ${props.colorText || "text-gray-300"} hover:text-white transition-all-300`}
        style={{ fontSize: props.sizeText }}
        target="_blank"
        rel="noopener noreferrer"
      >
        {props.title}
      </a>
    </div>
  )
}
