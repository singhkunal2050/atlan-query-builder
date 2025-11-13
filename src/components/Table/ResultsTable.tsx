export function ResultsTable() {
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
