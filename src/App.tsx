import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Button } from "@/components/ui/button"
import { Play, Download, FileJson, FileSpreadsheet, Moon, Sun } from "lucide-react"
import { Editor } from "@/components/Editor/Editor"
import { ResultsTable } from "@/components/Table/ResultsTable"
import { QuerySelector } from "@/components/QuerySelector/QuerySelector"
import { QueryHistory } from "@/components/QueryHistory/QueryHistory"
import { ShortcutsDialog, type ShortcutsDialogRef } from "@/components/ShortcutsDialog/ShortcutsDialog"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts"
import { useTheme } from "@/hooks/useTheme"
import { executeQuery } from "@/lib/queryEngine"
import { clearResults } from "@/store/slices/resultsSlice"
import { useRef, useCallback } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function App() {
  const dispatch = useAppDispatch()
  const currentSql = useAppSelector(state => state.query.currentSql)
  const results = useAppSelector(state => state.results.data)
  const loading = useAppSelector(state => state.results.loading)
  const shortcutsRef = useRef<ShortcutsDialogRef>(null)
  const { theme, toggleTheme } = useTheme()

  const handleRunQuery = useCallback(async () => {
    await executeQuery(currentSql, dispatch)
  }, [currentSql, dispatch])

  const handleExportCSV = useCallback(() => {
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
  }, [results])

  const handleExportJSON = useCallback(() => {
    if (!results) return

    const json = JSON.stringify(results.rows, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `query-results-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [results])

  const handleClearResults = useCallback(() => {
    dispatch(clearResults())
  }, [dispatch])

  useKeyboardShortcuts({
    onRunQuery: handleRunQuery,
    onExportCSV: handleExportCSV,
    onExportJSON: handleExportJSON,
    onClearResults: handleClearResults,
    onShowHelp: () => shortcutsRef.current?.toggle(),
  })

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-4 gap-4">
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2"
                  disabled={!results}
                >
                  <Download className="h-3.5 w-3.5" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleExportCSV} className="cursor-pointer">
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportJSON} className="cursor-pointer">
                  <FileJson className="h-4 w-4 mr-2" />
                  Export as JSON
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <QueryHistory />
            <Button variant="ghost" size="sm" onClick={toggleTheme}>
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
            <ShortcutsDialog ref={shortcutsRef} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <ResizablePanelGroup direction="vertical" className="flex-1">
        <ResizablePanel defaultSize={30} minSize={30}>
          <Editor 
            onRunQuery={handleRunQuery}
            onExportCSV={handleExportCSV}
            onExportJSON={handleExportJSON}
            onClearResults={handleClearResults}
            onShowHelp={() => shortcutsRef.current?.toggle()}
            theme={theme}
          />
        </ResizablePanel>

        <ResizableHandle withHandle className="bg-border hover:bg-accent transition-colors" />

        <ResizablePanel defaultSize={70} minSize={20}>
          <ResultsTable />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

export default App
