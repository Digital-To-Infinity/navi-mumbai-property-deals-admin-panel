import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Calendar, 
  Eye, 
  MessageCircle, 
  CheckCircle, 
  Clock,
  MoreVertical
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const blogsData = [
  { id: 1, title: 'Upcoming Infrastructure Projects in Navi Mumbai', category: 'Real Estate News', status: 'Published', date: '2026-03-22', views: 1240 },
  { id: 2, title: 'Why CBD Belapur is the Next Commercial Hub', category: 'Area Guide', status: 'Draft', date: '2026-03-21', views: 0 },
  { id: 3, title: 'Top 5 Residential Localities for Families', category: 'Lifestyle', status: 'Published', date: '2026-03-20', views: 890 },
  { id: 4, title: 'Navi Mumbai International Airport Updates', category: 'News', status: 'Published', date: '2026-03-19', views: 3420 },
];

const BlogManagement = () => {
  const [activeTab, setActiveTab] = useState('all');

  const filteredBlogs = blogsData.filter(blog => {
    if (activeTab === 'all') return true;
    return blog.status.toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Blog Management</h1>
          <p className="text-slate-500">Create and manage content for your property platform.</p>
        </div>
        <NavLink 
            to="/admin-panel/blogs/add"
            className="ag-button flex items-center justify-center space-x-2 w-full md:w-auto"
        >
          <Plus size={20} />
          <span>Write New Post</span>
        </NavLink>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-x-auto no-scrollbar">
        <div className="flex items-center bg-white p-1 rounded-xl border border-slate-100 w-fit">
          {['all', 'published', 'draft'].map((tab) => (
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
            placeholder="Search articles..." 
            className="bg-white border border-slate-100 rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all w-64"
          />
        </div>
      </div>

      {/* Blog Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredBlogs.map((blog) => (
          <div key={blog.id} className="ag-card hover:border-primary/30 transition-all overflow-hidden group">
            <div className="flex flex-col h-full">
              <div className="aspect-video bg-slate-100 relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                  <div className="absolute top-4 left-4 z-10">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold border shadow-sm ${
                          blog.status === 'Published' ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-amber-500 text-white border-amber-400'
                      }`}>
                          {blog.status}
                      </span>
                  </div>
                  <div className="w-full h-full bg-primary/5 flex items-center justify-center text-primary/20">
                    <FileText size={48} />
                  </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-1">
                    <p className="text-xs font-bold text-primary uppercase tracking-wider">{blog.category}</p>
                    <h4 className="text-lg font-bold text-slate-900 line-clamp-2 leading-tight group-hover:text-primary transition-colors cursor-pointer">{blog.title}</h4>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50 text-slate-400 text-xs font-bold">
                    <div className="flex items-center space-x-4">
                        <span className="flex items-center"><Calendar size={14} className="mr-1.5" /> {blog.date}</span>
                        <span className="flex items-center"><Eye size={14} className="mr-1.5" /> {blog.views}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <NavLink 
                            to={`/admin-panel/blogs/edit/${blog.id}`}
                            className="p-2 hover:bg-slate-50 hover:text-primary rounded-lg transition-colors border border-transparent hover:border-slate-100"
                        >
                            <Edit size={16} />
                        </NavLink>
                        <button className="p-2 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors border border-transparent hover:border-red-100">
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Simple icon import for fallback
import { FileText } from 'lucide-react';

export default BlogManagement;
