import { changePhone } from './../../../backend/src/controllers/userController';
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../libs/api";
import type { AuthState, LoginResponse, RegisterPayload, User } from "../Types";

export const loginUser = createAsyncThunk(
    "auth/login",
    async (credentials: { email: string; password: string },  { rejectWithValue }) => {
        try {
            const response = await api.post<LoginResponse>("auth/signin", credentials);
            localStorage.setItem("accessToken", response.data.accessToken);

            const meResponse = await api.get<User>("users/me");
            return { token: response.data.accessToken, user: meResponse.data };
        } catch (error : any) {
            console.error("Login error:", error);
            return rejectWithValue(error.response?.data?.message || "LOGIN FAILED DUE TO SERVER ERROR");
        }
    }
);

export const registerUser = createAsyncThunk(
    'auth/register',
    async (data: RegisterPayload, { rejectWithValue }) => {
        try {
            await api.post('/auth/register', data);
            return;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'REGISTRATION FAILED DUE TO SERVER ERROR');
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await api.post('/auth/signout');
        } catch (error: any) {
            console.error(error);
        } finally {
            localStorage.removeItem('accessToken');
        }
    }
);

export const changePhoneNumber = createAsyncThunk(
    'auth/changePhoneNumber',
    async (data: {password: string, oldPhone: string, newPhone: string}, { rejectWithValue }) => {
        try {
            const response = await api.put('/users/change-phone', data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message ||
                 'CHANGE PHONE NUMBER FAILED DUE TO SERVER ERROR');
        }
    }
);

export const changePassword = createAsyncThunk(
    'auth/changePassword',
    async (data: { phone: string, oldPass: string, newPass: string }, { rejectWithValue }) => {
        try {
            const response = await api.put('/users/change-password', data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 
                'Failed to update password');
        }
    }
);

export const updateUser = createAsyncThunk(
    'auth/updateUser',
    async (userData: Partial<User>, { rejectWithValue }) => {
        try {
            const response = await api.put('/users/update', userData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'UPDATE FAILED DUE TO SERVER ERROR');
        }
    }
);

export const checkAuth = createAsyncThunk(
    'auth/checkAuth',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) return rejectWithValue('No token');

            const response = await api.get('/users/me');
            return { user: response.data, token };
        } catch (error) {
            localStorage.removeItem('accessToken');
            return rejectWithValue('Session expired');
        }
    }
);

const initialState: AuthState = {
    user: null,
    accessToken: localStorage.getItem('accessToken'),
    isAuthenticated: !!localStorage.getItem('accessToken'),
    isLoading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        //LOGIN
        builder.addCase(loginUser.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(loginUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.accessToken = action.payload.token;
        });
        builder.addCase(loginUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        //REGISTER
        builder.addCase(registerUser.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(registerUser.fulfilled, (state) => {
            state.isLoading = false;
            state.error = null;
        });
        builder.addCase(registerUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        // CHANGE PHONE NUMBER
        builder.addCase(changePhoneNumber.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(changePhoneNumber.fulfilled, (state, action) => {
            state.isLoading = false;
            if (state.user) {
                state.user.phoneNumber = action.meta.arg.newPhone;
            }
        });
        builder.addCase(changePhoneNumber.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        // CHANGE PASSWORD
        builder.addCase(changePassword.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(changePassword.fulfilled, (state) => {
            state.isLoading = false;
        });
        builder.addCase(changePassword.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        // UPDATE USER
        builder.addCase(updateUser.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(updateUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload; 
        });
        builder.addCase(updateUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });

        //LOGOUT
        builder.addCase(logoutUser.fulfilled, (state) => {
            state.user = null;
            state.accessToken = null;
            state.isAuthenticated = false;
        });

        // CHECK AUTH
        builder.addCase(checkAuth.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(checkAuth.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
        });
        builder.addCase(checkAuth.rejected, (state) => {
            state.isLoading = false;
            state.isAuthenticated = false;
            state.user = null;
            state.accessToken = null;
        });
    }
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;