import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import Login from "./pages/Login"
import GovDashboard from "./pages/GovernmentDashboard"
import ContractorDashboard from "./pages/ContractorDashboard"
import ProjectDetail from "./pages/ProjectDetails"
import ProjectDetailGov from "./pages/ProjectDetailGov"
import { Header } from "./components/common/Header"
import { Sidebar } from "./components/common/sideBar"
import { CitizenHomeScreen } from "./citizen/CitizenHomeScreen"

function App() {
  return (
    <Router>
  
          <main className="flex-1 ">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/gov-dashboard" element={<GovDashboard />} />
              <Route
                path="/contractor-dashboard"
                element={<ContractorDashboard />}
              />
              <Route path="/project/:id" element={<ProjectDetail />} />
              <Route path="/gov-project/:id" element={<ProjectDetailGov />} />
              <Route path="/citizenHome" element={<CitizenHomeScreen />} />
              
            </Routes>
          </main>
       
    </Router>
  )
}

export default App