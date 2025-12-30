import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!

export interface Artwork {
  id: string
  title: string
  url: string
  views: number
}

interface ArtworkState {
  uploads: Artwork[]
  myArtworks: Artwork[]
  myArtworksCount: number
  loading: boolean
  error: any
}

const initialState: ArtworkState = {
  uploads: [],
  myArtworks: [],
  myArtworksCount: 0,
  loading: false,
  error: null,
}


export const uploadArtwork = createAsyncThunk<
  Artwork,
  { title: string; file: File },
  { rejectValue: any }
>('artwork/upload', async ({ title, file }, { rejectWithValue, getState }) => {
  try {
    const formData = new FormData()
    formData.append('title', title)
    formData.append('file', file)

    const state: any = getState()
    const token = state.user?.token

    const response = await axios.post(`${BASE_URL}/artworks/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    })

    return response.data.artwork
  } catch (err: any) {
    return rejectWithValue(err.response?.data || { message: 'Upload failed' })
  }
})


export const getMyArtworks = createAsyncThunk<
  { artworks: Artwork[]; count: number },
  void,
  { rejectValue: any }
>('artwork/getMyArtworks', async (_, { rejectWithValue, getState }) => {
  try {
    const state: any = getState()
    const token = state.user?.token

    const response = await axios.get(`${BASE_URL}/artworks/mine`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    
    const artworks = Array.isArray(response.data.artworks)
      ? response.data.artworks
      : []

    const count = typeof response.data.count === 'number' ? response.data.count : artworks.length

    return { artworks, count }
  } catch (err: any) {
    return rejectWithValue(err.response?.data || { message: 'Failed to fetch artworks' })
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
        state.uploads.unshift(action.payload)
      })
      .addCase(uploadArtwork.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      
      .addCase(getMyArtworks.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getMyArtworks.fulfilled, (state, action) => {
        state.loading = false
        state.myArtworks = action.payload.artworks || []
        state.myArtworksCount = action.payload.count || 0
      })
      .addCase(getMyArtworks.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.myArtworks = []
        state.myArtworksCount = 0
      })
  },
})

export default artworkSlice.reducer
