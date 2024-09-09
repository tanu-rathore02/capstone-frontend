import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Login from "./pages/Login";import AdminDashboard from "./pages/AdminDashboard";
import Categories from "./pages/categories/Categories";
import Issuances from "./pages/Issuances";
import UserDashboard from "./pages/UserDashboard";
import Books from "./pages/Books";
import Users from "./pages/Users";
import ProtectedRoutes from "./route/ProtectedRoutes";
import IssuanceHistoryByUser from "./components/IssuanceHistoryByUser";
import IssuanceHistoryByBook from "./components/IssuanceHistoryByBook";

function App() {
  const isLoggedIn = !!localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return (
    <Router>
      <div>
        <Routes>
          
          <Route 
            path="/" 
            element={isLoggedIn ? <Navigate to={role === "ADMIN" ? "/adminDashboard" : "/userDashboard"} /> : <Login />} 
          />
          <Route element={<ProtectedRoutes allowedRoles={['ADMIN']} />}>
            <Route path="/adminDashboard" element={<AdminDashboard />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/issuances" element={<Issuances />} />
            <Route path="/books" element={<Books />} />
            <Route path="/users" element={<Users />} />
            <Route path="/user/:userId/issuanceHistory" element={<IssuanceHistoryByUser />} />
            <Route path="/book/:bookId/issuanceHistory" element={<IssuanceHistoryByBook />} />
          </Route>
          
          <Route element={<ProtectedRoutes allowedRoles={['USER']} />}>
            <Route path="/userDashboard" element={<UserDashboard />} />
          </Route>

          <Route path="/not-authorized" element={<h1>Not Authorized</h1>} />

      
          <Route
            path="*"
            element={
              isLoggedIn ? (
                <Navigate to={role === "ADMIN" ? "/adminDashboard" : "/userDashboard"} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

