import { useEffect } from 'react'

interface ShortcutHandlers {
  onRunQuery?: () => void
  onExport?: () => void
  onClearResults?: () => void
  onShowHelp?: () => void
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
      const modKey = isMac ? e.metaKey : e.ctrlKey

      // Cmd/Ctrl + Enter - Run Query
      if (modKey && e.key === 'Enter') {
        e.preventDefault()
        handlers.onRunQuery?.()
        return
      }

      // Cmd/Ctrl + E - Export
      if (modKey && e.key === 'e') {
        e.preventDefault()
        handlers.onExport?.()
        return
      }

      // Cmd/Ctrl + Shift + C - Clear Results
      if (modKey && e.shiftKey && e.key === 'C') {
        e.preventDefault()
        handlers.onClearResults?.()
        return
      }

      // Cmd/Ctrl + / - Show Help
      if (modKey && e.key === '/') {
        e.preventDefault()
        handlers.onShowHelp?.()
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handlers])
}

