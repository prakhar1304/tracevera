import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import Login from "./pages/Login"
import GovDashboard from "./pages/GovernmentDashboard"
import ContractorDashboard from "./pages/ContractorDashboard"
import ProjectDetail from "./pages/ProjectDetails"
import ProjectDetailGov from "./pages/ProjectDetailGov"
import CitizenApp from "./citizen/CitizenApp"


import ProjectsScreen from "./citizen/ProjectScreen"
import DetailedProjectScreen from "./citizen/DetailedProjectScreen"


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
              <Route path="/citizenHome" element={<CitizenApp />} />
              <Route path="/CitizenProject" element={<ProjectsScreen />} /> 
              <Route path="/Citizen-projects/:id" element={<DetailedProjectScreen />} />
              
            </Routes>
          </main>
       
    </Router>
  )
}

export default App