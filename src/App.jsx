import { useAuth } from './context/AuthContext';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Compare from './pages/Compare';
import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom';

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/auth"
        element={!user ? <Auth /> : <Navigate to="/" replace />}
      />

      <Route
        path="/"
        element={user ? <Dashboard /> : <Navigate to="/auth" replace />}
      />

      <Route
        path="/compare"
        element={user ? <Compare /> : <Navigate to="/auth" replace />}
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;