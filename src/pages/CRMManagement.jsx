import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  MessageSquare,
  MoreVertical,
  Check
} from 'lucide-react';

const inquiriesData = [
  { id: 1, name: 'Rahul Sharma', email: 'rahul.s@example.com', phone: '+91 98765 43210', property: 'Luxury Villa Belapur', status: 'Pending', date: '2026-03-22', message: 'I am interested in this villa. Is it available for a visit this weekend?' },
  { id: 2, name: 'Anjali Gupta', email: 'anjali@example.com', phone: '+91 91234 56789', property: 'Office Space Vashi', status: 'Resolved', date: '2026-03-21', message: 'Looking for a 2000 sqft office space in Vashi.' },
  { id: 3, name: 'Vikram Singh', email: 'vikram@example.com', phone: '+91 98989 89898', property: 'Modern Flat Kamothe', status: 'Pending', date: '2026-03-20', message: 'What is the exact maintenance cost for this flat?' },
  { id: 4, name: 'Priya Joshi', email: 'priya@example.com', phone: '+91 91111 22222', property: 'Plot Kharghar', status: 'Resolved', date: '2026-03-19', message: 'I am interested in buying a plot in Kharghar.' },
];

const CRMManagement = () => {
  const [activeTab, setActiveTab] = useState('all');

  const filteredInquiries = inquiriesData.filter(inq => {
    if (activeTab === 'all') return true;
    return inq.status.toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Contact Inquiries</h1>
          <p className="text-slate-500">Manage and follow up with your potential leads.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="ag-card p-6 flex items-center space-x-4 border-l-4 border-primary">
          <div className="p-3 bg-primary/10 text-primary rounded-xl"><MessageSquare size={24} /></div>
          <div>
            <p className="text-sm font-semibold text-slate-500">Total Inquiries</p>
            <p className="text-xl font-bold text-slate-900">142</p>
          </div>
        </div>
        <div className="ag-card p-6 flex items-center space-x-4 border-l-4 border-amber-500">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Clock size={24} /></div>
          <div>
            <p className="text-sm font-semibold text-slate-500">Pending Follow-up</p>
            <p className="text-xl font-bold text-slate-900">28</p>
          </div>
        </div>
        <div className="ag-card p-6 flex items-center space-x-4 border-l-4 border-emerald-500">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle2 size={24} /></div>
          <div>
            <p className="text-sm font-semibold text-slate-500">Resolved</p>
            <p className="text-xl font-bold text-slate-900">114</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-x-auto no-scrollbar">
        <div className="flex items-center bg-white p-1 rounded-xl border border-slate-100 w-fit">
          {['all', 'pending', 'resolved'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                px-6 py-2 rounded-lg text-sm font-semibold capitalize transition-all
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
            placeholder="Search leads..." 
            className="bg-white border border-slate-100 rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all w-64"
          />
        </div>
      </div>

      {/* Inquiry List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredInquiries.map((inquiry) => (
          <div key={inquiry.id} className="ag-card p-6 hover:border-primary/30 transition-all group">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 font-bold">
                        {inquiry.name.charAt(0)}
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900">{inquiry.name}</h4>
                        <p className="text-xs text-slate-400">Received on {inquiry.date}</p>
                    </div>
                  </div>
                  <div className="lg:hidden">
                    {inquiry.status === 'Resolved' ? (
                        <span className="ag-badge ag-badge-published">Resolved</span>
                    ) : (
                        <span className="ag-badge ag-badge-draft">Pending</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6 text-sm">
                  <div className="flex items-center text-slate-600"><Mail size={16} className="mr-2 text-primary" /> {inquiry.email}</div>
                  <div className="flex items-center text-slate-600"><Phone size={16} className="mr-2 text-primary" /> {inquiry.phone}</div>
                  <div className="flex items-center text-slate-900 font-semibold"><MapPin size={16} className="mr-2 text-primary" /> Interested in: {inquiry.property}</div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm text-slate-700 leading-relaxed italic">
                  "{inquiry.message}"
                </div>
              </div>

              <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4 border-t lg:border-t-0 lg:border-l border-slate-50 lg:pl-10 pt-6 lg:pt-0">
                <div className="hidden lg:block mb-4">
                    {inquiry.status === 'Resolved' ? (
                        <span className="ag-badge ag-badge-published !py-1 !px-4">Resolved</span>
                    ) : (
                        <span className="ag-badge ag-badge-draft !py-1 !px-4">Pending</span>
                    )}
                </div>
                
                {inquiry.status === 'Pending' && (
                    <button className="flex items-center bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md active:scale-95">
                        <Check size={18} className="mr-2" />
                        Mark Resolved
                    </button>
                )}

                <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-800 transition-all hover:bg-slate-50 lg:mt-2">
                    <MoreVertical size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CRMManagement;
