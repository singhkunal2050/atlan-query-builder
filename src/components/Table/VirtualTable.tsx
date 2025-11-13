import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef, useMemo } from 'react'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { setSortColumn } from '@/store/slices/resultsSlice'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'

export function VirtualTable() {
  const dispatch = useAppDispatch()
  const results = useAppSelector(state => state.results.data)
  const sortColumn = useAppSelector(state => state.results.sortColumn)
  const sortDirection = useAppSelector(state => state.results.sortDirection)
  const searchTerm = useAppSelector(state => state.results.searchTerm)

  const parentRef = useRef<HTMLDivElement>(null)

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    if (!results) return []

    let filtered = results.rows

    // Apply search filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase()
      filtered = filtered.filter(row =>
        results.columns.some(col =>
          String(row[col] ?? '').toLowerCase().includes(lowerSearch)
        )
      )
    }

    // Apply sorting
    if (sortColumn) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortColumn] ?? ''
        const bVal = b[sortColumn] ?? ''

        const aStr = String(aVal).toLowerCase()
        const bStr = String(bVal).toLowerCase()

        if (sortDirection === 'asc') {
          return aStr < bStr ? -1 : aStr > bStr ? 1 : 0
        } else {
          return aStr > bStr ? -1 : aStr < bStr ? 1 : 0
        }
      })
    }

    return filtered
  }, [results, searchTerm, sortColumn, sortDirection])

  const virtualizer = useVirtualizer({
    count: filteredAndSortedData.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 41, // Row height in pixels
    overscan: 10, // Render 10 extra items above/below viewport
  })

  if (!results) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        No results to display. Run a query to see data.
      </div>
    )
  }

  const handleSort = (column: string) => {
    dispatch(setSortColumn(column))
  }

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="h-3.5 w-3.5 ml-1 opacity-0 group-hover:opacity-50" />
    }
    return sortDirection === 'asc'
      ? <ArrowUp className="h-3.5 w-3.5 ml-1" />
      : <ArrowDown className="h-3.5 w-3.5 ml-1" />
  }

  // Fixed column width for alignment
  const columnWidth = 200

  return (
    <div className="flex flex-col h-full">
      {/* Info bar */}
      <div className="px-4 py-2 border-b text-sm text-muted-foreground bg-muted/30">
        Showing {filteredAndSortedData.length.toLocaleString()} of {results.rowCount.toLocaleString()} rows
        {searchTerm && ` (filtered)`}
      </div>

      {/* Virtual scrolling table */}
      <div
        ref={parentRef}
        className="flex-1 overflow-auto custom-scrollbar"
        style={{ width: '100%' }}
      >
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: `${columnWidth * results.columns.length}px`,
            minWidth: 'max-content',
            position: 'relative',
          }}
        >
          {/* Table header - sticky */}
          <div className="sticky top-0 z-10 bg-background border-b" style={{ width: `${columnWidth * results.columns.length}px` }}>
            <div className="flex">
              {results.columns.map((column) => (
                <div
                  key={column}
                  onClick={() => handleSort(column)}
                  className="group flex items-center px-4 h-10 font-medium text-sm border-r last:border-r-0 cursor-pointer hover:bg-accent/50 transition-colors select-none flex-shrink-0"
                  style={{ width: `${columnWidth}px` }}
                >
                  <span className="truncate">{column}</span>
                  {getSortIcon(column)}
                </div>
              ))}
            </div>
          </div>

          {/* Virtual rows */}
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const row = filteredAndSortedData[virtualRow.index]
            return (
              <div
                key={virtualRow.index}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                  width: `${columnWidth * results.columns.length}px`,
                }}
              >
                <div className="flex border-b hover:bg-muted/30 transition-colors">
                  {results.columns.map((column) => (
                    <div
                      key={column}
                      className="px-4 py-2 text-sm border-r last:border-r-0 truncate flex-shrink-0"
                      style={{ width: `${columnWidth}px` }}
                      title={String(row[column] ?? '')}
                    >
                      {String(row[column] ?? '')}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

