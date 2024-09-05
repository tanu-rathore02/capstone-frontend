import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import Categories from "./pages/Categories";
import Issuances from "./pages/Issuances";
import UserDashboard from "./pages/UserDashboard";
import Books from "./pages/Books";
import Users from "./pages/Users";
import ProtectedRoutes from "./route/ProtectedRoutes";
import IssuanceHistoryByUser from "./components/IssuanceHistoryByUser";
import IssuanceHistoryByBook from "./components/IssuanceHistoryByBook";

// function App() {
//   return (
//     <Provider store={store}>
//       <Router>
//         <div>
//           <Routes>
//             <Route path="/" element={<Login />} />

//             <Route element={<ProtectedRoutes />}>
//               <Route path="/adminDashboard" element={<AdminDashboard />} />
//               <Route path="/categories" element={<Categories />} />
//               <Route path="/issuances" element={<Issuances />} />
//               <Route path="/books" element={<Books />} />

//               <Route path="/users" element={<Users />} />
//               <Route
//                 path="/user/:userId/issuanceHistory"
//                 element={<IssuanceHistoryByUser />}
//               />
//               <Route
//                 path="/book/:bookId/issuanceHistory"
//                 element={<IssuanceHistoryByBook />}
//               />
//             </Route>
//           </Routes>
//         </div>
//       </Router>
//     </Provider>
//   );
// }

// export default App;

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Login />} />
            
            {/* Admin Routes */}
            <Route element={<ProtectedRoutes allowedRoles={['ADMIN']} />}>
              <Route path="/adminDashboard" element={<AdminDashboard />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/issuances" element={<Issuances />} />
              <Route path="/books" element={<Books />} />
              <Route path="/users" element={<Users />} />
              <Route path="/user/:userId/issuanceHistory" element={<IssuanceHistoryByUser />} />
              <Route path="/book/:bookId/issuanceHistory" element={<IssuanceHistoryByBook />} />
            </Route>

            {/* User Routes */}
            <Route element={<ProtectedRoutes allowedRoles={['USER']} />}>
              <Route path="/userDashboard" element={<UserDashboard />} />
            </Route>

            {/* Fallback route for unauthorized access */}
            <Route path="/not-authorized" element={<h1>Not Authorized</h1>} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;

