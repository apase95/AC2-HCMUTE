import { BoxInputBase } from "../components/sub/BoxInputBase";
import { ThumbnailUpload } from "../components/sub/ThumbnailUpload";
import { DocumentUpload } from "../components/sub/DocumentUpload";
import { ButtonBase } from "../components/sub/ButtonBase";

interface UploadFormProps {
  isEditMode?: boolean;
  type: "document" | "blog";
  onChangeType: (type: 'blog' | 'document') => void;

  title: string;
  tags: string;
  readTime: string;
  description: string;
  loading: boolean;
  thumbnailPreview?: string;
    
  onChangeTitle: (val: string) => void;
  onChangeTags: (val: string) => void;
  onChangeReadTime: (val: string) => void;
  onChangeDescription: (val: string) => void;
  onSelectThumbnail: (file: File | null) => void;
  onSelectDocument: (file: File | null) => void;
  onSubmit: () => void;
  onCancel: () => void;
  onGoToExam: () => void;
}

export const UploadForm = (props : UploadFormProps) => {
  return (
    <div className="my-3 w-full lg:w-[90%] xl:w-4/5 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl pt-3 pb-4 px-8 flex flex-col gap-6 shadow-2xl">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-white/10 pb-4">
        <h1 className="text-3xl font-bold text-white tracking-tight">
            {props.isEditMode ? 'Edit' : 'Upload'} {props.type === 'blog' ? 'Blog' : 'Document'}
        </h1>
        <div className="flex bg-black/40 p-1 rounded-lg">
          <ButtonBase
            type="button" width="w-28" name={"Blog"}
            textColor="text-white"
            subClassName={`${props.type === 'blog' ? 'bg-secondary text-white shadow-md' : 'text-gray-400 hover:text-white'}
              ${props.isEditMode ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            onClick={() => !props.isEditMode && props.onChangeType('blog')}
          />
          <ButtonBase
            type="button" width="w-28" name={"Document"}
            textColor="text-white"
            subClassName={`${props.type === 'document' ? 'bg-secondary text-white shadow-md' : 'text-gray-400 hover:text-white'}
              ${props.isEditMode ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            onClick={() => !props.isEditMode && props.onChangeType('document')}
          />
          {!props.isEditMode && (
            <ButtonBase
              type="button" width="w-28" name={" Exam"}
              textColor="text-white"
              subClassName="text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              onClick={props.onGoToExam}
            />
          )}
          </div>
      </div>

      <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-1">
             <span className="text-white text-sm font-semibold mb-2 block pl-1">Thumbnail Image</span>
             <div className="h-[180px]">
                <ThumbnailUpload 
                  onFileSelect={props.onSelectThumbnail} 
                  initialPreview={props.thumbnailPreview}
                />
             </div>
          </div>

          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-2 content-start">
            <BoxInputBase
              type="text" width="w-full" nameHolder="Title"
              placeholder="E.g. Introduction to AWS" subClassname="md:col-span-2"
              value={props.title} onChange={(e) => props.onChangeTitle(e.target.value)}
            />
            
            <BoxInputBase
              type="text" width="w-full" nameHolder="Tags"
              placeholder="Frontend, Backend, DevOps"
              value={props.tags} onChange={(e) => props.onChangeTags(e.target.value)}
            />
            
            <BoxInputBase
              type="text" width="w-full" nameHolder="Estimated Read Time"
              placeholder="e.g. 10 minutes"
              value={props.readTime} onChange={(e) => props.onChangeReadTime(e.target.value)}
            />

            <div className="md:col-span-2 flex flex-col justify-start space-y-1">
                <span className="text-white text-sm font-semibold pl-1">Short Description</span>
                <textarea 
                    className="block bg-black/70 w-full text-white border border-slate-400
                      rounded-md py-2 pl-4 pr-3 shadow-sm focus:outline-none focus:border-accent sm:text-sm 
                      placeholder:text-white/50 resize-none transition-colors"
                    placeholder="Brief summary about this document..." rows={1}
                    value={props.description}
                    onChange={(e) => props.onChangeDescription(e.target.value)}
                />
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-end">
            <span className="text-white text-lg font-bold pl-1">
              {props.type === 'blog' ? 'Blog Content File' : 'Document File'}
            </span>
            <span className="text-xs text-gray-400 uppercase tracking-wider">
              PDF • DOCX • MD • TXT
            </span>
          </div>
          
          <DocumentUpload onFileSelect={props.onSelectDocument}/>
        </div>

        <div className="flex justify-end space-x-2">
          <ButtonBase
            type="button" width="w-28" name={"Cancel"}
            textColor="text-white" bgColor="bg-secondary/80"
            subClassName="hover:bg-secondary/40"
            disabled={props.loading} onClick={props.onCancel}
          />
          <ButtonBase
            type="submit" width="w-28" textColor="text-white"
            bgColor="bg-secondary/80" subClassName="hover:bg-secondary/40"
            name={props.loading ? 
              (props.isEditMode ? "Updating..." : "Uploading...") : 
              (props.isEditMode ? "Update" : "Upload")
            }
            disabled={props.loading} onClick={props.onSubmit}
          />
        </div>
      </form>
    </div>
  )
}