import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

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
  selectedQueryId: 'all-customers',
  currentSql: 'SELECT * FROM customers LIMIT 10;',
  predefinedQueries: [
    {
      id: 'all-customers',
      name: 'All Customers',
      sql: 'SELECT * FROM customers LIMIT 10;',
      description: 'Retrieve all customer records',
    },
    {
      id: 'recent-orders',
      name: 'Recent Orders',
      sql: 'SELECT * FROM orders ORDER BY OrderDate DESC LIMIT 20;',
      description: 'Most recent orders',
    },
    {
      id: 'product-inventory',
      name: 'Product Inventory',
      sql: 'SELECT ProductID, ProductName, UnitsInStock, UnitsOnOrder FROM products WHERE Discontinued = 0;',
      description: 'Current product inventory',
    },
    {
      id: 'employee-list',
      name: 'Employee List',
      sql: 'SELECT EmployeeID, FirstName, LastName, Title, City FROM employees;',
      description: 'All employees',
    },
    {
      id: 'top-products',
      name: 'Top Products',
      sql: 'SELECT ProductID, ProductName, UnitPrice FROM products ORDER BY UnitPrice DESC LIMIT 10;',
      description: 'Highest priced products',
    },
  ],
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
      // Keep only last 50 queries
      if (state.queryHistory.length > 50) {
        state.queryHistory = state.queryHistory.slice(0, 50)
      }
    },
    clearHistory: (state) => {
      state.queryHistory = []
    },
  },
})

export const { setCurrentSql, selectPredefinedQuery, addToHistory, clearHistory } = querySlice.actions
export default querySlice.reducer

