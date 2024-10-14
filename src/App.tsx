import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import Login from "./pages/Login"
import GovDashboard from "./pages/GovernmentDashboard"
import ContractorDashboard from "./pages/ContractorDashboard"
import ProjectDetail from "./pages/ProjectDetails"
import ProjectDetailGov from "./pages/ProjectDetailGov"
import { Header } from "./components/common/Header"
import { Sidebar } from "./components/common/sideBar"

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/gov-dashboard" element={<GovDashboard />} />
              <Route
                path="/contractor-dashboard"
                element={<ContractorDashboard />}
              />
              <Route path="/project/:id" element={<ProjectDetail />} />
              <Route path="/gov-project/:id" element={<ProjectDetailGov />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  )
}

export default App