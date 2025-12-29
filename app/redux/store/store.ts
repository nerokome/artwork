import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userslice'
import artworkReducer from './uploadslice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    artwork: artworkReducer, 
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
