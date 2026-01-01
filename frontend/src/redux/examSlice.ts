import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../libs/api";
import type { ExamType } from "../Types";

interface ExamState {
    items: ExamType[];
    loading: boolean;
    error: string | null;
    currentItem?: ExamType | null;
}

const initialState: ExamState = {
    items: [],
    loading: false,
    error: null,
    currentItem: null,
};

export const fetchExams = createAsyncThunk("exams/fetchExams", async (_, { rejectWithValue }) => {
    try {
        const response = await api.get("/exams");
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch exams");
    }
});

export const fetchExamById = createAsyncThunk(
    "exams/fetchExamById",
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await api.get(`/exams/${id}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch exam");
        }
    }
);

const examSlice = createSlice({
    name: "exams",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchExams.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchExams.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchExams.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
        
        builder
            .addCase(fetchExamById.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.currentItem = null;
            })
            .addCase(fetchExamById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentItem = action.payload;
            })
            .addCase(fetchExamById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default examSlice.reducer;
