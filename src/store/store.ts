import { configureStore } from '@reduxjs/toolkit'
import queryReducer from './slices/querySlice'
import resultsReducer from './slices/resultsSlice'

export const store = configureStore({
  reducer: {
    query: queryReducer,
    results: resultsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

