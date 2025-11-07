import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from './auth/Context/AuthContext';
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Footer from "./pages/Home/components/Footer";
import './styles/globals.scss';
import ProRabControl from './pages/CONTRACTOR/contractorControl/ContractorControl';
import ProRabComments from './pages/CONTRACTOR/conractorComments/contractorComments';
import ContractorSchedule from "./pages/CONTRACTOR/ContractorSchedule/ContractorSchedule";
import ContractorReports from "./pages/CONTRACTOR/contractorReports/contractorReports";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile/*" element={<Profile />} /> 
            <Route path="/control" element={<ProRabControl />} />
            <Route path="/remarks" element={<ProRabComments />} />
            <Route path="/schedule" element={<ContractorSchedule />} />
            
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;