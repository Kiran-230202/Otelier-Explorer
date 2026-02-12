import { useAuth } from './context/AuthContext';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom';
import Compare from './pages/Compare';

function App() {
  const { user } = useAuth();

 return (
    <Routes>
      {/* Home / Search Feed */}
      <Route path="/" element={<Dashboard />} />
      
      {/* Comparison Insights Page */}
      <Route path="/compare" element={<Compare />} />

      {/* Redirect all unknown routes back to home */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App
