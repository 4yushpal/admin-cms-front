import { Routes, Route } from 'react-router-dom';
import PublicWebsite from './pages/PublicWebsite';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import DashboardHome from './pages/admin/DashboardHome';
import ManageAdmins from './pages/admin/ManageAdmins';
import ManageServices from './pages/admin/ManageServices';
import ManageMessages from './pages/admin/ManageMessages';
import ManageGallery from './pages/admin/ManageGallery';
import ManagePages from './pages/admin/ManagePages';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicWebsite />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      
      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="admins" element={<ManageAdmins />} />
          <Route path="services" element={<ManageServices />} />
          <Route path="messages" element={<ManageMessages />} />
          <Route path="gallery" element={<ManageGallery />} />
          <Route path="pages" element={<ManagePages />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
