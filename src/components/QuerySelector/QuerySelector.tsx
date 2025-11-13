import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

const queries = [
  { id: "all-customers", name: "All Customers" },
  { id: "recent-orders", name: "Recent Orders" },
  { id: "product-inventory", name: "Product Inventory" },
  { id: "employee-list", name: "Employee List" },
  { id: "top-products", name: "Top Products" },
]

export function QuerySelector() {
  const [selected, setSelected] = useState(queries[0])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 min-w-[200px] justify-between">
          <span className="text-sm">{selected.name}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[200px]">
        <DropdownMenuLabel>Predefined Queries</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {queries.map((query) => (
          <DropdownMenuItem
            key={query.id}
            onClick={() => setSelected(query)}
            className="cursor-pointer"
          >
            {query.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
