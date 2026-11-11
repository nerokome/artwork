import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;


interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
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

export const fetchCurrentProfile = createAsyncThunk<
  { name?: string; avatarUrl?: string },
  string,
  { rejectValue: string }
>('user/fetchCurrentProfile', async (token, { rejectWithValue }) => {
  try {
    const response = await axios.get<{
      profile?: {
        name?: string;
        profilePictureUrl?: string;
        avatarUrl?: string;
      };
    }>(`${BASE_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const profile = response.data.profile;
    if (!profile) {
      return rejectWithValue('The profile response was invalid.');
    }

    return {
      ...(typeof profile.name === 'string' ? { name: profile.name } : {}),
      avatarUrl: profile.profilePictureUrl || profile.avatarUrl || '',
    };
  } catch (err) {
    return rejectWithValue(
      axios.isAxiosError(err)
        ? err.response?.data?.message || 'Could not load your profile picture.'
        : 'Could not load your profile picture.'
    );
  }
});

export const logoutUser = createAsyncThunk('user/logout', async () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  return;
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateLocalProfile: (
      state,
      action: PayloadAction<{ name?: string; avatarUrl?: string }>
    ) => {
      if (!state.user) return;
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.user));
    },
  },
  extraReducers: (builder) => {
    builder
      
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
      .addCase(fetchCurrentProfile.fulfilled, (state, action) => {
        if (!state.user) return;
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
      })
      // LOGOUT
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.error = null;
      });
  },
});

export const { updateLocalProfile } = userSlice.actions;
export default userSlice.reducer;
