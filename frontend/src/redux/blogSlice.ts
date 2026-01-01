import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../libs/api";
import type { BlogType } from "../Types";

interface BlogState {
    items: BlogType[];
    currentItem?: BlogType | null;
    loading: boolean;
    error: string | null;
    uploadSuccess: boolean;
}

const initialState: BlogState = {
    items: [],
    currentItem: null,
    loading: false,
    error: null,
    uploadSuccess: false,
};

export const fetchBlogs = createAsyncThunk(
    "blogs/fetchBlogs", 
    async (_, { rejectWithValue }) => {
    try {
        const response = await api.get("/blogs");
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "FAILED TO FETCH BLOGS");
    }
});

export const createBlog = createAsyncThunk(
    "blogs/createBlog",
    async (formData: FormData, { rejectWithValue }) => {
        try {
            const response = await api.post('/blogs', formData, { 
                headers: { 'Content-Type': 'multipart/form-data' } 
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "CREATED BLOG FAILED");
        }
    }
);

export const fetchBlogById = createAsyncThunk(
    "blogs/fetchById",
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await api.get(`/blogs/${id}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "FAILED TO FETCH BLOG BY ID");
        }
    }
);

const blogSlice = createSlice({
    name: "blogs",
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
        }
    },
    extraReducers: (builder) => {
        // Fetch All
        builder.addCase(fetchBlogs.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(fetchBlogs.fulfilled, (state, action) => {
            state.loading = false;
            state.items = action.payload;
        })
        builder.addCase(fetchBlogs.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Fetch ById
        builder.addCase(fetchBlogById.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.currentItem = null;
        });
        builder.addCase(fetchBlogById.fulfilled, (state, action) => {
            state.loading = false;
            state.currentItem = action.payload;
        });
        builder.addCase(fetchBlogById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
        
        // Create
        builder.addCase(createBlog.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.uploadSuccess = false;
        });
        builder.addCase(createBlog.fulfilled, (state, action) => {
            state.loading = false;
            state.uploadSuccess = true;
            state.items.unshift(action.payload);
        });
        builder.addCase(createBlog.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
            state.uploadSuccess = false;
        });
    },
});

export const { resetUploadState, clearCurrentItem } = blogSlice.actions; 
export default blogSlice.reducer;