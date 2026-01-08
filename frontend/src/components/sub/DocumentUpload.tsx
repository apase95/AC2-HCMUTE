import { useRef, useState } from "react";
import { FaFilePdf, FaFileWord, FaFileAlt, FaFileCode, FaTrash, FaCloudUploadAlt } from "react-icons/fa";

interface DocumentUploadProps {
  initialFile?: File | null;
  onFileSelect?: (file: File | null) => void;
};

export const DocumentUpload = ({ onFileSelect, initialFile }: DocumentUploadProps) => {
  const [file, setFile] = useState<File | null>(initialFile || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
          setFile(selectedFile);
          onFileSelect(selectedFile);
      }
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
      e.stopPropagation();
      setFile(null);
      onFileSelect(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const getFileIcon = (fileName: string) => {
      const ext = fileName.split('.').pop()?.toLowerCase();
      if (ext === 'pdf') return <FaFilePdf size={40} className="text-red-500" />;
      if (ext === 'doc' || ext === 'docx') return <FaFileWord size={40} className="text-blue-500" />;
      if (ext === 'md' || ext === 'txt') return <FaFileAlt size={40} className="text-gray-300" />;
      return <FaFileCode size={40} className="text-green-500" />;
  }

  return (
    <div 
      className={`
        group w-full h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all
        ${file ? 'border-accent bg-accent/10' : 'border-slate-500 bg-black/20 hover:bg-black/30 hover:border-white'}
      `}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept=".pdf,.doc,.docx,.txt,.md"
        onChange={handleFileChange}
      />

      {file ? (
        <div className="flex flex-col items-center animate-fade-in-up">
          {getFileIcon(file.name)}
          <span className="mt-3 text-lg font-bold text-white">{file.name}</span>
          <span className="text-sm text-white/60">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </span>
          
          <button 
            onClick={handleRemoveFile}
            className="mt-4 flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500 hover:text-white transition-all"
          >
            <FaTrash size={14} /> Remove File
          </button>
        </div>
      ) : (
        <div className="text-center p-6">
          <FaCloudUploadAlt size={48} className="mx-auto text-slate-400 mb-4 group-hover:text-white transition-all" />
          <h3 className="text-xl font-semibold text-white">Drag & Drop or Click to Upload</h3>
          <p className="text-white/50 mt-2 text-sm">
            Supported formats: PDF, Word, Markdown, Text (&lt;5MB)
          </p>
        </div>
      )}
    </div>
  );
};
