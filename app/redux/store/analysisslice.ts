'use client'

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!

// --------------------
// Types
// --------------------
export interface ArtworkOverview {
  id: string
  title: string
  views: number
  url?: string
}

export interface ViewerSplit {
  _id: string
  count: number
}

export interface AnalyticsOverview {
  totalViews: number
  totalArtworks: number
  viewerSplit: ViewerSplit[]
}

export interface ViewsOverTime {
  _id: string 
  views: number
}

export interface EngagementSplit {
  _id: string
  title: string
  views: number
}


interface AnalyticsState {
  overview: {
    data: AnalyticsOverview | null
    loading: boolean
    error: string | null
  }
  viewsOverTime: {
    data: ViewsOverTime[]
    loading: boolean
    error: string | null
  }
  mostViewed: {
    data: ArtworkOverview[]
    loading: boolean
    error: string | null
  }
  engagementSplit: {
    data: EngagementSplit[]
    loading: boolean
    error: string | null
  }
  logView: {
    loading: boolean
    error: string | null
  }
}

const initialState: AnalyticsState = {
  overview: { data: null, loading: false, error: null },
  viewsOverTime: { data: [], loading: false, error: null },
  mostViewed: { data: [], loading: false, error: null },
  engagementSplit: { data: [], loading: false, error: null },
  logView: { loading: false, error: null },
}


const getAuthHeader = () => {
  const token = localStorage.getItem('token') // adjust key if needed
  return token ? { Authorization: `Bearer ${token}` } : {}
}


export const fetchAnalyticsOverview = createAsyncThunk<AnalyticsOverview>(
  'analytics/fetchOverview',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/analytics/overview`, {
        headers: getAuthHeader(),
      })
      return data
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch overview')
    }
  }
)


export const fetchViewsOverTime = createAsyncThunk<ViewsOverTime[]>(
  'analytics/fetchViewsOverTime',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/analytics/views-over-time`, {
        headers: getAuthHeader(),
      })
      return data
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch views over time')
    }
  }
)


export const fetchMostViewedArtworks = createAsyncThunk<ArtworkOverview[]>(
  'analytics/fetchMostViewedArtworks',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/analytics/most-viewed`, {
        headers: getAuthHeader(),
      })
      return data
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch most viewed')
    }
  }
)


export const fetchEngagementSplit = createAsyncThunk<EngagementSplit[]>(
  'analytics/fetchEngagementSplit',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/analytics/engagement-split`, {
        headers: getAuthHeader(),
      })
      return data
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch engagement split')
    }
  }
)

// 5. Log Artwork View (UNCHANGED)
export const logArtworkView = createAsyncThunk<void, string>(
  'analytics/logView',
  async (artworkId, { rejectWithValue }) => {
    if (!artworkId || artworkId === 'undefined') return
    try {
      await axios.post(`${BASE_URL}/analytics/log-view/${artworkId}`)
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to log view')
    }
  }
)

// --------------------
// Slice
// --------------------
const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // logArtworkView
    builder
      .addCase(logArtworkView.pending, (state) => {
        state.logView.loading = true
        state.logView.error = null
      })
      .addCase(logArtworkView.fulfilled, (state) => {
        state.logView.loading = false
      })
      .addCase(logArtworkView.rejected, (state, action) => {
        state.logView.loading = false
        state.logView.error = action.payload as string
      })

    // fetchAnalyticsOverview
    builder
      .addCase(fetchAnalyticsOverview.pending, (state) => {
        state.overview.loading = true
        state.overview.error = null
      })
      .addCase(fetchAnalyticsOverview.fulfilled, (state, action) => {
        state.overview.loading = false
        state.overview.data = action.payload
      })
      .addCase(fetchAnalyticsOverview.rejected, (state, action) => {
        state.overview.loading = false
        state.overview.error = action.payload as string
      })

    // fetchViewsOverTime
    builder
      .addCase(fetchViewsOverTime.pending, (state) => {
        state.viewsOverTime.loading = true
        state.viewsOverTime.error = null
      })
      .addCase(fetchViewsOverTime.fulfilled, (state, action) => {
        state.viewsOverTime.loading = false
        state.viewsOverTime.data = action.payload
      })
      .addCase(fetchViewsOverTime.rejected, (state, action) => {
        state.viewsOverTime.loading = false
        state.viewsOverTime.error = action.payload as string
      })

    // fetchMostViewedArtworks
    builder
      .addCase(fetchMostViewedArtworks.pending, (state) => {
        state.mostViewed.loading = true
        state.mostViewed.error = null
      })
      .addCase(fetchMostViewedArtworks.fulfilled, (state, action) => {
        state.mostViewed.loading = false
        state.mostViewed.data = action.payload
      })
      .addCase(fetchMostViewedArtworks.rejected, (state, action) => {
        state.mostViewed.loading = false
        state.mostViewed.error = action.payload as string
      })

    // fetchEngagementSplit
    builder
      .addCase(fetchEngagementSplit.pending, (state) => {
        state.engagementSplit.loading = true
        state.engagementSplit.error = null
      })
      .addCase(fetchEngagementSplit.fulfilled, (state, action) => {
        state.engagementSplit.loading = false
        state.engagementSplit.data = action.payload
      })
      .addCase(fetchEngagementSplit.rejected, (state, action) => {
        state.engagementSplit.loading = false
        state.engagementSplit.error = action.payload as string
      })
  },
})

export default analyticsSlice.reducer
