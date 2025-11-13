import Papa from 'papaparse'
import { setLoading, setResults, setError } from '@/store/slices/resultsSlice'
import { addToHistory } from '@/store/slices/querySlice'
import type { AppDispatch } from '@/store/store'
import type { QueryResult } from '@/store/slices/resultsSlice'

// CSV file mappings
const csvFiles: Record<string, string> = {
  customers: '/data/customers.csv',
  orders: '/data/orders.csv',
  products: '/data/products.csv',
  employees: '/data/employees.csv',
  order_details: '/data/order_details.csv',
  categories: '/data/categories.csv',
  shippers: '/data/shippers.csv',
  suppliers: '/data/suppliers.csv',
  territories: '/data/territories.csv',
  regions: '/data/regions.csv',
  employee_territories: '/data/employee_territories.csv',
}

// Simple SQL parser to extract table name
function parseTableName(sql: string): string | null {
  const fromMatch = sql.match(/FROM\s+(\w+)/i)
  return fromMatch ? fromMatch[1].toLowerCase() : null
}

// Load CSV data
async function loadCSV(tableName: string): Promise<any[]> {
  const csvPath = csvFiles[tableName]
  if (!csvPath) {
    throw new Error(`Table '${tableName}' not found`)
  }

  const response = await fetch(csvPath)
  const csvText = await response.text()

  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
      error: (error: Error) => reject(error),
    })
  })
}

// Simple query executor (mock SQL execution)
export async function executeQuery(sql: string, dispatch: AppDispatch): Promise<void> {
  dispatch(setLoading(true))

  const startTime = performance.now()

  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300))

    // Parse table name
    const tableName = parseTableName(sql)
    if (!tableName) {
      throw new Error('Could not parse table name from query')
    }

    // Load CSV data
    const data = await loadCSV(tableName)

    if (data.length === 0) {
      throw new Error('No data found')
    }

    // Get columns from first row
    const columns = Object.keys(data[0])

    // Apply LIMIT if present
    let rows = data
    const limitMatch = sql.match(/LIMIT\s+(\d+)/i)
    if (limitMatch) {
      const limit = parseInt(limitMatch[1])
      rows = data.slice(0, limit)
    }

    const executionTime = Math.round(performance.now() - startTime)

    const result: QueryResult = {
      columns,
      rows,
      rowCount: rows.length,
      executionTime,
    }

    dispatch(setResults(result))
    dispatch(addToHistory({ sql, rowCount: rows.length }))

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    dispatch(setError(errorMessage))
  }
}

