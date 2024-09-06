


import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoutes = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");


  console.log('Token:', token);
  console.log('Role:', role);
  console.log('Allowed Roles:', allowedRoles);


  if (!token) {
    // If no token is present, redirect to login
    return <Navigate to="/" />;
  }

  if (!allowedRoles.includes(role)) {
    // If the role is not allowed, redirect to a 'Not Authorized' page or the default route
    return <Navigate to="/not-authorized" />;
  }

  // If token and role are valid, allow access
  return <Outlet />;
};

export default ProtectedRoutes;
