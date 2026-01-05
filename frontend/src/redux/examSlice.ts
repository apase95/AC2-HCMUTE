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

export const addExamReview = createAsyncThunk(
    "exams/addReview",
    async ({ id, rating, comment } : { id: string; rating: number; comment: string }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/exams/${id}/review`, { rating, comment });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to add review");
        }
    }
);

export const submitExamResult = createAsyncThunk(
    "exams/submitScore",
    async ({ id, score } : { id: string; score: number }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/exams/${id}/score`, { score });
            return { id, score: response.data.highScore, submittedCount: response.data.submittedCount };
        } catch (error: any) {
            return rejectWithValue("Failed to save score");
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

        builder
            .addCase(addExamReview.fulfilled, (state, action) => {
                state.currentItem = action.payload;
            });
        
        builder
            .addCase(submitExamResult.fulfilled, (state, action) => {
                if (state.currentItem && state.currentItem._id === action.payload.id) {
                    if (!state.currentItem.userScores) {
                        state.currentItem.userScores = {};
                    }
                    state.currentItem.completionCount = action.payload.score;
                    state.currentItem.submittedCount = action.payload.submittedCount;
                }
                const examInList = state.items.find(e => e._id === action.payload.id);
                if (examInList) {
                    examInList.completionCount = action.payload.score;
                    examInList.submittedCount = action.payload.submittedCount;
                }
            });
    },
});

export default examSlice.reducer;
