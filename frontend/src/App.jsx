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
import { HiddenWorks, Technique, Workers } from './pages/CONTRACTOR/contractorJournal';
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


            <Route path="/journal/hidden" element={<HiddenWorks />} />
            <Route path="/journal/technique" element={<Technique />} />
            <Route path="/journal/workers" element={<Workers />} />
            
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;