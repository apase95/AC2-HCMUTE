import { useState, useRef, useEffect } from "react";
import { FaCloudUploadAlt, FaImage, FaTrash } from "react-icons/fa";

interface thumbnailUploadProps {
    onFileSelect: (file: File | null) => void;
    initialPreview?: string | null;
}

export const ThumbnailUpload = ({ onFileSelect, initialPreview }: thumbnailUploadProps) => {
    const [preview, setPreview] = useState<string | null>(initialPreview || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (initialPreview) {
            setPreview(initialPreview);
        }
    }, [initialPreview]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
            onFileSelect(file);
        }
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreview(null);
        onFileSelect(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div
            className="w-full h-full min-h-[120px] border-2 border-dashed border-slate-400 rounded-lg bg-black/20 hover:bg-black/30 hover:border-white transition-all cursor-pointer flex flex-col items-center justify-center relative overflow-hidden group"
            onClick={() => fileInputRef.current?.click()}
        >
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />

            {preview ? (
                <>
                    <img src={preview} alt="Thumbnail" className="w-full h-full object-cover absolute inset-0" />
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <span className="text-white font-medium flex items-center gap-2 mb-2">
                            <FaImage /> Change Image
                        </span>
                        <button
                            onClick={handleRemove}
                            className="font-bold text-white text-xs rounded-full flex items-center gap-1 transition-colors"
                        >
                            <FaTrash size={26}/>
                        </button>
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center text-gray-400 group-hover:text-white transition-colors p-4">
                    <FaCloudUploadAlt size={32} className="mb-2" />
                    <span className="text-sm font-medium">Click to upload thumbnail</span>
                    <span className="text-xs text-gray-500 mt-1">(JPG, PNG, Max 5MB)</span>
                </div>
            )}
        </div>
    );
};
