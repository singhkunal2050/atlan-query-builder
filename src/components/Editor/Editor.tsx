import MonacoEditor from "@monaco-editor/react"
import { useTheme } from "@/hooks/useTheme"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { setCurrentSql } from "@/store/slices/querySlice"

export function Editor() {
  const { theme } = useTheme()
  const dispatch = useAppDispatch()
  const currentSql = useAppSelector(state => state.query.currentSql)

  const handleEditorChange = (value: string | undefined) => {
    dispatch(setCurrentSql(value || ''))
  }

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="border-b px-4 py-2 flex items-center justify-between bg-muted/30">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">SQL Editor</span>
        <span className="text-xs text-muted-foreground">⌘+Enter to run</span>
      </div>
      <div className="flex-1">
        <MonacoEditor
          height="100%"
          language="sql"
          theme={theme === "dark" ? "vs-dark" : "vs-light"}
          value={currentSql}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 16, bottom: 16 },
            lineHeight: 20,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
            scrollbar: {
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            },
          }}
        />
      </div>
    </div>
  )
}
