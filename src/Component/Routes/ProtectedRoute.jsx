import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";

const ProtectedRoute = ({ roles, requireAuth = true }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

let role = user?.role;

if (!role) {
  const storedUser = localStorage.getItem("user");
  role = storedUser ? JSON.parse(storedUser).role : null;
}


  console.log("ProtectedRoute Debug:");
  console.log("Current path:", location.pathname);
  console.log("User from context:", user);
  console.log("Role:", role);
  console.log("Allowed roles prop:", roles);
  console.log("Require Auth:", requireAuth);

  // If user data is still loading, show loading
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
    </div>;
  }

  // If authentication is required but user is not logged in
  if (requireAuth && !user) {
    // Store the intended destination
    const from = location.pathname + location.search;
    localStorage.setItem('redirectAfterLogin', from);
    
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // User is logged in but roles are restricted
  if (roles && !roles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  // User is allowed
  return <Outlet />;
};

export default ProtectedRoute;