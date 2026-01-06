import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";

const ProtectedRoute = ({ roles = [], requireAuth = true, children }) => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);
  const location = useLocation();

  // 1️⃣ Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  // 2️⃣ Auth required but not logged in
  if (requireAuth && !isAuthenticated) {
    const from = location.pathname + location.search;
    localStorage.setItem("redirectAfterLogin", from);

    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 3️⃣ Role-based authorization
  if (roles.length > 0) {
    const userRole = user?.role?.toLowerCase() || "";
    const hasRequiredRole = roles.some(
      (role) => role.toLowerCase() === userRole
    );

    if (!hasRequiredRole) {
      // Redirect based on role
      if (userRole === "admin") {
        return <Navigate to="/admin/dashboard" replace />;
      }
      return <Navigate to="/" replace />;
    }
  }

  // 4️⃣ Render route
  if (children) {
    return children;
  }

  return <Outlet />;
};

export default ProtectedRoute;
