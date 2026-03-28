import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  ChevronDown,
  Monitor,
  CheckCircle,
  Clock,
  Archive,
  MoreVertical,
  Building2
} from 'lucide-react';
import PropertyForm from '../components/PropertyForm';

const propertiesData = [
  { id: 1, title: 'Luxury Villa in Belapur', location: 'CBD Belapur, Navi Mumbai', price: '₹4.5 Cr', status: 'Active', category: 'Villa', date: '2026-03-20' },
  { id: 2, title: 'Modern Apartment in Vashi', location: 'Sector 17, Vashi', price: '₹2.8 Cr', status: 'Sold', category: 'Apartment', date: '2026-03-15' },
  { id: 3, title: 'Studio Flat in Kharghar', location: 'Kharghar, Navi Mumbai', price: '₹65 L', status: 'Draft', category: 'Flat', date: '2026-03-10' },
  { id: 4, title: 'Penthouse with View', location: 'Nerul, Navi Mumbai', price: '₹8.2 Cr', status: 'Active', category: 'Penthouse', date: '2026-03-05' },
  { id: 5, title: 'Office Space Belapur', location: 'Belapur Station, Navi Mumbai', price: '₹12 Cr', status: 'Active', category: 'Commercial', date: '2026-02-28' },
];

const PropertyManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  const filteredProperties = propertiesData.filter(prop => {
    if (activeTab === 'all') return true;
    return prop.status.toLowerCase() === activeTab.toLowerCase();
  });

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <span className="ag-badge ag-badge-published"><CheckCircle size={12} className="mr-1" /> Active</span>;
      case 'sold':
        return <span className="ag-badge bg-blue-50 text-blue-700 border-blue-100"><Monitor size={12} className="mr-1" /> Sold</span>;
      case 'draft':
        return <span className="ag-badge ag-badge-draft"><Clock size={12} className="mr-1" /> Draft</span>;
      default:
        return <span className="ag-badge bg-slate-50 text-slate-700 border-slate-100"><Archive size={12} className="mr-1" /> {status}</span>;
    }
  };

  if (showForm) {
      return (
          <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-8">
                  <div>
                      <h1 className="text-2xl font-bold text-slate-900">{editingProperty ? 'Edit Property' : 'Add New Property'}</h1>
                      <p className="text-slate-500">Fill in the details below to list a new property.</p>
                  </div>
                  <button 
                      onClick={() => { setShowForm(false); setEditingProperty(null); }}
                      className="text-slate-500 hover:text-slate-800 font-semibold"
                  >
                      Cancel
                  </button>
              </div>
              <PropertyForm initialData={editingProperty} onSave={() => setShowForm(false)} />
          </div>
      )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Property Management</h1>
          <p className="text-slate-500">Manage your real estate listings, status, and pricing.</p>
        </div>
        <button 
            onClick={() => setShowForm(true)}
            className="ag-button flex items-center justify-center space-x-2 w-full md:w-auto"
        >
          <Plus size={20} />
          <span>Add Property</span>
        </button>
      </div>

      {/* Tabs & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-x-auto no-scrollbar pb-2">
        <div className="flex items-center bg-white p-1 rounded-xl border border-slate-100 w-fit">
          {['all', 'active', 'sold', 'draft'].map((tab) => (
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

        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search properties..." 
              className="bg-white border border-slate-100 rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none w-64 transition-all"
            />
          </div>
          <button className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-600 hover:bg-slate-50 transition-all">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="ag-card overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Property Details</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Published</th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProperties.map((property) => (
                <tr key={property.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                          {/* Fallback image */}
                          <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary">
                            <Building2 size={24} />
                          </div>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 truncate max-w-[200px]">{property.title}</p>
                        <p className="text-xs text-slate-500">{property.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(property.status)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600 font-medium">{property.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-900">{property.price}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-500 font-medium">{property.date}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => { setEditingProperty(property); setShowForm(true); }}
                        className="p-2 text-slate-400 hover:text-primary transition-colors hover:bg-white rounded-lg border border-transparent hover:border-slate-100"
                      >
                        <Edit size={18} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-500 transition-colors hover:bg-white rounded-lg border border-transparent hover:border-slate-100">
                        <Trash2 size={18} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-800 transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
            <p className="text-sm text-slate-500">Showing 1 to {filteredProperties.length} of 1,284 properties</p>
            <div className="flex items-center space-x-2">
                <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-400 cursor-not-allowed">Previous</button>
                <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-all font-semibold">Next</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyManagement;
