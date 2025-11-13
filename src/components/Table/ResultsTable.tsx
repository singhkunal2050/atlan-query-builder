import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { setSortColumn, setSearchTerm, setCurrentPage, setPageSize } from "@/store/slices/resultsSlice"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowUpDown, ArrowUp, ArrowDown, Search, Loader2 } from "lucide-react"
import { useMemo, useCallback } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PAGINATION } from "@/lib/constants"

export function ResultsTable() {
  const dispatch = useAppDispatch()
  const { data, loading, error, sortColumn, sortDirection, searchTerm, currentPage, pageSize } =
    useAppSelector(state => state.results)

  const filteredAndSortedData = useMemo(() => {
    if (!data) return []

    let rows = [...data.rows]

    // Search filter
    if (searchTerm) {
      rows = rows.filter(row =>
        Object.values(row).some(val =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    // Sort
    if (sortColumn) {
      rows.sort((a, b) => {
        const aVal = a[sortColumn]
        const bVal = b[sortColumn]

        if (aVal === bVal) return 0
        if (aVal == null) return 1
        if (bVal == null) return -1

        const comparison = aVal < bVal ? -1 : 1
        return sortDirection === 'asc' ? comparison : -comparison
      })
    }

    return rows
  }, [data, searchTerm, sortColumn, sortDirection])

  const totalRows = filteredAndSortedData.length
  const totalPages = useMemo(() => Math.ceil(totalRows / pageSize), [totalRows, pageSize])
  const startIndex = (currentPage - 1) * pageSize
  const paginatedData = useMemo(() => 
    filteredAndSortedData.slice(startIndex, startIndex + pageSize),
    [filteredAndSortedData, startIndex, pageSize]
  )

  const handleSort = useCallback((column: string) => {
    dispatch(setSortColumn(column))
  }, [dispatch])

  const handleSearch = useCallback((value: string) => {
    dispatch(setSearchTerm(value))
  }, [dispatch])

  const handlePageChange = useCallback((page: number) => {
    dispatch(setCurrentPage(page))
  }, [dispatch])

  const handlePageSizeChange = useCallback((size: string) => {
    dispatch(setPageSize(Number(size)))
  }, [dispatch])

  if (loading) {
    return (
      <div className="h-full flex flex-col bg-background">
        <div className="border-b px-4 py-2 flex items-center justify-between bg-muted/30">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Query Results</span>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Executing query...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full flex flex-col bg-background">
        <div className="border-b px-4 py-2 flex items-center justify-between bg-muted/30">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Query Results</span>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-2">
            <p className="text-sm text-destructive font-medium">Error</p>
            <p className="text-xs text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="h-full flex flex-col bg-background">
        <div className="border-b px-4 py-2 flex items-center justify-between bg-muted/30">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Query Results</span>
          <span className="text-xs text-muted-foreground">0 rows</span>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">No results yet</p>
            <p className="text-xs text-muted-foreground">Run a query to see results</p>
          </div>
        </div>
      </div>
    )
  }

  return (
      <div className="h-full flex flex-col bg-background">
        {/* Header */}
        <div className="border-b px-3 sm:px-4 py-2 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:justify-between bg-muted/30">
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Query Results</span>
            <span className="text-xs text-muted-foreground">
              {totalRows} {totalRows === 1 ? 'row' : 'rows'}
              {data.executionTime && <span className="hidden sm:inline"> • {data.executionTime}ms</span>}
            </span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="h-7 pl-7 pr-2 text-xs w-full sm:w-[150px]"
              />
            </div>
          </div>
        </div>

      {/* Table */}
      <div className="flex-1 overflow-auto relative custom-scrollbar">
        <div className="min-w-full inline-block align-middle">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                {data.columns.map((column) => (
                  <TableHead key={column} className="h-9 whitespace-nowrap">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs font-medium -ml-2"
                      onClick={() => handleSort(column)}
                    >
                      {column}
                      {sortColumn === column ? (
                        sortDirection === 'asc' ? (
                          <ArrowUp className="ml-1 h-3 w-3" />
                        ) : (
                          <ArrowDown className="ml-1 h-3 w-3" />
                        )
                      ) : (
                        <ArrowUpDown className="ml-1 h-3 w-3 opacity-50" />
                      )}
                    </Button>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((row, idx) => (
                <TableRow key={idx}>
                  {data.columns.map((column) => (
                    <TableCell key={column} className="text-xs py-2 whitespace-nowrap">
                      {row[column] != null ? String(row[column]) : <span className="text-muted-foreground">NULL</span>}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="border-t px-3 sm:px-4 py-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:justify-between bg-muted/30">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground whitespace-nowrap">Rows per page:</span>
            <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
              <SelectTrigger className="h-7 w-[70px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGINATION.PAGE_SIZE_OPTIONS.map(size => (
                  <SelectItem key={size} value={String(size)}>{size}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-2">
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 sm:px-3 text-xs"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <span className="hidden sm:inline">Previous</span>
                <span className="sm:hidden">Prev</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 sm:px-3 text-xs"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
