import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminConsole from './pages/AdminConsole';
import ReportPage from './pages/ReportPage';
import './App.css'
// import Location from './components/location';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ReportPage />} />
        <Route path="/admin" element={<AdminConsole />} />
        {/* Add other routes here */}
      </Routes>
    </Router>
);
};

export default App;