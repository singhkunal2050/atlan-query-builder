export function ResultsTable() {
  return (
    <div className="h-full flex flex-col">
      <div className="border-b px-4 py-2 text-sm text-muted-foreground flex items-center justify-between">
        <span>Query Results</span>
        <span className="text-xs">0 rows</span>
      </div>
      <div className="flex-1 p-4 flex items-center justify-center text-muted-foreground">
        Run a query to see results
      </div>
    </div>
  )
}

