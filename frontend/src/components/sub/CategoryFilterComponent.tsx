import { CiFilter } from "react-icons/ci";
import { SORT_OPTIONS } from "../../constants/appConstants";

interface CategoryFilterComponentProps {
    tags: string[];
    selectedTag: string;
    selectedSort: string;
    onSelectTag: (tag: string) => void;
    onSelectSort: (sort: string) => void;
}

export const CategoryFilterComponent = ({ 
    tags, 
    selectedTag, 
    selectedSort, 
    onSelectTag, 
    onSelectSort 
}: CategoryFilterComponentProps) => {

  return (
    <div className="w-full flex flex-row flex-wrap items-center gap-2 mt-8 overflow-hidden select-none">
        <div className="py-2 flex flex-row items-center space-x-2">
          <button 
            onClick={() => onSelectTag("All")}
            className={`group btn-rgb-shadow p-1 my-1 ml-[10px] text-sm text-center rounded-full outline outline-[1px] transition-all-300 
                    bg-primary-dark/30 text-accent outline-accent/40 hover:bg-primary-dark/80 hover:outline-accent/80`}
          >
            <CiFilter size="18" className="group-hover:text-blue-300"/>
          </button>

          <div className="btn-rgb-shadow flex flex-row items-center space-x-4 px-4 py-1 rounded-full bg-primary-dark/30 outline outline-[1px] outline-accent/40">
            {SORT_OPTIONS.map((filter) => (
              <button 
                key={filter} 
                onClick={() => onSelectSort(filter)}
                className={`text-sm transition-all-300 
                    ${selectedSort === filter 
                        ? "text-blue-300 font-bold" 
                        : "text-accent hover:text-blue-300"}`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="hidden md:flex flex-1 w-full overflow-x-auto pb-2 md:pb-0">
            <div className="flex flex-row items-center space-x-4 p-3">
                {tags.map((tag) => (
                  <button 
                    key={tag} 
                    onClick={() => onSelectTag(tag)}
                    className={`btn-rgb-shadow flex-shrink-0 px-4 py-1 text-sm text-center rounded-full outline outline-[1px] transition-all-300 whitespace-nowrap
                        ${selectedTag === tag 
                            ? "bg-primary-dark/80 text-blue-300 outline-blue-300 font-medium" 
                            : "bg-primary-dark/30 text-accent outline-accent/40 hover:bg-primary-dark/80 hover:text-blue-200 hover:outline-accent/80"}`}
                    >
                    {tag}
                    </button>
                ))}
            </div>
        </div>
        
        <style>{`
            .overflow-x-auto::-webkit-scrollbar {
                height: 0px;
                background: transparent; 
            }
        `}</style>    
      </div>
  )
}