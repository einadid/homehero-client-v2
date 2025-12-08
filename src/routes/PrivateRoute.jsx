// src/routes/PrivateRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/shared/LoadingSpinner';

const PrivateRoute = ({ children, requiredRole = null }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 🔄 Step 1: লোডিং চলছে - অপেক্ষা করো
  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  // ✅ Step 2: ইউজার আছে
  if (user) {
    // Role check (optional)
    if (requiredRole && user.role !== requiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
    return children;
  }

  // ❌ Step 3: ইউজার নেই - লগইনে পাঠাও
  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;