import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";

import ContractorDashboard from "./pages/ContractorDashboard";
import ProjectDetail from "./pages/ProjectDetails";
import ProjectDetailGov from "./pages/ProjectDetailGov";
import CitizenApp from "./citizen/CitizenApp";

import ProjectsScreen from "./citizen/ProjectScreen";
import DetailedProjectScreen from "./citizen/DetailedProjectScreen";

import GovDashboard from "./pages/GovernmentDashboard";
import AddProject from "./pages/AddProject";
import { ContractProvider, useContract } from "./BlockChain/ContractProvider";

function App() {
  return (
    <ContractProvider>
      <Router>
        <main className="flex-1 ">
          <Routes>
            <Route path="/" element={<Login />} />

            <Route path="/gov-dashboard" element={<GovDashboard />} />
            <Route path="/add-project" element={<AddProject />} />
            <Route
              path="/contractor-dashboard"
              element={<ContractorDashboard />}
            />
            <Route path="/project/:id" element={<ProjectDetail />} />
            <Route path="/gov-project/:id" element={<ProjectDetailGov />} />
            <Route path="/citizenHome" element={<CitizenApp />} />
            <Route path="/CitizenProject" element={<ProjectsScreen />} />
            <Route
              path="/Citizen-projects/:id"
              element={<DetailedProjectScreen />}
            />
          </Routes>
        </main>
      </Router>
    </ContractProvider>
  );
}

export default App;
