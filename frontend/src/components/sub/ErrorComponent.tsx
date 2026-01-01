import { BiError } from "react-icons/bi"

export const ErrorComponent = ({ error, inBlock, subClassName }: { error?: string, inBlock?: boolean, subClassName?: string }) => {
  return (
    <div className={inBlock ? "w-full" : "w-full h-screen"}>
        <div className={`w-full flex justify-center pt-24 animate-fade-in-up ${subClassName || ""}`}>
            <div className="w-full flex items-center px-6 py-4 border border-red-500/50
                rounded-lg bg-red-500/10 backdrop-blur-md shadow-lg max-w-lg select-none">
                <BiError
                    size={28} 
                    className="text-red-500 mr-4 flex-shrink-0" 
                />
                <div className="flex flex-col">
                    <h3 className="text-red-500 font-bold text-lg">Error</h3>
                    <span className="text-red-400 text-sm font-medium">
                        {error || "An unexpected error occurred. Please try again later."} 
                    </span>
                </div>
            </div>
        </div>
    </div>
  )
}
