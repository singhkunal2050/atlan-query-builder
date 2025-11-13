import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { selectPredefinedQuery } from "@/store/slices/querySlice"
import { useCallback, useMemo } from "react"

export function QuerySelector() {
  const dispatch = useAppDispatch()
  const predefinedQueries = useAppSelector(state => state.query.predefinedQueries)
  const selectedQueryId = useAppSelector(state => state.query.selectedQueryId)
  
  const selectedQuery = useMemo(() => 
    predefinedQueries.find(q => q.id === selectedQueryId),
    [predefinedQueries, selectedQueryId]
  )

  const handleSelect = useCallback((queryId: string) => {
    dispatch(selectPredefinedQuery(queryId))
  }, [dispatch])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 min-w-[200px] justify-between">
          <span className="text-sm">{selectedQuery?.name || 'Select Query'}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[250px]">
        <DropdownMenuLabel>Predefined Queries</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {predefinedQueries.map((query) => (
          <DropdownMenuItem
            key={query.id}
            onClick={() => handleSelect(query.id)}
            className="cursor-pointer flex flex-col items-start"
          >
            <span className="font-medium">{query.name}</span>
            {query.description && (
              <span className="text-xs text-muted-foreground">{query.description}</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
