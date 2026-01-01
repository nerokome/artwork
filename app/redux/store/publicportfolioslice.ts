'use client'

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;


export interface Artwork {
  id: string;
  title: string;
  url: string;
  isPublic: boolean;
  createdAt: string;
  views?: number;
}

interface PublicPortfolioState {
  profile: { name: string } | null;
  count: number;
  artworks: Artwork[];
  loading: boolean;
  error: string | null;
}

const initialState: PublicPortfolioState = {
  profile: null,
  count: 0,
  artworks: [],
  loading: false,
  error: null,
};


export const fetchPublicPortfolio = createAsyncThunk<
  { profile: { name: string }; count: number; artworks: Artwork[] },
  string,
  { rejectValue: { error: string } }
>(
  "publicPortfolio/fetch",
  async (name, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/portfolio/${name}`);
      const data = response.data;

     
      const normalizedArtworks = (data.artworks || []).map((art: any) => ({
        
        id: art.id || art._id || art._id?.$oid || String(art._id),
        title: art.title,
        url: art.url,
        isPublic: art.isPublic,
        createdAt: art.createdAt,
        views: art.views || 0
      }));

      return {
        profile: data.profile,
        count: data.count,
        artworks: normalizedArtworks,
      };
    } catch (err: any) {
      
      const errorMessage = err.response?.data?.error || "Server error";
      return rejectWithValue({ error: errorMessage });
    }
  }
);

export const publicPortfolioSlice = createSlice({
  name: "publicPortfolio",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      
      .addCase(fetchPublicPortfolio.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicPortfolio.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.profile;
        state.count = action.payload.count;
        state.artworks = action.payload.artworks;
      })
      .addCase(fetchPublicPortfolio.rejected, (state, action) => {
        state.loading = false;
        
        state.error = action.payload?.error || "Unknown error";
      });
  },
});

export default publicPortfolioSlice.reducer;