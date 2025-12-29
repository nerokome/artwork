import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const BASE_URL = process.env.NEXT_PUBLIC_API_URL 


export const signupUser = createAsyncThunk(
  'user/signup',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/signup`, { email, password });
      return response.data; 
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  }
);


export const loginUser = createAsyncThunk(
  'user/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, { email, password });
      return response.data; 
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null as unknown,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Signup
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
