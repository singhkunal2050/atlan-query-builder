import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Button } from "@/components/ui/button"
import { Play, Download } from "lucide-react"
import { Editor } from "@/components/Editor/Editor"
import { ResultsTable } from "@/components/Table/ResultsTable"
import { QuerySelector } from "@/components/QuerySelector/QuerySelector"

function App() {
  const handleRunQuery = () => {
    console.log("Run query")
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
            <Button onClick={handleRunQuery} size="sm" className="gap-2">
              <Play className="h-3.5 w-3.5" />
              Run Query
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
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
