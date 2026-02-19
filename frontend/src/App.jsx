// import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
// import Layout from './components/Layout';
// import Home from './pages/Home';


// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Layout />}>
//         <Route index element={<Home />} />
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   );
// }



import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import About from './pages/About';
import Contact from './pages/Contact';

import { useAuth } from './context/AuthContext';

function AdminLayout() {
  return <Outlet />;
}

function VendorRoute({ children }) {
  const { isVendor, isAdmin } = useAuth();
  if (isAdmin) return <Navigate to="/admin" replace />;
  if (!isVendor) return <Navigate to="/login" replace />;
  return children;
}

function AdminRoute({ children }) {
  const { isAdmin } = useAuth();
  if (!isAdmin) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="profile" element={<VendorRoute><Profile /></VendorRoute>} />
          
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
