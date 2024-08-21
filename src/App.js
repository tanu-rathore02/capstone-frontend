import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminHome from "./pages/AdminHome";
import AdminDashboard from "./pages/AdminDashboard";
import Categories from "./pages/Categories";
import Users from "./pages/Users";
import Contact from "./pages/Contact";
import Books from "./pages/Books";
import RegisterUser from "./pages/RegisterUser";
import AddCategory from "./pages/AddCategory";
import AddBooks from "./pages/AddBooks"
import AddIssuances from "./pages/AddIssuances"


function App() {
  return (
    <Router>
      <div>
         <Routes>
          <Route path="/" element={<AdminHome />} />
          <Route path="/adminDashboard" element={<AdminDashboard />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/users" element={<Users />} />
          <Route path="/books" element={<Books/>} />
          <Route path="/contact" element={<Contact/>}/>
          <Route path="/registerUser" element={<RegisterUser/>}/>
          <Route path="/addCategory" element={<AddCategory/>}/>
          <Route path="/addBook" element={<AddBooks/>}/>
          <Route path="/addIssuance" element={<AddIssuances/>}/>
    </Routes>
      </div>
    </Router>
  );
}

export default App;
