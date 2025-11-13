// Keyboard Shortcuts
export const KEYBOARD_SHORTCUTS = {
  RUN_QUERY: { mac: '⌘+Enter', win: 'Ctrl+Enter' },
  EXPORT: { mac: '⌘+E', win: 'Ctrl+E' },
  CLEAR_RESULTS: { mac: '⌘+⇧+C', win: 'Ctrl+Shift+C' },
  SHOW_HELP: { mac: '⌘+/', win: 'Ctrl+/' },
} as const

// Predefined Queries
export const PREDEFINED_QUERIES = [
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
] as const

// CSV File Mappings
export const CSV_FILES: Record<string, string> = {
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

// Query Execution
export const QUERY_EXECUTION = {
  SIMULATED_DELAY_MS: 300,
  MAX_HISTORY_ENTRIES: 50,
} as const

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 50,
  PAGE_SIZE_OPTIONS: [25, 50, 100, 200],
} as const

// Editor
export const EDITOR_CONFIG = {
  FONT_SIZE: 13,
  LINE_HEIGHT: 20,
  FONT_FAMILY: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
  SCROLLBAR_SIZE: 8,
} as const

