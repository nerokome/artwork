'use client'

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!

// --------------------
// Types (HARDENED)
// --------------------
export interface ArtworkOverview {
  _id: string
  title: string
  views: number
}

interface AnalyticsOverview {
  totalViews: number
  totalArtworks: number
  totalEngagements: number
}

interface AnalyticsState {
  overview: AnalyticsOverview | null
  viewsOverTime: { _id: string; views: number }[]
  mostViewed: ArtworkOverview[]
  engagementSplit: { _id: string; views: number }[]
  loading: boolean
  error: string | null
}

// --------------------
// Initial State
// --------------------
const initialState: AnalyticsState = {
  overview: null,
  viewsOverTime: [],
  mostViewed: [],
  engagementSplit: [],
  loading: false,
  error: null,
}

// --------------------
// Thunks
// --------------------
export const fetchAnalyticsOverview = createAsyncThunk(
  'analytics/fetchOverview',
  async () => {
    const { data } = await axios.get(`${BASE_URL}/analytics/overview`)
    return data
  }
)

export const fetchViewsOverTime = createAsyncThunk(
  'analytics/fetchViewsOverTime',
  async () => {
    const { data } = await axios.get(`${BASE_URL}/analytics/views-over-time`)
    return data
  }
)

export const fetchMostViewedArtworks = createAsyncThunk(
  'analytics/fetchMostViewedArtworks',
  async () => {
    const { data } = await axios.get(`${BASE_URL}/analytics/most-viewed`)
    return data
  }
)

export const fetchEngagementSplit = createAsyncThunk(
  'analytics/fetchEngagementSplit',
  async () => {
    const { data } = await axios.get(`${BASE_URL}/analytics/engagement-split`)
    return data
  }
)

export const logArtworkView = createAsyncThunk<void, string>(
  'analytics/logView',
  async (artworkId) => {
    await axios.post(
      `${BASE_URL}/analytics/log-view/${artworkId}`,
      {},
      { headers: { 'Content-Type': 'application/json' } }
    )
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
    builder

      // Log view
      .addCase(logArtworkView.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(logArtworkView.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(logArtworkView.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to log view'
      })

      // Overview
      .addCase(fetchAnalyticsOverview.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(
        fetchAnalyticsOverview.fulfilled,
        (state, action: PayloadAction<AnalyticsOverview>) => {
          state.loading = false
          state.overview = action.payload
        }
      )
      .addCase(fetchAnalyticsOverview.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch overview'
      })

      // Views over time
      .addCase(fetchViewsOverTime.fulfilled, (state, action) => {
        state.viewsOverTime = action.payload
        state.loading = false
      })

      // Most viewed artworks
      .addCase(
        fetchMostViewedArtworks.fulfilled,
        (state, action: PayloadAction<ArtworkOverview[]>) => {
          state.loading = false
          state.mostViewed = action.payload
        }
      )

      // Engagement split
      .addCase(fetchEngagementSplit.fulfilled, (state, action) => {
        state.loading = false
        state.engagementSplit = action.payload
      })
  },
})

export default analyticsSlice.reducer
