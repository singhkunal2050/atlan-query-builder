import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Button } from "@/components/ui/button"
import { Play, Download, FileJson, FileSpreadsheet, Moon, Sun } from "lucide-react"
import { ResultsTable } from "@/components/Table/ResultsTable"
import { QuerySelector } from "@/components/QuerySelector/QuerySelector"
import { QueryHistory } from "@/components/QueryHistory/QueryHistory"
import { ShortcutsDialog, type ShortcutsDialogRef } from "@/components/ShortcutsDialog/ShortcutsDialog"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts"
import { useTheme } from "@/hooks/useTheme"
import { executeQuery } from "@/lib/queryEngine"
import { clearResults } from "@/store/slices/resultsSlice"
import { useRef, useCallback, lazy, Suspense } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Editor = lazy(() => import("@/components/Editor/Editor").then(m => ({ default: m.Editor })))

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
        <div className="flex flex-col sm:flex-row sm:h-14 items-stretch sm:items-center px-3 sm:px-4 gap-2 sm:gap-4 py-2 sm:py-0">
          <h1 className="text-sm font-semibold hidden sm:block">SQL Query Builder</h1>
          <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <div className="flex-1 min-w-0">
              <QuerySelector />
            </div>
            <Button 
              onClick={handleRunQuery} 
              size="sm" 
              className="gap-2 w-full sm:w-auto"
              disabled={loading || !currentSql.trim()}
            >
              <Play className="h-3.5 w-3.5" />
              {loading ? 'Running...' : 'Run Query'}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2 flex-1 sm:flex-none"
                  disabled={!results}
                >
                  <Download className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Export</span>
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
      <div className="flex-1 flex flex-col md:hidden">
        <div className="h-[45vh] border-b">
          <Suspense fallback={<div className="h-full bg-background" />}>
            <Editor 
              onRunQuery={handleRunQuery}
              onExportCSV={handleExportCSV}
              onExportJSON={handleExportJSON}
              onClearResults={handleClearResults}
              onShowHelp={() => shortcutsRef.current?.toggle()}
              theme={theme}
            />
          </Suspense>
        </div>
        <div className="flex-1">
          <ResultsTable />
        </div>
      </div>

      <div className="hidden md:flex flex-1">
        <ResizablePanelGroup direction="vertical" className="flex-1">
          <ResizablePanel defaultSize={30} minSize={30}>
            <Suspense fallback={<div className="h-full bg-background" />}>
              <Editor 
                onRunQuery={handleRunQuery}
                onExportCSV={handleExportCSV}
                onExportJSON={handleExportJSON}
                onClearResults={handleClearResults}
                onShowHelp={() => shortcutsRef.current?.toggle()}
                theme={theme}
              />
            </Suspense>
          </ResizablePanel>

          <ResizableHandle withHandle className="bg-border hover:bg-accent transition-colors" />

          <ResizablePanel defaultSize={70} minSize={20}>
            <ResultsTable />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}

export default App
