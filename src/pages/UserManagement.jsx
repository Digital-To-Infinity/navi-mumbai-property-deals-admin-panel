import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  UserCircle, 
  CheckCircle2, 
  Shield, 
  ShieldCheck, 
  MoreVertical,
  ChevronDown
} from 'lucide-react';

const usersData = [
  { id: 1, name: 'Aditya Kulkarni', email: 'aditya@example.com', role: 'Admin', status: 'Active', joinDate: '2025-01-10' },
  { id: 2, name: 'Sandeep Patil', email: 'sandeep@example.com', role: 'Agent', status: 'Active', joinDate: '2025-02-15' },
  { id: 3, name: 'Meera Deshmukh', email: 'meera@example.com', role: 'Agent', status: 'Inactive', joinDate: '2025-03-01' },
  { id: 4, name: 'Prashant More', email: 'prashant@example.com', role: 'User', status: 'Active', joinDate: '2025-03-20' },
  { id: 5, name: 'Sneha Pawar', email: 'sneha@example.com', role: 'Agent', status: 'Active', joinDate: '2025-02-28' },
];

import { toast } from 'react-hot-toast';

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [users, setUsers] = useState(usersData);

  const handleRoleToggle = (id) => {
    const user = users.find(u => u.id === id);
    if (!user) return;
    
    const nextRole = user.role === 'Admin' ? 'Agent' : user.role === 'Agent' ? 'User' : 'Admin';
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role: nextRole } : u));
    toast.success(`${user.name}'s role updated to ${nextRole}`);
  };

  const filteredUsers = users.filter(user => {
    if (activeTab === 'all') return true;
    return user.role.toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-left">
          <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-500">Manage agents, administrators, and regular users.</p>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-x-auto no-scrollbar">
        <div className="flex items-center bg-white p-1 rounded-xl border border-slate-100 w-fit">
          {['all', 'admin', 'agent', 'user'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                px-6 py-2 rounded-lg text-sm font-semibold capitalize transition-all cursor-pointer
                ${activeTab === tab 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900'}
              `}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name/email..." 
            className="bg-white border border-slate-100 rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all w-64 focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* User Table */}
      <div className="ag-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-400 uppercase tracking-wider text-xs font-bold">
              <tr>
                <th className="px-6 py-4">Full Name</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Registration</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/10 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold shrink-0">
                        {user.name.charAt(0)}
                      </div>
                      <div className="text-left">
                        <h4 className="font-bold text-slate-900 text-sm leading-tight">{user.name}</h4>
                        <p className="text-xs text-slate-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                        <span className={`flex items-center px-3 py-1 rounded-lg text-xs font-bold border ${
                            user.role === 'Admin' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 
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
                  <td className="px-6 py-4 text-xs font-bold text-slate-500">{user.joinDate}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-3">
                        <button 
                          onClick={() => handleRoleToggle(user.id)}
                          className="text-xs font-bold text-primary hover:text-primary-dark transition-colors px-3 py-1.5 hover:bg-primary-light rounded-lg border border-transparent hover:border-primary/10 shadow-none hover:shadow-sm cursor-pointer"
                        >
                            Role Toggle
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer">
                            <MoreVertical size={18} />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
