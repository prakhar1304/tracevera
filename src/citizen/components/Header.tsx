
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Menu, Search } from "lucide-react"
import { ModeToggle } from "./ModeToggle"


interface HeaderProps {
  toggleSidebar: () => void
}

export function Header({ toggleSidebar }: HeaderProps) {
  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="ml-4 text-2xl font-bold">Citizen Budget Insight</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search projects..."
              className="pl-8 w-64"
            />
          </div>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}