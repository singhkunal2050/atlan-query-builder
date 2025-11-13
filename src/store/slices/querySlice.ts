import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { PREDEFINED_QUERIES, QUERY_EXECUTION } from '@/lib/constants'

export interface PredefinedQuery {
  id: string
  name: string
  sql: string
  description?: string
}

interface QueryState {
  selectedQueryId: string | null
  currentSql: string
  predefinedQueries: PredefinedQuery[]
  queryHistory: Array<{
    id: string
    sql: string
    timestamp: number
    rowCount: number
  }>
}

const initialState: QueryState = {
  selectedQueryId: PREDEFINED_QUERIES[0].id,
  currentSql: PREDEFINED_QUERIES[0].sql,
  predefinedQueries: [...PREDEFINED_QUERIES],
  queryHistory: [],
}

const querySlice = createSlice({
  name: 'query',
  initialState,
  reducers: {
    setCurrentSql: (state, action: PayloadAction<string>) => {
      state.currentSql = action.payload
    },
    selectPredefinedQuery: (state, action: PayloadAction<string>) => {
      const query = state.predefinedQueries.find(q => q.id === action.payload)
      if (query) {
        state.selectedQueryId = query.id
        state.currentSql = query.sql
      }
    },
    addToHistory: (state, action: PayloadAction<{ sql: string; rowCount: number }>) => {
      state.queryHistory.unshift({
        id: Date.now().toString(),
        sql: action.payload.sql,
        timestamp: Date.now(),
        rowCount: action.payload.rowCount,
      })
      // Keep only last N queries
      if (state.queryHistory.length > QUERY_EXECUTION.MAX_HISTORY_ENTRIES) {
        state.queryHistory = state.queryHistory.slice(0, QUERY_EXECUTION.MAX_HISTORY_ENTRIES)
      }
    },
    clearHistory: (state) => {
      state.queryHistory = []
    },
  },
})

export const { setCurrentSql, selectPredefinedQuery, addToHistory, clearHistory } = querySlice.actions
export default querySlice.reducer

