import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ExamUploadForm } from "../forms/ExamUploadForm";
import api from "../libs/api";
import type { AppDispatch, RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchExamById } from "../redux/examSlice";
import { ErrorComponent } from "../components/sub/ErrorComponent";

export const ExamUploadPage = () => {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const isEditMode = !!id;

    const dispatch = useDispatch<AppDispatch>();
    const { currentItem } = useSelector((state: RootState) => state.exams);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { user } = useSelector((state: RootState) => state.auth);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [jsonContent, setJsonContent] = useState("");
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string>("");

    useEffect(() => {
        if (isEditMode && id) {
            dispatch(fetchExamById(id))
        }
    }, [isEditMode, id, dispatch]);

    useEffect(() => {
        if (isEditMode && currentItem && currentItem._id === id) {
            setTitle(currentItem.title || "");
            setContent(currentItem.content || "");
            setThumbnailPreview(currentItem.coverImage || "");
            if (currentItem.parts) {
                setJsonContent(JSON.stringify({ parts: currentItem.parts }, null, 2));
            }
        }
    }, [isEditMode, currentItem, id]);

    const handleUpload = async () => {
        setLoading(true);
        setError(null);

        if (!title.trim() || !content.trim()) {
            setError("Title and content are required.");
            setLoading(false);
            return;
        }
        if (!jsonContent.trim()) {
            setError("Exam JSON content is required.");
            setLoading(false);
            return;
        }

        try {
            let parsedJson;
            try {
                parsedJson = JSON.parse(jsonContent);
            } catch (error) {
                setError("Invalid JSON format.");
                setLoading(false);
                return;
            }
            
            const formData = new FormData();
            formData.append("title", title);
            formData.append("content", content);
            if (thumbnail) {
                formData.append("coverImage", thumbnail);
            } else if (thumbnailPreview) {
                formData.append("coverImageUrl", thumbnailPreview);
            }
            formData.append("parts", JSON.stringify(parsedJson.parts || parsedJson));
            formData.append("language", "English");
            formData.append("totalTime", "60");
            
            let response;
            if (isEditMode && id) {
                response = await api.put(`/exams/${id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                if (response.status === 200) {
                    alert("Exam updated successfully.");
                    navigate(`/exams/${id}`);
                }
            } else {
                response = await api.post("/exams", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                if (response.status === 201) {
                    alert("Exam uploaded successfully!");
                    navigate(`/exams/${response.data._id}`);
                }
            }
        } catch (error : any) {
            console.error("Upload error:", error);
            setError(error.response?.data?.message || "Failed to upload exam.");
        } finally {
            setLoading(false);
        }
    };

    if (!user || user.role !== 'admin') {
        return <ErrorComponent 
            error="Access Denied: You do not have permission to access this page."
            inBlock={false}
        />;
    }

    return (
         <div className="relative min-h-screen h-auto w-full grid-pattern pt-20 px-4">
            <ExamUploadForm 
                isEditMode={isEditMode}
                title={title}
                content={content}
                jsonContent={jsonContent}
                loading={loading}
                error={error}
                thumbnailPreview={thumbnailPreview} 
                onTitleChange={setTitle}
                onContentChange={setContent}
                onJsonChange={setJsonContent}
                onThumbnailChange={setThumbnail}
                
                onSubmit={handleUpload}
                onCancel={() => navigate(-1)}
                onGoToBlog={() => navigate('/blogs')}
                onGoToDocument={() => navigate('/upload')}
            />
        </div>
    );
};