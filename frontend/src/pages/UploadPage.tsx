import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { createDocument, fetchDocumentById, resetUploadState as resetDocState } from "../redux/documentSlice";
import { createBlog, fetchBlogById, resetUploadState as resetBlogState } from "../redux/blogSlice";
import { UploadForm } from "../forms/UploadForm";
import api from "../libs/api";
import { ErrorComponent } from "../components/sub/ErrorComponent";

export const UploadPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams();
  const location = useLocation();
  const isEditMode = !!id;
  const detectTypeFromUrl = location.pathname.includes("blogs") ? "blog" : "document";
  
  const { user } = useSelector((state: RootState) => state.auth);
  const [uploadType, setUploadType] = useState<'blog' | 'document'>(detectTypeFromUrl);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [readTime, setReadTime] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [contentFile, setContentFile] = useState<File | null>(null);
  
  const { currentItem: blogItem } = useSelector((state: RootState) => state.blogs)
  const { currentItem: docItem } = useSelector((state: RootState) => state.documents)
  
  const { 
    loading: docLoading,
    error: docError, 
    uploadSuccess: docSuccess
  } = useSelector((state: RootState) => state.documents);

  const { 
    loading: blogLoading,
    error: blogError,
    uploadSuccess: blogSuccess
  } = useSelector((state: RootState) => state.blogs);
  
  useEffect(() => {
    if (isEditMode && id) {
      dispatch(resetDocState());
      dispatch(resetBlogState());
      if (uploadType === "blog"){ 
        dispatch(fetchBlogById(id));
      } else {
        dispatch(fetchDocumentById(id));
      }
    }
  }, [isEditMode, id, uploadType, dispatch]);

  useEffect(() => {
    if (isEditMode) {
        const item = uploadType === "blog" ? blogItem : docItem;
        if (item && item._id === id) {
          setTitle(item.title || "");
          setTags(item.tags ? item.tags.join(", ") : "");
          setReadTime(item.readTime || "");
          setDescription(item.subscription || "");
          setThumbnailPreview(item.coverImage || "");
        }
    }
  }, [isEditMode, blogItem, docItem, id, uploadType]);

  useEffect(() => {
    if (docSuccess) {
        alert("Document uploaded/updated successfully!");
        dispatch(resetDocState());
        navigate('/documents');
    }
    if (blogSuccess) {
        alert("Blog uploaded/updated successfully!");
        dispatch(resetBlogState());
        navigate('/blogs');
    }
  }, [docSuccess, blogSuccess, navigate, dispatch]);

  useEffect(() => {
    if (docError) {
      alert(`Document Error: ${docError}`);
      dispatch(resetDocState());
    }
    if (blogError) {
      alert(`Blog Error: ${blogError}`);
      dispatch(resetBlogState());
    }
  }, [docError, blogError, dispatch]);
  
  const handleSubmit = async () => {
    if (!title) {
      alert("Title is require!");
      return;
    }
    
    if (!isEditMode && (!contentFile || !thumbnailFile)){
      alert("Thumbnail and Content files are required!")
      return;
    }
  
    const formData = new FormData();
    formData.append("title", title);
    formData.append("tags", tags);
    formData.append("readTime", readTime);
    formData.append("subscription", description);
    if (thumbnailFile) formData.append("thumbnail", thumbnailFile);
    if (contentFile) formData.append("document", contentFile);

    if (isEditMode && id) {
      try {
        const endpoint = uploadType === "blog" ? `/blogs/${id}` : `/documents/${id}`;
        await api.put(endpoint, formData, { headers: { 'Content-Type' : 'multipart/form-data'}});
        alert("Updated successfully!")
        navigate(uploadType === "blog" ? "/blogs" : "/documents")
      } catch (error : any) {
        console.log("Update failed!", error);
        alert(error.response?.data?.message || "Update failed");
      }
    }
    else {
        if (uploadType === 'document') {
            dispatch(createDocument(formData));
        } else {
            dispatch(createBlog(formData));
        }  
    }
  };

  if (!user || user.role !== 'admin') {
    return <ErrorComponent 
      error="Access Denied: You do not have permission to access this page."
      inBlock={false}
    />;
  }

  return (
    <>
      <div className="relative pt-14 min-h-screen h-auto w-full grid-pattern">
        <div className="w-full flex justify-center">
          <UploadForm
            isEditMode={isEditMode}
            type={uploadType}
            onChangeType={isEditMode ? () => {} : setUploadType}

            title={title}
            tags={tags}
            readTime={readTime}
            description={description}
            loading={docLoading || blogLoading}
            thumbnailPreview={thumbnailPreview}

            onChangeTitle={setTitle}
            onChangeTags={setTags}
            onChangeReadTime={setReadTime}
            onChangeDescription={setDescription}
            onSelectThumbnail={setThumbnailFile}
            onSelectDocument={setContentFile}
            onSubmit={handleSubmit}
            onCancel={() => navigate(-1)}
            onGoToExam={() => navigate('/exams/upload')}
          />
        </div>
      </div>
    </>
  )
}
