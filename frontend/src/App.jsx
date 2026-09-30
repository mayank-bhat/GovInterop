import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import CitizenDashboard from './pages/CitizenDashboard';
import OfficialDashboard from './pages/OfficialDashboard';
import ApplyService from './pages/ApplyService';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/citizen/dashboard" element={<CitizenDashboard />} />
            <Route path="/citizen/apply" element={<ApplyService />} />
            <Route path="/official/dashboard" element={<OfficialDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
