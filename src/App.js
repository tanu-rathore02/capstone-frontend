import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import {store} from './app/store'
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import Categories from "./pages/Categories";
import Issuances from "./pages/Issuances";
import Contact from "./pages/Contact";
import Books from "./pages/Books";
import Users from "./pages/Users";
import AddUsers from "./pages/AddUsers";
import AddCategory from "./pages/AddCategory";
import AddBooks from "./pages/AddBooks";
import AddIssuances from "./pages/AddIssuances";
import ProtectedRoutes from "./route/ProtectedRoutes";

function App() {
  return (
    <Provider store={store}>
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login/>} />

          <Route element= {<ProtectedRoutes/>}>
          <Route path="/adminDashboard" element={<AdminDashboard />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/issuances" element={<Issuances />} />
          <Route path="/books" element={<Books />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/users" element={<Users/>}/>
          <Route path="/addUser" element={<AddUsers />} />
          <Route path="/addCategory" element={<AddCategory />} />
          <Route path="/addBooks" element={<AddBooks />} />
          <Route path="/addIssuance" element={<AddIssuances />} />
        </Route>
        
        </Routes>
      </div>
    </Router>
    </Provider>
  );
}

export default App;