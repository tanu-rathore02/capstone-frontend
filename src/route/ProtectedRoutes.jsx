
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoutes = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");



  if (!token) {
    
    return <Navigate to="/" />;
  }

  if (!allowedRoles.includes(role)) {
    
    return <Navigate to="/not-authorized" />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
