import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from './auth/Context/AuthContext'; // Добавьте этот импорт
import Home from "./pages/Home";
import Profile from "./pages/Profile/Profile"; // Добавьте /Profile // Добавьте импорт Profile
import Footer from "./pages/Home/components/Footer"; // Исправьте путь к футеру
import './styles/globals.scss';
import ProRabControl from './pages/CONTRACTOR/contractorControl/ContractorControl';
import ProRabComments from './pages/CONTRACTOR/conractorComments/contractorComments';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            {/* Добавьте другие маршруты позже */}
            <Route path="/control" element={<ProRabControl />} />
             <Route path="/remarks" element={<ProRabComments />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;