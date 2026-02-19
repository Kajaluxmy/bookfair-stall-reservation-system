import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import UpcomingEvents from './pages/UpcomingEvents';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import About from './pages/About';
import Contact from './pages/Contact';
import EventDetail from './pages/EventDetail';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminEvents from './pages/admin/AdminEvents';
import AdminEventNew from './pages/admin/AdminEventNew';
import AdminEventDetail from './pages/admin/AdminEventDetail';
import AdminProfile from './pages/admin/AdminProfile';
import AdminSiteSettings from './pages/admin/AdminSiteSettings';
import AdminUserDetail from './pages/admin/AdminUserDetail';
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
          <Route path="events" element={<UpcomingEvents />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="events/:id" element={<EventDetail />} />
          <Route path="profile" element={<VendorRoute><Profile /></VendorRoute>} />
        

          <Route path="admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="events" element={<AdminEvents />} />
              <Route path="events/new" element={<AdminEventNew />} />
              <Route path="events/:id" element={<AdminEventDetail />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="profile" element={<AdminProfile />} />
              <Route path="site-settings" element={<AdminSiteSettings />} />
              <Route path="users/:id" element={<AdminUserDetail />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
