import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../libs/api";
import type { DocumentType } from "../Types";

interface DocumentState {
    items: DocumentType[];
    currentItem?: DocumentType | null;
    loading: boolean;
    error: string | null;
    uploadSuccess?: boolean;
}

const initialState: DocumentState = {
    items: [],
    loading: false,
    error: null,
    uploadSuccess: false,
};

export const fetchDocuments = createAsyncThunk("documents/fetchDocuments", async (_, { rejectWithValue }) => {
    try {
        const response = await api.get("/documents");
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "FAILED TO FETCH DOCUMENTS");
    }
});

export const createDocument = createAsyncThunk(
    "documents/createDocument",
    async (formData: FormData, { rejectWithValue }) => {
        try {
            const response = await api.post("/documents", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return response.data;
        } catch (error: any) {
            console.error("Upload error:", error);
            return rejectWithValue(error.response?.data?.message || "FAILED TO UPLOAD DOCUMENT");
        }
    }
);

export const fetchDocumentById = createAsyncThunk("documents/fetchById", async (id: string, { rejectWithValue }) => {
    try {
        const response = await api.get(`/documents/${id}`);
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "FAILED TO FETCH DOCUMENT BY ID");
    }
});

export const deleteDocument = createAsyncThunk("documents/deleteDocument", async (id: string, { rejectWithValue }) => {
    try {
        await api.delete(`/documents/${id}`);
        return id;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "DELETE DOCUMENT FAILED");
    }
});

const documentSlice = createSlice({
    name: "documents",
    initialState,
    reducers: {
        resetUploadState: (state) => {
            state.uploadSuccess = false;
            state.error = null;
            state.loading = false;
        },
        clearCurrentItem: (state) => {
            state.currentItem = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // FetchAll
            .addCase(fetchDocuments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDocuments.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchDocuments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // FetchById
        builder.addCase(fetchDocumentById.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.currentItem = null;
        });
        builder.addCase(fetchDocumentById.fulfilled, (state, action) => {
            state.loading = false;
            state.currentItem = action.payload;

            const index = state.items.findIndex((item) => item._id === action.payload._id);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
        });
        builder.addCase(fetchDocumentById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Create
        builder.addCase(createDocument.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.uploadSuccess = false;
        });
        builder.addCase(createDocument.fulfilled, (state, action) => {
            state.loading = false;
            state.uploadSuccess = true;
            state.items.unshift(action.payload);
        });
        builder.addCase(createDocument.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
            state.uploadSuccess = false;
        });

        // Delete
        builder.addCase(deleteDocument.fulfilled, (state, action) => {
            state.items = state.items.filter((doc) => doc._id !== action.payload);
        });
    },
});

export const { resetUploadState, clearCurrentItem } = documentSlice.actions;
export default documentSlice.reducer;
