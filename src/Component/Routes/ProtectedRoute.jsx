import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";

const ProtectedRoute = ({ roles = [], requireAuth = true, children }) => {
  const { user, isAuthenticated, loading, isRefreshing } = useContext(AuthContext);
  const location = useLocation();

  // 1️⃣ Loading state - Don't move while we are fetching or refreshing
  if (loading || isRefreshing) {
    return (
      // <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900">
      //   <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      //   {isRefreshing && <p className="mt-4 text-gray-400 animate-pulse">Updating session...</p>}
      <LoadingSpinner/>
    
      // </div>
    );
  }

  // 2️⃣ Auth required check
  if (requireAuth && !isAuthenticated) {
    // EXTRA SAFETY: If there is an accessToken in storage, 
    // it's likely a refresh is ABOUT to happen. Wait for it.
    const hasToken = localStorage.getItem("accessToken");
    if (hasToken) {
        return null; // Or a small spinner; prevents instant jump to login
    }

    const from = location.pathname + location.search;
    localStorage.setItem("redirectAfterLogin", from);

    console.log("DEBUG: Redirecting from Interceptor");

    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 3️⃣ Role-based authorization
  if (roles.length > 0) {
    const userRole = user?.role?.toLowerCase() || "";
    const hasRequiredRole = roles.some(
      (role) => role.toLowerCase() === userRole
    );

    if (!hasRequiredRole) {
      if (userRole === "admin") {
        return <Navigate to="/admin/dashboard" replace />;
      }
      return <Navigate to="/" replace />;
    }
  }

  // 4️⃣ Render route
  return children ? children : <Outlet />;
};

export default ProtectedRoute;