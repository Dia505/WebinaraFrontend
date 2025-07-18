import { Navigate } from "react-router-dom";
import { useAuth } from "../context/auth_context";

const AuthRoute = ({ element, requiredRole }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/login" replace />;
  }

  return element;
};

export default AuthRoute;
