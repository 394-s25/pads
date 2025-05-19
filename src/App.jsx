import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminConsole from "./pages/AdminConsole";
import ReportPage from "./pages/ReportPage";
import Landing from "./pages/Landing";
import ViewReport from "./pages/viewReport";
import DraftsPage from "./pages/DraftsPage";
import ReportStatusPage from "./pages/ReportStatusPage";
import "./App.css";
import { AuthProvider } from "./apis/authProvider";
// import Location from './components/location';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/create" element={<ReportPage />} /> 
          <Route path="/drafts" element={<DraftsPage />} />  
          <Route path="/status" element={<ReportStatusPage />} /> 
          <Route path="/admin/report/:reportId" element={<ViewReport />} />
          <Route path="/admin/:tab" element={<AdminConsole />} />
          <Route path="/landing" element={<Landing />} /> 
          <Route path="/create" element={<Navigate to="/create/report" />} />
          <Route path="/create/:section" element={<ReportPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
