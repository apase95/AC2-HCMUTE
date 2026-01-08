import { FaFileUpload, FaCopy } from "react-icons/fa";
import { ButtonBase } from "../components/sub/ButtonBase";
import { SAMPLE_JSON } from "../data/sampleInputData";
import { useRef } from "react";
import { ThumbnailUpload } from "../components/sub/ThumbnailUpload";
import { BoxInputBase } from "../components/sub/BoxInputBase";
import { ErrorComponent } from "../components/sub/ErrorComponent";
import { ButtonBrand } from "../components/sub/ButtonBrand";

interface ExamUploadFormProps {
    isEditMode?: boolean;
    title: string;
    content: string;
    jsonContent: string;
    loading: boolean;
    error: string | null;
    thumbnailPreview: string | null;
    onTitleChange: (val: string) => void;
    onContentChange: (val: string) => void;
    onJsonChange: (val: string) => void;
    onThumbnailChange: (file: File | null) => void;
    onSubmit: () => void;
    onCancel: () => void;
    onGoToBlog: () => void;
    onGoToDocument: () => void;
}

export const ExamUploadForm = (props : ExamUploadFormProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            props.onJsonChange(event.target?.result as string || "");
        };
        reader.readAsText(file);
    };
    const copySample = () => {
        navigator.clipboard.writeText(SAMPLE_JSON);
    };

    return (
        <div className="w-full max-w-[1400px] mx-auto pb-12">
             <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-3xl font-bold text-white">Upload Exam</h1>
                <div className="flex bg-black/40 p-1 rounded-lg">
                    <ButtonBase type="button" width="w-24" name="Blog" textColor="text-white" 
                        subClassName="text-gray-400 hover:text-white hover:bg-white/10" onClick={props.onGoToBlog} />
                    <ButtonBase type="button" width="w-24" name="Doc" textColor="text-white"
                        subClassName="text-gray-400 hover:text-white hover:bg-white/10" onClick={props.onGoToDocument} />
                    <ButtonBase type="button" width="w-24" name="Exam" textColor="text-white"
                        subClassName="bg-secondary text-white shadow-md font-bold" />
                </div>
            </div>

            <div className="flex flex-col xl:flex-row gap-8 pt-4">
                <div className="flex-1 space-y-6">
                    
                    <div className="bg-white/5 p-6 rounded-xl border border-white/40 shadow-md">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            Basic Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-1 h-[180px]">
                                <ThumbnailUpload 
                                    onFileSelect={props.onThumbnailChange} 
                                    initialPreview={props.thumbnailPreview}
                                />
                            </div>
                            <div className="md:col-span-2 space-y-4">
                                <BoxInputBase 
                                    type="text" nameHolder="Exam Title" 
                                    placeholder="e.g. AWS Solutions Architect Associate"
                                    width="w-full" value={props.title}
                                    onChange={(e) => props.onTitleChange(e.target.value)}
                                />
                                <div className="flex flex-col space-y-1">
                                    <span className="text-white text-sm font-semibold pl-1">Description</span>
                                    <textarea 
                                        className="block bg-black/70 w-full text-white border border-white/90 rounded-md 
                                        py-2 pl-4 pr-3 focus:outline-none resize-none h-[74px] text-sm"
                                        placeholder="This exam covers..."
                                        value={props.content} rows={2}
                                        onChange={(e) => props.onContentChange(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 p-6 rounded-xl border border-white/40 shadow-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                Exam Structure (JSON)
                            </h2>
                            <ButtonBrand 
                                name={"Import File"}
                                icon={ <FaFileUpload />}
                                subClassName="border border-white/40 hover:bg-white/20"
                                onClick={() => fileInputRef.current?.click()}
                            />
                            <input type="file" ref={fileInputRef} accept=".json" className="hidden" onChange={handleFileChange} />
                        </div>
                        
                        <textarea 
                            className="w-full h-[500px] bg-black text-white font-mono text-sm p-4 rounded-lg border 
                                border-white/50 focus:outline-none resize-y code-scrollbar leading-6"
                            value={props.jsonContent}
                            onChange={(e) => props.onJsonChange(e.target.value)}
                            placeholder={`Paste JSON here... \nExample:\n${SAMPLE_JSON}`}
                            spellCheck={false}
                        />
                        {props.error && <ErrorComponent error={props.error} />}
                    </div>

                    <div className="flex justify-end gap-4 pt-2">
                        <ButtonBase 
                            name="Cancel" width="" textColor="text-white"
                            bgColor="bg-secondary/80" hoverBgColor="hover:bg-secondary/40" 
                            onClick={props.onCancel} disabled={props.loading}
                        />
                        <ButtonBase 
                            name={props.loading 
                                ? (props.isEditMode ? "Updating..." : "Uploading...") 
                                : (props.isEditMode ? "Update Exam" : "Create Exam")
                            }  
                            width="" textColor="text-white" bgColor="bg-secondary/80" 
                            hoverBgColor="hover:bg-secondary/40" 
                            onClick={props.onSubmit} disabled={props.loading}
                        />
                    </div>
                </div>

                <div className="w-full xl:w-[400px] flex flex-col gap-6">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/40 sticky top-12">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-white">Sample JSON</h3>
                            <ButtonBrand 
                                name={ "Copy" }
                                icon={ <FaCopy /> }
                                subClassName="border border-white/40 hover:bg-white/20"
                                onClick={copySample} 
                            />
                        </div>
                        <div className="overflow-hidden bg-black rounded-lg border border-white/50">
                            <pre className="max-h-[400px] overflow-auto p-4 text-xs font-mono
                                text-green-500 code-scrollbar"
                            >
                                {SAMPLE_JSON}
                            </pre>
                        </div>
                        <ul className="text-xs text-white mt-4 space-y-2 list-disc pl-4">
                            <li>Thumbnail & Title are uploaded separately.</li>
                            <li>JSON only needs <code>parts</code> array.</li>
                            <li>Each question must have a unique <code>id</code>.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};