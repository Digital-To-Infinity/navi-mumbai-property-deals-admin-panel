import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from "../assets/nm-property-logo.png";
import {
  LayoutDashboard,
  Building2,
  FileText,
  Users,
  MessageSquare,
  LogOut,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin-panel' },
    { name: 'Properties', icon: <Building2 size={20} />, path: '/admin-panel/properties' },
    { name: 'Blog Posts', icon: <FileText size={20} />, path: '/admin-panel/blogs' },
    { name: 'Contact Enquiries', icon: <MessageSquare size={20} />, path: '/admin-panel/inquiries' },
    { name: 'User Management', icon: <Users size={20} />, path: '/admin-panel/users' },
  ];

  return (
    <aside className={`
      fixed top-0 left-0 h-full bg-white border-r border-slate-100 z-40 transition-all duration-300
      ${isOpen ? 'w-72 translate-x-0' : 'w-72 -translate-x-full md:translate-x-0'}
    `}>
      <div className="flex flex-col h-full overflow-hidden">
        {/* Logo */}
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center">
            <img src={logo} alt="Navi Mumbai Property Deals" className="h-14 w-auto" />
          </div>
          <button className="md:hidden p-2 hover:bg-slate-50 rounded-lg transition-colors" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/admin-panel'}
              onClick={() => {
                if (window.innerWidth < 768) onClose();
              }}
              className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
            >
              <span className="shrink-0">
                {item.icon}
              </span>
              <span className="text-[14px] font-semibold">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer / Logout */}
        <div className="p-2">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-4 px-2 w-full text-black hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
          >
            <LogOut size={20} />
            <span className="text-[14px] font-semibold">Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
