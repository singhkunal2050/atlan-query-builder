import MonacoEditor from "@monaco-editor/react"
import { useTheme } from "@/hooks/useTheme"

export function Editor() {
  const { theme } = useTheme()

  const handleEditorChange = (value: string | undefined) => {
    console.log("Editor value:", value)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="border-b px-4 py-2 text-sm text-muted-foreground">
        SQL Editor
      </div>
      <div className="flex-1">
        <MonacoEditor
          height="100%"
          language="sql"
          theme={theme === "dark" ? "vs-dark" : "vs-light"}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  )
}

