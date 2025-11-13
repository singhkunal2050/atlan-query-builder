import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { History, Trash2 } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { setCurrentSql, clearHistory } from "@/store/slices/querySlice"
import { useCallback } from "react"

export function QueryHistory() {
  const dispatch = useAppDispatch()
  const queryHistory = useAppSelector(state => state.query.queryHistory)

  const handleSelectQuery = useCallback((sql: string) => {
    dispatch(setCurrentSql(sql))
  }, [dispatch])

  const handleClearHistory = useCallback(() => {
    dispatch(clearHistory())
  }, [dispatch])

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`
    return date.toLocaleDateString()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <History className="h-4 w-4" />
          <span className="text-xs">History ({queryHistory.length})</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[500px] max-h-[400px] overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between px-2 py-1.5">
          <DropdownMenuLabel className="p-0">Query History</DropdownMenuLabel>
          {queryHistory.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 px-2 text-xs text-muted-foreground hover:text-destructive"
              onClick={handleClearHistory}
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        {queryHistory.length === 0 ? (
          <div className="px-2 py-8 text-center text-sm text-muted-foreground">
            No query history yet
          </div>
        ) : (
          queryHistory.map((query) => (
            <DropdownMenuItem
              key={query.id}
              onClick={() => handleSelectQuery(query.sql)}
              className="cursor-pointer flex flex-col items-start gap-1 py-3"
            >
              <code className="text-xs font-mono text-foreground line-clamp-2 w-full">
                {query.sql}
              </code>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{formatDate(query.timestamp)}</span>
                <span>•</span>
                <span>{query.rowCount} rows</span>
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

