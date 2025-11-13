import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { HelpCircle } from "lucide-react"
import { forwardRef, useImperativeHandle, useState } from "react"
import { KEYBOARD_SHORTCUTS } from "@/lib/constants"

interface Shortcut {
  action: string
  keys: string[]
}

const shortcuts: Shortcut[] = [
  { action: "Run Query", keys: KEYBOARD_SHORTCUTS.RUN_QUERY.mac.split('+') },
  { action: "Export Results", keys: KEYBOARD_SHORTCUTS.EXPORT.mac.split('+') },
  { action: "Clear Results", keys: KEYBOARD_SHORTCUTS.CLEAR_RESULTS.mac.split('+') },
  { action: "Show Help", keys: KEYBOARD_SHORTCUTS.SHOW_HELP.mac.split('+') },
]

const KeyBadge = ({ keyLabel }: { keyLabel: string }) => (
  <kbd className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 text-xs font-medium text-muted-foreground bg-muted border border-border rounded shadow-sm">
    {keyLabel}
  </kbd>
)

export interface ShortcutsDialogRef {
  toggle: () => void
}

export const ShortcutsDialog = forwardRef<ShortcutsDialogRef>((_, ref) => {
  const [open, setOpen] = useState(false)

  useImperativeHandle(ref, () => ({
    toggle: () => setOpen(prev => !prev)
  }))

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <HelpCircle className="h-4 w-4" />
          <span>
            Help <span className="text-xs">({KEYBOARD_SHORTCUTS.SHOW_HELP.mac})</span>
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Speed up your workflow with these keyboard shortcuts
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-1 py-4">
          {shortcuts.map((shortcut, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-2.5 px-3 rounded-md hover:bg-muted/50 transition-colors"
            >
              <span className="text-sm">{shortcut.action}</span>
              <div className="flex items-center gap-1">
                {shortcut.keys.map((key, keyIdx) => (
                  <KeyBadge key={keyIdx} keyLabel={key} />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="text-xs text-muted-foreground text-center pt-2 border-t">
          Press <KeyBadge keyLabel="⌘" /> <KeyBadge keyLabel="/" /> to toggle this dialog
        </div>
      </DialogContent>
    </Dialog>
  )
})

