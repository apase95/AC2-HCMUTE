import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import blogReducer from './blogSlice';
import documentReducer from './documentSlice';
import examReducer from './examSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        blogs: blogReducer,
        documents: documentReducer,
        exams: examReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;