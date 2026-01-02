import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;


interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface UserState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: any;
}


const getStoredUser = (): User | null => {
  try {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const getStoredToken = (): string | null => {
  try {
    return localStorage.getItem('token');
  } catch {
    return null;
  }
};

const initialState: UserState = {
  user: getStoredUser(),
  token: getStoredToken(),
  loading: false,
  error: null,
};

// THUNKS
// THUNKS
export const signupUser = createAsyncThunk<
  { user: User; token: string },
  { fullName: string; email: string; password: string },
  { rejectValue: any }
>('user/signup', async ({ fullName, email, password }, { rejectWithValue }) => {
  try {
    // --- CLEAN DATA HERE ---
    const cleanData = {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      password: password // Don't trim passwords (spaces can be intentional there)
    };

    const response = await axios.post(`${BASE_URL}/auth/signup`, cleanData);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data || { message: 'Signup failed' });
  }
});

export const loginUser = createAsyncThunk<
  { user: User; token: string },
  { email: string; password: string },
  { rejectValue: any }
>('user/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    // --- CLEAN DATA HERE ---
    const cleanData = {
      email: email.trim().toLowerCase(),
      password: password
    };

    const response = await axios.post(`${BASE_URL}/auth/login`, cleanData);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data || { message: 'Login failed' });
  }
});

export const logoutUser = createAsyncThunk('user/logout', async () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  return;
});

// SLICE
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // SIGNUP
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // LOGOUT
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.error = null;
      });
  },
});

export default userSlice.reducer;
