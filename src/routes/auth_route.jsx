import { Navigate } from "react-router-dom";
import { useAuth } from "../context/auth_context";
import {jwtDecode} from "jwt-decode";

const AuthRoute = ({ element, requiredRole }) => {
  const { authToken } = useAuth();

  if (!authToken) {
    return <Navigate to="/login" replace />;
  }

  // Decode role from the token
  let decoded;
  try {
    decoded = jwtDecode(authToken);
  } catch (err) {
    return <Navigate to="/login" replace />;
  }

  const userRole = decoded.role;

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/login" replace />;
  }

  return element;
};

export default AuthRoute;
