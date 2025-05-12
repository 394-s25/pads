import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminConsole from "./pages/AdminConsole";
import ReportPage from "./pages/ReportPage";
import Landing from "./pages/Landing";
import "./App.css";
import { AuthProvider } from "./apis/authProvider";
// import Location from './components/location';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/report" element={<ReportPage />} />
          <Route path="/admin" element={<AdminConsole />} />
          <Route path="/" element={<Landing />} />
          {/* Add other routes here */}
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
