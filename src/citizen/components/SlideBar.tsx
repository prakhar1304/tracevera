import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Home, BarChart, FileText, Settings } from "lucide-react"
import { Link } from "react-router-dom"

interface SidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export function Sidebar({ open, setOpen }: SidebarProps) {
  return (
    <div
      className={`${
        open ? "w-64" : "w-0"
      } flex flex-col bg-background border-r transition-all duration-300 ease-in-out overflow-hidden`}
    >
      <ScrollArea className="flex-1">
        <nav className="space-y-2 p-4">
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link to="/budget">
              <BarChart className="mr-2 h-4 w-4" />
              Budget Overview
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link to="/CitizenProject">
              <FileText className="mr-2 h-4 w-4" />
              Projects
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link to="/settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </Button>
        </nav>
      </ScrollArea>
    </div>
  )
}