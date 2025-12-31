'use client'

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!

// Types
interface ArtworkOverview {
  _id: string
  title?: string
  views?: number
  [key: string]: any
}

interface AnalyticsState {
  overview: any | null
  viewsOverTime: { _id: string; views: number }[]
  mostViewed: ArtworkOverview[]
  engagementSplit: { _id: string; views: number }[]
  loading: boolean
  error: string | null
}

const initialState: AnalyticsState = {
  overview: null,
  viewsOverTime: [],
  mostViewed: [],
  engagementSplit: [],
  loading: false,
  error: null,
}


export const fetchAnalyticsOverview = createAsyncThunk(
  'analytics/fetchOverview',
  async () => {
    const { data } = await axios.get(`${BASE_URL}/analytics/overview`)
    if (typeof window !== 'undefined') localStorage.setItem('analyticsOverview', JSON.stringify(data))
    return data
  }
)

export const fetchViewsOverTime = createAsyncThunk(
  'analytics/fetchViewsOverTime',
  async () => {
    const { data } = await axios.get(`${BASE_URL}/analytics/views-over-time`)
    if (typeof window !== 'undefined') localStorage.setItem('viewsOverTime', JSON.stringify(data))
    return data
  }
)

export const fetchMostViewedArtworks = createAsyncThunk(
  'analytics/fetchMostViewedArtworks',
  async () => {
    const { data } = await axios.get(`${BASE_URL}/analytics/most-viewed`)
    if (typeof window !== 'undefined') localStorage.setItem('mostViewedArtworks', JSON.stringify(data))
    return data
  }
)

export const fetchEngagementSplit = createAsyncThunk(
  'analytics/fetchEngagementSplit',
  async () => {
    const { data } = await axios.get(`${BASE_URL}/analytics/engagement-split`)
    if (typeof window !== 'undefined') localStorage.setItem('engagementSplit', JSON.stringify(data))
    return data
  }
)

export const logArtworkView = createAsyncThunk<void, string>(
  "analytics/logView",
  async (artworkId) => {
    try {
      await axios.post(`${BASE_URL}/analytics/log-view/${artworkId}`, {}, {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (err) {
      console.error("Failed to log artwork view", err);
    }
  }
);


// --- Slice ---
const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    
    builder
      .addCase(logArtworkView.pending, (state) => { state.loading = true; state.error = null })
      .addCase(logArtworkView.fulfilled, (state) => { state.loading = false })
      .addCase(logArtworkView.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to log view'
      })

      // Overview
      .addCase(fetchAnalyticsOverview.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchAnalyticsOverview.fulfilled, (state, action: PayloadAction<any>) => { state.loading = false; state.overview = action.payload })
      .addCase(fetchAnalyticsOverview.rejected, (state, action) => { state.loading = false; state.error = action.error.message || 'Failed to fetch overview' })

      // Views over time
      .addCase(fetchViewsOverTime.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchViewsOverTime.fulfilled, (state, action: PayloadAction<{ _id: string; views: number }[]>) => { state.loading = false; state.viewsOverTime = action.payload })
      .addCase(fetchViewsOverTime.rejected, (state, action) => { state.loading = false; state.error = action.error.message || 'Failed to fetch views over time' })

      // Most viewed
      .addCase(fetchMostViewedArtworks.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchMostViewedArtworks.fulfilled, (state, action: PayloadAction<ArtworkOverview[]>) => { state.loading = false; state.mostViewed = action.payload })
      .addCase(fetchMostViewedArtworks.rejected, (state, action) => { state.loading = false; state.error = action.error.message || 'Failed to fetch most viewed artworks' })

      // Engagement split
      .addCase(fetchEngagementSplit.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchEngagementSplit.fulfilled, (state, action: PayloadAction<{ _id: string; views: number }[]>) => { state.loading = false; state.engagementSplit = action.payload })
      .addCase(fetchEngagementSplit.rejected, (state, action) => { state.loading = false; state.error = action.error.message || 'Failed to fetch engagement split' })
  }
})

export default analyticsSlice.reducer
