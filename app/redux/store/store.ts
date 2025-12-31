import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userslice'
import artworkReducer from './uploadslice'
import analyticsReducer from './analysisslice'
import publicPortfolioReducer from './publicportfolioslice' // import the new slice

export const store = configureStore({
  reducer: {
    user: userReducer,
    artwork: artworkReducer,
    analytics: analyticsReducer,
    publicPortfolio: publicPortfolioReducer, 
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
