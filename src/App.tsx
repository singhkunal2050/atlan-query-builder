import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Button } from "@/components/ui/button"
import { Play, Download } from "lucide-react"
import { Editor } from "@/components/Editor/Editor"
import { ResultsTable } from "@/components/Table/ResultsTable"
import { QuerySelector } from "@/components/QuerySelector/QuerySelector"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { executeQuery } from "@/lib/queryEngine"

function App() {
  const dispatch = useAppDispatch()
  const currentSql = useAppSelector(state => state.query.currentSql)
  const results = useAppSelector(state => state.results.data)
  const loading = useAppSelector(state => state.results.loading)

  const handleRunQuery = async () => {
    await executeQuery(currentSql, dispatch)
  }

  const handleExport = () => {
    if (!results) return

    const csv = [
      results.columns.join(','),
      ...results.rows.map(row =>
        results.columns.map(col => JSON.stringify(row[col] ?? '')).join(',')
      )
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `query-results-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center px-4 gap-4">
          <h1 className="text-sm font-semibold">SQL Query Builder</h1>
          <div className="flex-1 flex items-center gap-3">
            <QuerySelector />
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleRunQuery}
              size="sm"
              className="gap-2"
              disabled={loading || !currentSql.trim()}
            >
              <Play className="h-3.5 w-3.5" />
              {loading ? 'Running...' : 'Run Query'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleExport}
              disabled={!results}
            >
              <Download className="h-3.5 w-3.5" />
              Export
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <ResizablePanelGroup direction="vertical" className="flex-1">
        <ResizablePanel defaultSize={60} minSize={30}>
          <Editor />
        </ResizablePanel>

        <ResizableHandle withHandle className="bg-border hover:bg-accent transition-colors" />

        <ResizablePanel defaultSize={40} minSize={20}>
          <ResultsTable />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

export default App
