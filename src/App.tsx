import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import { Editor } from "@/components/Editor/Editor"
import { ResultsTable } from "@/components/Table/ResultsTable"
import { QuerySelector } from "@/components/QuerySelector/QuerySelector"

function App() {
  const handleRunQuery = () => {
    console.log("Run query")
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b px-4 py-3 flex items-center gap-4">
        <h1 className="text-lg font-semibold">SQL Query Builder</h1>
        <div className="flex-1">
          <QuerySelector />
        </div>
        <Button onClick={handleRunQuery} size="sm">
          <Play className="h-4 w-4 mr-2" />
          Run Query
        </Button>
      </header>

      {/* Main Content - Resizable Panels */}
      <ResizablePanelGroup direction="vertical" className="flex-1">
        <ResizablePanel defaultSize={60} minSize={30}>
          <div className="h-full">
            <Editor />
          </div>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={40} minSize={20}>
          <div className="h-full">
            <ResultsTable />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

export default App
