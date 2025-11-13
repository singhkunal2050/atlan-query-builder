import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { PAGINATION } from '@/lib/constants'

export interface QueryResult {
  columns: string[]
  rows: Record<string, any>[]
  rowCount: number
  executionTime: number
}

interface ResultsState {
  data: QueryResult | null
  loading: boolean
  error: string | null
  sortColumn: string | null
  sortDirection: 'asc' | 'desc'
  searchTerm: string
  currentPage: number
  pageSize: number
}

const initialState: ResultsState = {
  data: null,
  loading: false,
  error: null,
  sortColumn: null,
  sortDirection: 'asc',
  searchTerm: '',
  currentPage: 1,
  pageSize: PAGINATION.DEFAULT_PAGE_SIZE,
}

const resultsSlice = createSlice({
  name: 'results',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
      if (action.payload) {
        state.error = null
      }
    },
    setResults: (state, action: PayloadAction<QueryResult>) => {
      state.data = action.payload
      state.loading = false
      state.error = null
      state.currentPage = 1
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
      state.loading = false
    },
    clearResults: (state) => {
      state.data = null
      state.error = null
      state.currentPage = 1
    },
    setSortColumn: (state, action: PayloadAction<string>) => {
      if (state.sortColumn === action.payload) {
        state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc'
      } else {
        state.sortColumn = action.payload
        state.sortDirection = 'asc'
      }
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload
      state.currentPage = 1
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload
      state.currentPage = 1
    },
  },
})

export const {
  setLoading,
  setResults,
  setError,
  clearResults,
  setSortColumn,
  setSearchTerm,
  setCurrentPage,
  setPageSize,
} = resultsSlice.actions

export default resultsSlice.reducer

