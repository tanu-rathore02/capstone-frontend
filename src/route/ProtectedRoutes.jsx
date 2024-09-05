// import { Navigate, Outlet } from 'react-router-dom';

// const ProtectedRoutes = () => {
//   const token = localStorage.getItem("token");
//   return token ? <Outlet /> : <Navigate to="/" />;
// };

// export default ProtectedRoutes;


import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoutes = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

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
