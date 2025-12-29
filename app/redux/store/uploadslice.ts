import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;


interface Artwork {
  id: string
  title: string
  url: string
  views: number
}

interface ArtworkState {
  uploads: Artwork[]
  loading: boolean
  error: any
}

const initialState: ArtworkState = {
  uploads: [],
  loading: false,
  error: null,
}

// Thunk for uploading artwork
export const uploadArtwork = createAsyncThunk<
  Artwork,
  { title: string; file: File },
  { rejectValue: any }
>('artwork/upload', async ({ title, file }, { rejectWithValue, getState }) => {
  try {
    const formData = new FormData()
    formData.append('title', title)
    formData.append('file', file)

    // Optionally get token if backend requires auth
    const state: any = getState()
    const token = state.user.token

    const response = await axios.post(`${BASE_URL}/artworks/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
    return response.data.artwork
  } catch (err: any) {
    return rejectWithValue(err.response?.data || { message: 'Upload failed' })
  }
})

const artworkSlice = createSlice({
  name: 'artwork',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadArtwork.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(uploadArtwork.fulfilled, (state, action) => {
        state.loading = false
        state.uploads.push(action.payload)
      })
      .addCase(uploadArtwork.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export default artworkSlice.reducer
