import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  Search,
  Shield,
  ShieldCheck,
  MoreVertical,
  X,
  Edit,
  Mail,
  UserMinus,
  CheckCircle,
  Trash2,
  ChevronDown,
  Key
} from 'lucide-react';
import api from '../utils/api';

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [showPerPageDropdown, setShowPerPageDropdown] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState('down');
  const [dropdownCoords, setDropdownCoords] = useState({ top: 0, left: 0 });
  
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const perPageRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeTab]);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, itemsPerPage, searchTerm, activeTab]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
      };
      
      if (activeTab !== 'all') {
        params.role = activeTab.charAt(0).toUpperCase() + activeTab.slice(1).toLowerCase();
      }

      const response = await api.get('/admin/users', { params });
      
      if (response.data.success !== false) {
        // Handle both standard response and the one shown in examples
        const data = response.data.data || response.data.users || [];
        setUsers(data);
        setTotalPages(response.data.totalPages || 1);
        setTotalUsers(response.data.total || data.length);
      } else {
        toast.error(response.data.message || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
      if (perPageRef.current && !perPageRef.current.contains(event.target)) {
        setShowPerPageDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStatusToggle = async (id) => {
    const user = users.find(u => (u.id || u._id) === id);
    if (!user) return;
    const nextStatus = user.status === 'Active' ? 'Inactive' : 'Active';
    
    try {
      const response = await api.patch(`/admin/users/${id}/status`, { status: nextStatus });
      if (response.data.success !== false) {
        setUsers(prev => prev.map(u => (u.id || u._id) === id ? { ...u, status: nextStatus } : u));
        toast.success(`${user.name || user.fullName} is now ${nextStatus}`);
      } else {
        toast.error(response.data.message || 'Failed to update status');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
    setOpenDropdownId(null);
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      const response = await api.patch(`/admin/users/${id}/role`, { role: newRole });
      if (response.data.success !== false) {
        setUsers(prev => prev.map(u => (u.id || u._id) === id ? { ...u, role: newRole } : u));
        toast.success(`Role updated to ${newRole}`);
      } else {
        toast.error(response.data.message || 'Failed to update role');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update role');
    }
    setOpenDropdownId(null);
  };

  const handleCopyEmail = (email) => {
    navigator.clipboard.writeText(email).then(() => {
      toast.success('Email copied to clipboard!');
      setOpenDropdownId(null);
    });
  };

  const handleResetPassword = async (id, name) => {
    const tId = toast.loading(`Generating reset link for ${name}...`);
    try {
      const response = await api.post(`/admin/users/${id}/reset-password`);
      if (response.data.success !== false) {
        toast.success(`Reset link sent to ${name}'s email!`, { id: tId });
      } else {
        toast.error(response.data.message || 'Failed to send reset link', { id: tId });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset link.', { id: tId });
    }
    setOpenDropdownId(null);
  };

  const handleDelete = (id, name) => {
    toast((t) => (
      <div className="flex flex-col gap-4 p-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center shrink-0">
            <Trash2 size={20} />
          </div>
          <div>
            <p className="font-bold text-slate-900 text-left">Remove User: {name}?</p>
            <p className="text-xs text-slate-500 mt-0.5 text-left">This will permanently delete the account.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <button
            onClick={async () => {
              try {
                toast.dismiss(t.id);
                const deleteToastId = toast.loading('Deleting user...');
                const response = await api.delete(`/admin/users/${id}`);
                if (response.data.success !== false) {
                  setUsers(prev => prev.filter(u => (u.id || u._id) !== id));
                  toast.success('User deleted successfully!', { id: deleteToastId });
                  fetchUsers(); // Refresh to get correct pagination
                } else {
                  toast.error(response.data.message || 'Failed to delete user', { id: deleteToastId });
                }
              } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to delete user');
              }
            }}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white text-[10px] font-black px-4 py-3 rounded-full transition-all cursor-pointer active:scale-95 uppercase tracking-wider"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-black px-4 py-3 rounded-full transition-all cursor-pointer active:scale-95 uppercase tracking-wider"
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: 6000,
      position: 'top-center',
      style: {
        minWidth: '320px',
        padding: '16px',
        borderRadius: '24px',
        background: '#fff',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
      },
    });
    setOpenDropdownId(null);
  };

  useEffect(() => {
    const handleScroll = () => {
      setOpenDropdownId(null);
    };
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, []);

  const handleMouseEnter = (e, user) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    
    const rect = e.currentTarget.getBoundingClientRect();
    const availableSpaceBelow = window.innerHeight - rect.bottom;
    const dropdownHeight = 450; 
    const side = (availableSpaceBelow < dropdownHeight && rect.top > dropdownHeight) ? 'up' : 'down';
    
    setDropdownPosition(side);
    setDropdownCoords({
      top: side === 'up' ? rect.top + window.scrollY : rect.bottom + window.scrollY,
      left: rect.right + window.scrollX
    });
    setOpenDropdownId(user.id);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setOpenDropdownId(null);
    }, 150);
  };

  const selectedUser = users.find(u => (u.id || u._id) === openDropdownId);

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Header */}
      <div className="flex flex-col min-[427px]:flex-row min-[427px]:items-center justify-between gap-4">
        <div className="text-left">
          <h1 className="text-2xl max-[426px]:text-3xl max-[426px]:mb-4 max-[426px]:text-center font-bold text-black">User Management</h1>
          <p className="text-slate-500 hidden sm:block">Manage agents, administrators, and regular users.</p>
        </div>
      </div>

      {/* Tabs & Filters */}
      <div className="flex flex-col nav:flex-row nav:items-center justify-between gap-6">
        <div className="flex items-center bg-white p-1 rounded-xl border border-slate-100 w-full nav:w-fit overflow-x-auto no-scrollbar shrink-0">
          {['all', 'admin', 'agent', 'user'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                flex-1 nav:flex-none px-4 nav:px-10 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all cursor-pointer whitespace-nowrap
                ${activeTab === tab
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-slate-500 hover:text-black hover:bg-slate-50'}
              `}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="flex items-center space-x-3 group w-full nav:w-auto">
          <div className="relative w-full">
            <motion.div
              initial={false}
              animate={{ width: windowWidth <= 769 ? '100%' : ((searchTerm || isFocused) ? '400px' : '280px') }}
              className="relative flex items-center"
            >
              <Search
                className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${(searchTerm || isFocused) ? 'text-primary' : 'text-slate-500'}`}
                size={18}
              />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name/email..."
                className="w-full bg-white border border-slate-200 rounded-2xl py-2.5 pl-11 pr-10 text-sm focus:ring-primary focus:border-primary focus:outline-none transition-all placeholder:text-slate-500 hover:border-slate-300"
              />
              <AnimatePresence>
                {searchTerm && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 p-1 hover:bg-slate-100 rounded-lg text-black transition-colors cursor-pointer"
                  >
                    <X size={14} />
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>

      {/* User Table */}
      <div className="ag-card">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-500 uppercase tracking-wider text-xs font-bold whitespace-nowrap">
              <tr>
                <th className="px-6 py-4">Full Name</th>
                <th className="px-6 py-4 w-[160px]">Role</th>
                <th className="px-6 py-4 w-[140px]">Status</th>
                <th className="px-6 py-4 w-[160px]">Registration</th>
                <th className="px-6 py-4 text-right w-[120px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
                        <p className="text-slate-500 font-medium">Loading users...</p>
                      </div>
                    </td>
                  </tr>
                ) : users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id || user._id} className={`hover:bg-slate-50/50 transition-colors group ${openDropdownId === (user.id || user._id) ? 'relative z-[60]' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold shrink-0">
                            {(user.name || user.fullName || 'U').charAt(0)}
                          </div>
                          <div className="text-left">
                            <h4 className="font-bold text-semibold text-black text-base leading-tight">{user.name || user.fullName}</h4>
                          <p className="text-sm text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className={`flex items-center px-3 py-1 rounded-lg text-xs font-bold border ${user.role === 'Admin' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                          user.role === 'Agent' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                            'bg-slate-50 text-slate-700 border-slate-100'
                          }`}>
                          {user.role === 'Admin' ? <ShieldCheck size={14} className="mr-1.5" /> : <Shield size={14} className="mr-1.5" />}
                          {user.role}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300 animate-pulse'}`} />
                        <span className={`text-xs font-bold ${user.status === 'Active' ? 'text-emerald-600' : 'text-slate-400'}`}>{user.status}</span>
                      </div>
                    </td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-500">{user.joinDate || new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          className="p-2 text-slate-500 hover:text-black transition-colors hover:bg-white rounded-lg border border-transparent hover:border-slate-100 cursor-pointer"
                          title="Edit User"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id || user._id, user.name || user.fullName)}
                          className="p-2 text-slate-500 hover:text-red-500 transition-colors hover:bg-white rounded-lg border border-transparent hover:border-slate-100 cursor-pointer"
                          title="Delete User"
                        >
                          <Trash2 size={18} />
                        </button>
                        <div className="flex items-center justify-end">
                          <button
                            onMouseEnter={(e) => handleMouseEnter(e, user)}
                            onMouseLeave={handleMouseLeave}
                            onClick={(e) => {
                              e.stopPropagation();
                              const id = user.id || user._id;
                              setOpenDropdownId(openDropdownId === id ? null : id);
                            }}
                            className={`p-2 transition-colors rounded-lg cursor-pointer ${openDropdownId === (user.id || user._id) ? 'bg-slate-100 text-black' : 'text-slate-400 hover:text-slate-800'}`}
                            title="Actions"
                          >
                            <MoreVertical size={18} />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center">
                      <div className="p-4 bg-slate-50 rounded-full mb-3 text-slate-500">
                        <Search size={32} />
                      </div>
                      <p className="font-semibold text-black mb-1">No users found</p>
                      <p className="text-base text-slate-500">We couldn't find any users matching "{searchTerm}"</p>
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm('')}
                          className="mt-4 text-primary font-semibold hover:underline cursor-pointer"
                        >
                          Clear search
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Action Dropdown Portal */}
        {createPortal(
          <AnimatePresence>
            {openDropdownId && selectedUser && (
              <div 
                className="fixed inset-0 z-[9999] pointer-events-none"
                onClick={() => setOpenDropdownId(null)}
              >
                <div className="relative w-full h-full">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: dropdownPosition === 'up' ? 10 : -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: dropdownPosition === 'up' ? 10 : -10 }}
                    onMouseEnter={() => {
                        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                    }}
                    onMouseLeave={handleMouseLeave}
                    ref={dropdownRef}
                    style={{
                      position: 'absolute',
                      top: dropdownPosition === 'up' ? dropdownCoords.top - window.scrollY - 8 : dropdownCoords.top - window.scrollY + 8,
                      left: dropdownCoords.left - 224, // 224 is w-56
                      transformOrigin: dropdownPosition === 'up' ? 'bottom right' : 'top right',
                    }}
                    className={`pointer-events-auto w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden py-2 text-left ${dropdownPosition === 'up' ? '-translate-y-full' : ''}`}
                  >
                    <div className="px-4 py-2 border-b border-slate-50 mb-1">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Management</p>
                    </div>

                    <button
                      onClick={() => handleResetPassword(selectedUser.id || selectedUser._id, selectedUser.name || selectedUser.fullName)}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 font-semibold text-sm text-slate-600 hover:bg-slate-50 hover:text-black transition-colors cursor-pointer text-left"
                    >
                      <Key size={16} />
                      <span>Reset Password</span>
                    </button>

                    <button
                      onClick={() => handleCopyEmail(selectedUser.email)}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 font-semibold text-sm text-slate-600 hover:bg-slate-50 hover:text-black transition-colors cursor-pointer text-left"
                    >
                      <Mail size={16} />
                      <span>Copy Email address</span>
                    </button>

                    <button
                      onClick={() => handleStatusToggle(selectedUser.id || selectedUser._id)}
                      className={`w-full flex items-center space-x-3 px-4 py-2.5 font-semibold text-sm transition-colors cursor-pointer text-left
                        ${selectedUser.status === 'Active' ? 'text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'}`}
                    >
                      {selectedUser.status === 'Active' ? <UserMinus size={16} /> : <CheckCircle size={16} />}
                      <span>{selectedUser.status === 'Active' ? 'Deactivate Account' : 'Activate Account'}</span>
                    </button>

                    <div className="px-4 py-2 border-y border-slate-50 my-1 bg-slate-50/50">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Change Role</p>
                    </div>

                    {['Admin', 'Agent', 'User'].map((role) => (
                      <button
                        key={role}
                        onClick={() => handleRoleChange(selectedUser.id || selectedUser._id, role)}
                        className={`w-full flex items-center justify-between px-4 py-2.5 font-semibold text-sm transition-colors cursor-pointer text-left
                          ${selectedUser.role === role
                            ? 'text-primary font-bold bg-primary/5'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-black'}`}
                      >
                        <span>{role}</span>
                        {selectedUser.role === role && <CheckCircle size={14} />}
                      </button>
                    ))}
                  </motion.div>
                </div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}

        {/* Pagination */}
        <div className="px-6 py-6 bg-slate-50/50 border-t border-slate-100 flex flex-col nav:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-8 w-full nav:w-auto">
            <p className="text-sm text-black font-medium whitespace-nowrap">
              Showing <span className="text-primary font-bold">{users.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to <span className="text-primary font-bold">{Math.min(currentPage * itemsPerPage, totalUsers)}</span> of <span className="text-primary font-bold">{totalUsers}</span> users
            </p>

            <div
              className="relative flex items-center space-x-3"
              ref={perPageRef}
              onMouseEnter={() => setShowPerPageDropdown(true)}
              onMouseLeave={() => setShowPerPageDropdown(false)}
            >
              <span className="text-xs text-black font-bold uppercase tracking-wider">Per Page:</span>
              <button
                onClick={() => setShowPerPageDropdown(!showPerPageDropdown)}
                className={`flex items-center justify-between min-w-[70px] h-6 bg-white border border-slate-200 rounded-xl px-3 text-sm font-bold transition-all cursor-pointer active:scale-95 ${showPerPageDropdown ? 'border-primary bg-primary/5 text-primary' : 'text-slate-700'}`}
              >
                <span>{itemsPerPage}</span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${showPerPageDropdown ? 'rotate-180' : 'text-slate-500'}`} />
              </button>

              <AnimatePresence>
                {showPerPageDropdown && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: -8 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute bottom-full left-0 mb-2 w-32 bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 z-50 overflow-hidden"
                  >
                    {[10, 20, 30, 50, 100].map((val) => (
                      <button
                        key={val}
                        onClick={() => {
                          setItemsPerPage(val);
                          setCurrentPage(1);
                          setShowPerPageDropdown(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-2 text-sm font-bold transition-all cursor-pointer
                          ${itemsPerPage === val
                            ? 'text-primary bg-primary/5'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-black'}`}
                      >
                        <span>{val} Rows</span>
                        {itemsPerPage === val && <CheckCircle size={14} className="text-primary" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center justify-between w-full nav:w-auto nav:justify-end nav:space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all border shrink-0 
                ${currentPage === 1
                  ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 cursor-pointer shadow-sm active:scale-95'}`}
            >
              Previous
            </button>
            <div className="hidden sm:flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  className={`w-9 h-9 rounded-full text-sm font-bold transition-all cursor-pointer
                     ${currentPage === num
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}
                >
                  {num}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all border shrink-0
                ${currentPage === totalPages || totalPages === 0
                  ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 cursor-pointer active:scale-95'}`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
