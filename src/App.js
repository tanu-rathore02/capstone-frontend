import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminHome from "./pages/AdminHome";
import AdminDashboard from "./pages/AdminDashboard";
import Categories from "./pages/Categories";
import Users from "./pages/Users";
import Contact from "./pages/Contact";


function App() {
  return (
    <Router>
      <div>
         <Routes>
          <Route path="/" element={<AdminHome />} />
          <Route path="/adminDashboard" element={<AdminDashboard />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/users" element={<Users />} />
          <Route path="/contact" element={<Contact/>}/>
  
        </Routes>
      </div>
    </Router>
  );
}

export default App;
