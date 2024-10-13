import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import GovDashboard from './pages/GovernmentDashboard';
import ContractorDashboard from './pages/ContractorDashboard';
import ProjectDetail from './pages/ProjectDetails';
import ProjectDetailGov from './pages/ProjectDetailGov';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/gov-dashboard" element={<GovDashboard />} />
          <Route path="/contractor-dashboard" element={<ContractorDashboard />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/gov-project/:id" element={<ProjectDetailGov />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;