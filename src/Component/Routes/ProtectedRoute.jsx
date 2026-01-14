import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";

const ProtectedRoute = ({ roles = [], children }) => {
  const { user, isAuthenticated, loading, isRefreshing } = useContext(AuthContext);
  const location = useLocation();

  // 1️⃣ Strict Loading Check
  // If we are booting up or refreshing the token, show the spinner
  if (loading || isRefreshing) {
    return <LoadingSpinner />;
  }

  // 2️⃣ Strict Authentication Check
  if (!isAuthenticated && !user) {
    // Save where the user was trying to go
    return <Navigate to="/login" replace state={{ from: location }} />;
  }


  // 3️⃣ Granular Authorization (RBAC)
  if (roles.length > 0) {
    const userRole = user?.role?.toLowerCase();
    const hasRequiredRole = roles.some(role => role.toLowerCase() === userRole);

    if (!hasRequiredRole) {
      // Security: Don't just redirect, clear any sensitive state if necessary
      console.warn(`Unauthorized access attempt to ${location.pathname} by ${userRole}`);
      
      
      // Redirect based on identity
      return userRole === "admin" 
        ? <Navigate to="/admin/dashboard" replace /> 
        : <Navigate to="/" replace />;
    }
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;