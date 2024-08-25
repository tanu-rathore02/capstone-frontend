import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import AdminDashboard from "./pages/AdminDashboard";
import Categories from "./pages/Categories";
import Issuances from "./pages/Issuances";
import Contact from "./pages/Contact";
import Books from "./pages/Books";
import AddUsers from "./pages/AddUsers";
import AddCategory from "./pages/AddCategory";
import AddBooks from "./pages/AddBooks";
import AddIssuances from "./pages/AddIssuances";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/adminDashboard" element={<AdminDashboard />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/issuances" element={<Issuances />} />
          <Route path="/books" element={<Books />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/addUser" element={<AddUsers />} />
          <Route path="/addCategory" element={<AddCategory />} />
          <Route path="/addBook" element={<AddBooks />} />
          <Route path="/addIssuance" element={<AddIssuances />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
