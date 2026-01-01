import { CiCircleCheck } from "react-icons/ci"

export const SuccessComponent = ({ error, inBlock, subClassName }: { error?: string, inBlock?: boolean, subClassName?: string }) => {
  return (
    <div className={inBlock ? "w-full" : "w-full h-screen"}>
        <div className={`w-full flex justify-center pt-24 animate-fade-in-up ${subClassName || ""}`}>
            <div className="w-full flex items-center px-6 py-4 border border-green-500/50
                rounded-lg bg-green-500/10 backdrop-blur-md shadow-lg max-w-lg select-none">
                <CiCircleCheck 
                    size={28} 
                    className="text-green-500 font-bold mr-4 flex-shrink-0" 
                />
                <div className="flex flex-col">
                    <h3 className="text-green-500 font-bold text-lg">Success</h3>
                    <span className="text-green-400 text-sm font-medium">
                        {error || "An unexpected error occurred. Please try again later."} 
                    </span>
                </div>
            </div>
        </div>
    </div>
  )
}