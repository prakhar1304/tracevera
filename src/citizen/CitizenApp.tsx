import { useState } from 'react'

import { Header } from './components/Header'
import { MainDashboard } from './components/MainDashboard'
import { ThemeProvider } from './components/ThemeProvider'
import { Sidebar } from './components/SlideBar'

function CitizenApp() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="flex h-screen overflow-hidden">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
            <div className="container mx-auto px-6 py-8">
              <MainDashboard />
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default CitizenApp