import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { useState } from "react"

export function QuerySelector() {
  const [open, setOpen] = useState(false)

  return (
    <div className="w-full max-w-sm">
      <Command className="rounded-lg border">
        <CommandInput placeholder="Select a query..." />
        <CommandList>
          <CommandEmpty>No queries found.</CommandEmpty>
          <CommandGroup heading="Predefined Queries">
            <CommandItem>All Customers</CommandItem>
            <CommandItem>Recent Orders</CommandItem>
            <CommandItem>Product Inventory</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  )
}

