# SQL Query Builder 🚀

A high-performance, web-based SQL query interface built for data analysts. Run queries, visualize results, and export data—all within a snappy, intuitive UI.

![SQL Query Builder](https://img.shields.io/badge/React-19.2.0-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue) ![Vite](https://img.shields.io/badge/Vite-7.2.2-purple)

## 🎥 Demo Video

> **📹 [Watch 2-Minute Walkthrough →](YOUR_VIDEO_LINK_HERE)**
> 
> The video demonstrates:
> - How to select and run predefined queries
> - Using the Monaco code editor with SQL syntax highlighting
> - Viewing results with sorting, filtering, and pagination
> - Exporting results as CSV/JSON
> - Keyboard shortcuts (⌘+Enter to run queries)
> - Query history navigation
> - Dark/light mode switching

---

## ⚡ Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

**Live Demo:** [https://atlan-query-builder.netlify.app/](https://atlan-query-builder.netlify.app/)

---

## 🛠️ Tech Stack

### **Framework & Language**
- **React 19.2.0** - Latest React with improved concurrent rendering
- **TypeScript 5.9.3** - Type safety and better DX
- **Vite 7.2.2** - Lightning-fast build tool with HMR

### **Core Libraries**
| Library | Version | Purpose |
|---------|---------|---------|
| **@monaco-editor/react** | 4.7.0 | Full-featured SQL editor with syntax highlighting |
| **@tanstack/react-table** | 8.21.3 | Headless table with sorting, filtering, pagination |
| **@reduxjs/toolkit** | 2.10.1 | State management for queries & results |
| **papaparse** | 5.5.3 | Fast CSV parsing for Northwind data |
| **Tailwind CSS** | 4.1.17 | Utility-first styling |
| **shadcn/ui** | Latest | Accessible, customizable UI components (Radix UI) |
| **react-resizable-panels** | 3.0.6 | Resizable editor/results layout |
| **lucide-react** | 0.553.0 | Modern icon library |
| **web-vitals** | Latest | Performance metrics logging |

---

## 📊 Performance Metrics

### **Page Load Time**

Performance metrics are logged to browser console using `web-vitals` library:

| Metric | Target | Measurement |
|--------|--------|-------------|
| **First Contentful Paint (FCP)** | < 1.8s | Open DevTools Console to view |
| **Largest Contentful Paint (LCP)** | < 2.5s | Real-time logged on page load |
| **First Input Delay (FID)** | < 100ms | Logged on first interaction |
| **Cumulative Layout Shift (CLS)** | < 0.1 | Tracked throughout session |
| **Time to First Byte (TTFB)** | < 600ms | Logged on page load |

**Measurement Methodology:**
1. **web-vitals library** - Real user monitoring (RUM) metrics logged to console
2. **Chrome DevTools Performance Tab** - Detailed performance profiling
3. Run `npm run build && npm run preview` to test production build

### **Bundle Size**

Run `npm run build` to see actual bundle sizes. Expected optimizations:
- **Monaco Editor**: Lazy loaded (separate chunk)
- **Vendor chunk**: React core libraries
- **UI chunk**: Radix UI components
- **Table chunk**: TanStack Table

---

## 🚄 Performance Optimizations

### **1. Code Splitting & Lazy Loading**

```typescript
// App.tsx - Monaco Editor loaded only when needed
const Editor = lazy(() => import("@/components/Editor/Editor").then(m => ({ default: m.Editor })))
```
- Monaco editor (largest dependency) loads asynchronously
- Initial bundle excludes ~1.2 MB of editor code
- Fallback shows loading message during editor load

### **2. React Memoization**
- `useMemo` for filtered/sorted table data calculations
- `useCallback` for event handlers to prevent child re-renders
- Prevents expensive re-computations on unrelated state changes

### **3. CSV In-Memory Caching**

```typescript
// queryEngine.ts - CSVs fetched once and cached
const csvCache = new Map<string, any[]>()

async function loadCSV(tableName: string) {
  if (csvCache.has(tableName)) {
    return csvCache.get(tableName)! // Return cached data
  }
  // ... fetch and parse CSV, then cache
  csvCache.set(tableName, data)
}
```
- Network request + parsing happens once per table
- Subsequent queries use cached data (instant execution)

### **4. Build Optimizations**

```typescript
// vite.config.ts - Manual chunk splitting
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'monaco': ['@monaco-editor/react', 'monaco-editor'],
      },
    },
  },
}
```
- Separates Monaco editor into own chunk (loaded lazily)

---

## 🎯 Key Features

### **1. Advanced SQL Editor**
- Monaco Editor (same as VS Code)
- Syntax highlighting for SQL
- Auto-completion (basic)
- Multi-line editing
- Line numbers

### **2. Predefined Queries**
5 optimized queries using Northwind dataset:
1. **All Customers** - Full customer list
2. **Recent Orders** - Last 20 orders by date
3. **Product Inventory** - Active products with stock info
4. **Employee List** - All employees with contact details
5. **Top Products** - 10 most expensive products

### **3. Query History**
- Stores last 50 executed queries
- Quick re-run from history
- Auto-saves in Redux state

### **4. Results Table (Two Modes)**

**Paginated Mode** (Default):
- **Pagination**: 25/50/100/200 rows per page
- **Sorting**: Click column headers (ascending/descending)
- **Search**: Real-time filter across all columns
- **Export**: CSV or JSON download

**Virtual Mode** (For Large Datasets):
- **Virtual Scrolling**: Renders only visible rows using TanStack Virtual
- **Handles 10,000+ rows** smoothly without pagination
- **Sorting & Search**: Works on full dataset
- Toggle between modes with button in header

### **5. Keyboard Shortcuts**
| Action | macOS | Windows/Linux |
|--------|-------|---------------|
| Run Query | `⌘ + Enter` | `Ctrl + Enter` |
| Export CSV | `⌘ + E` | `Ctrl + E` |
| Export JSON | `⌘ + J` | `Ctrl + J` |
| Clear Results | `⌘ + Shift + C` | `Ctrl + Shift + C` |
| Show Help | `⌘ + /` | `Ctrl + /` |

### **6. Dark/Light Mode**
- Seamless theme switching
- Persisted in localStorage
- Affects editor, table, and UI components

---

## 🗂️ Data Source

**Northwind Database** - Classic sample dataset representing a trading company.

11 CSV files totaling ~1,500 records:
- `customers.csv` (91 records)
- `orders.csv` (830 records)
- `products.csv` (77 records)
- `employees.csv` (9 records)
- `order_details.csv` (2,155 records)
- `categories.csv`, `shippers.csv`, `suppliers.csv`, `territories.csv`, `regions.csv`, `employee_territories.csv`

**Why Northwind?**
- Industry-standard sample dataset
- Represents real-world relationships (customers → orders → products)
- Perfect for demonstrating JOINs, aggregations, and filters

---

## 🏗️ Architecture

```
/src
├── components/
│   ├── ui/              # shadcn/ui primitives
│   ├── Editor/          # Monaco SQL editor
│   ├── Table/           # TanStack Table + Virtual
│   ├── QuerySelector/   # Predefined query dropdown
│   ├── QueryHistory/    # Recent queries
│   └── ShortcutsDialog/ # Help modal
├── store/
│   ├── slices/
│   │   ├── querySlice.ts    # Current query state
│   │   └── resultsSlice.ts  # Query results state
│   └── store.ts         # Redux Toolkit config
├── lib/
│   ├── queryEngine.ts   # Mock query execution
│   ├── constants.ts     # Config & mappings
│   └── utils.ts         # Helpers
├── hooks/
│   ├── useKeyboardShortcuts.ts
│   └── useTheme.ts
└── data/                # Northwind CSVs
```

**Design Decisions:**
- **No Backend**: All query "execution" is mocked client-side
- **CSV-Based**: CSVs parsed with papaparse, cached in Redux
- **Headless UI**: TanStack Table for flexibility
- **Atomic Components**: shadcn/ui for consistency

---

## 🧪 Handling Large Datasets

The application uses **pagination** to handle large query results:

- Default: 25 rows per page
- Options: 25, 50, 100, 200 rows per page
- Client-side pagination with instant page switching
- Search/filter operates on full dataset (not just visible page)

**Dataset Included:**
- Northwind database with ~1,500 total records across 11 tables
- Largest table (order_details): 2,155 rows
- Pagination ensures smooth performance regardless of result size

---

## 🚀 Deployment

**Platform**: Netlify

**Build Command**: `npm run build`

**Output Directory**: `dist`

**Environment Variables**: None required (all CSVs bundled)

**Deployment Steps:**
1. Push to GitHub
2. Connect repo to Vercel
3. Auto-deploy on every commit to `main`
4. Preview deployments for PRs

**Optimizations Enabled:**
- Edge caching for static assets
- Automatic HTTPS
- Global CDN distribution

---

## 🎨 UX Enhancements

1. **Loading States** - Skeleton screens during query execution
2. **Empty States** - Helpful prompts when no results
3. **Error Handling** - Graceful error messages (simulated)
4. **Responsive Design** - Mobile-friendly layout (stacked panels)
5. **Accessibility** - Keyboard navigation, ARIA labels, focus management
6. **Smooth Animations** - Subtle transitions (Tailwind + CSS)

---

## 📝 Future Improvements

- [ ] Query syntax validation (SQL parser)
- [ ] JOIN support across multiple CSVs
- [ ] Advanced filters (date range, regex)
- [ ] Column pinning/hiding
- [ ] Chart visualizations (Chart.js integration)
- [ ] Query templates (parameterized queries)
- [ ] Result comparison (diff between query runs)
- [ ] Collaborative features (share query URLs)

---


## 📄 License

MIT License - Free to use, modify, and distribute.

---

## 📧 Contact

**Developer**: [Your Name]  
**GitHub**: [@singhkunal2050](https://github.com/singhkunal2050)  

---

**⭐ If you found this useful, please star the repo!**
