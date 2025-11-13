import MonacoEditor, { type OnMount } from "@monaco-editor/react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { setCurrentSql } from "@/store/slices/querySlice"
import { EDITOR_CONFIG } from "@/lib/constants"

interface EditorProps {
  onRunQuery?: () => void
  onExportCSV?: () => void
  onExportJSON?: () => void
  onClearResults?: () => void
  onShowHelp?: () => void
  theme: "light" | "dark"
}

export function Editor({ onRunQuery, onExportCSV, onExportJSON, onClearResults, onShowHelp, theme }: EditorProps) {
  const dispatch = useAppDispatch()
  const currentSql = useAppSelector(state => state.query.currentSql)

  const handleEditorChange = (value: string | undefined) => {
    dispatch(setCurrentSql(value || ''))
  }

  const handleEditorMount: OnMount = (editor, monaco) => {
    // Add keyboard shortcuts to editor
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRunQuery?.()
    })

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyE, () => {
      onExportCSV?.()
    })

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyJ, () => {
      onExportJSON?.()
    })

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyC, () => {
      onClearResults?.()
    })

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Slash, () => {
      onShowHelp?.()
    })
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
          onMount={handleEditorMount}
          options={{
            minimap: { enabled: false },
            fontSize: EDITOR_CONFIG.FONT_SIZE,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 16, bottom: 16 },
            lineHeight: EDITOR_CONFIG.LINE_HEIGHT,
            fontFamily: EDITOR_CONFIG.FONT_FAMILY,
            scrollbar: {
              verticalScrollbarSize: EDITOR_CONFIG.SCROLLBAR_SIZE,
              horizontalScrollbarSize: EDITOR_CONFIG.SCROLLBAR_SIZE,
            },
          }}
        />
      </div>
    </div>
  )
}
