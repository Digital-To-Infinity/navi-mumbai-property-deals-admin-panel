import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PropertyManagement from './pages/PropertyManagement';
import BlogManagement from './pages/BlogManagement';
import AddBlog from './pages/AddBlog';
import CRMManagement from './pages/CRMManagement';
import UserManagement from './pages/UserManagement';

function App() {
  return (
    <AuthProvider>
        <Router>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#333',
                color: '#fff',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
            }}
          />
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route path="/admin-panel" element={<Layout />}>
              <Route index element={<Dashboard />} />
              
              {/* Property Management */}
              <Route path="properties" element={<PropertyManagement />} />
              
              {/* Blog Management */}
              <Route path="blogs" element={<BlogManagement />} />
              <Route path="blogs/add" element={<AddBlog />} />
              <Route path="blogs/edit/:id" element={<AddBlog />} />
              
              {/* CRM / Inquiries */}
              <Route path="inquiries" element={<CRMManagement />} />
              
              {/* User Management */}
              <Route path="users" element={<UserManagement />} />
            </Route>

            {/* Catch-all and Redirects */}
            <Route path="/" element={<Navigate to="/admin-panel" replace />} />
            <Route path="*" element={<Navigate to="/admin-panel" replace />} />
          </Routes>
        </Router>
    </AuthProvider>
  );
}

export default App;
