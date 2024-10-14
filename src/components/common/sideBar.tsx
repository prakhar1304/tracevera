import { Link, useLocation } from 'react-router-dom'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LayoutDashboard, FileText, Users, Settings } from 'lucide-react'

export function Sidebar() {
  const location = useLocation()

  const links = [
    { href: '/gov-dashboard', label: 'Government Dashboard', icon: LayoutDashboard },
    { href: '/contractor-dashboard', label: 'Contractor Dashboard', icon: LayoutDashboard },
    { href: '/projects', label: 'Projects', icon: FileText },
    { href: '/users', label: 'Users', icon: Users },
    { href: '/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="pb-12 w-64">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Navigation
          </h2>
          <ScrollArea className="h-[300px] px-1">
            <div className="space-y-1">
              {links.map((link) => (
                <Button
                  key={link.href}
                  variant={location.pathname === link.href ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  asChild
                >
                  <Link to={link.href}>
                    <link.icon className="mr-2 h-4 w-4" />
                    {link.label}
                  </Link>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}