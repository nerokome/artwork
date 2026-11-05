import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userslice'
import artworkReducer from './uploadslice'
import analyticsReducer from './analysisslice'
import publicPortfolioReducer from './publicportfolioslice' 
import messagingReducer from './messagingslice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    artwork: artworkReducer,
    analytics: analyticsReducer,
    publicPortfolio: publicPortfolioReducer, 
    messaging: messagingReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
