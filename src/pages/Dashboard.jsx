import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Building2,
  Users,
  Eye,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  MessageSquare,
  FileText,
  ChevronRight,
  MapPin,
  UserPlus,
  PieChart as PieChartIcon,
  BarChart2
} from 'lucide-react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import api from '../utils/api';

// Data from other modules (Simplified/Mocked for Dashboard)
const propertiesData = [
  { id: 1, title: 'Luxury Villa in Belapur', location: 'CBD Belapur', price: '₹4.5 Cr', status: 'Active', category: 'Villa', date: '2026-03-20' },
  { id: 2, title: 'Modern Apartment in Vashi', location: 'Sector 17, Vashi', price: '₹2.8 Cr', status: 'Sold', category: 'Apartment', date: '2026-03-15' },
  { id: 3, title: 'Studio Flat in Kharghar', location: 'Kharghar', price: '₹65 L', status: 'Draft', category: 'Flat', date: '2026-03-10' },
];

const enquiriesData = [
  { id: 1, name: 'Rahul Sharma', email: 'rahul.s@example.com', property: 'Luxury Villa Belapur', status: 'Pending', date: '2026-03-22' },
  { id: 2, name: 'Anjali Gupta', email: 'anjali@example.com', property: 'Office Space Vashi', status: 'Resolved', date: '2026-03-21' },
  { id: 3, name: 'Vikram Singh', email: 'vikram@example.com', property: 'Modern Flat Kamothe', status: 'Pending', date: '2026-03-20' },
];

const blogsData = [
  { id: 1, title: 'Upcoming Infrastructure Projects in Navi Mumbai', views: 1240, date: '2026-03-22' },
  { id: 2, title: 'Why CBD Belapur is the Next Commercial Hub', views: 850, date: '2026-03-21' },
];

const chartData = [
  { name: 'Jan', properties: 40, leads: 24 },
  { name: 'Feb', properties: 30, leads: 13 },
  { name: 'Mar', properties: 56, leads: 98 },
  { name: 'Apr', properties: 27, leads: 39 },
  { name: 'May', properties: 18, leads: 48 },
  { name: 'Jun', properties: 23, leads: 38 },
  { name: 'Jul', properties: 34, leads: 43 },
];

const categoryDistribution = [
  { name: 'Apartments', value: 450, color: '#baa360' },
  { name: 'Villas', value: 230, color: '#6366f1' },
  { name: 'Commercial', value: 180, color: '#10b981' },
  { name: 'Plots/Land', value: 120, color: '#f59e0b' },
  { name: 'Others', value: 80, color: '#94a3b8' },
];

const topLocations = [
  { name: 'CBD Belapur', leads: 840, growth: '+12%', color: 'bg-primary' },
  { name: 'Kharghar', leads: 620, growth: '+18%', color: 'bg-indigo-500' },
  { name: 'Vashi', leads: 510, growth: '+5%', color: 'bg-emerald-500' },
  { name: 'Ulwe', leads: 480, growth: '+24%', color: 'bg-amber-500' },
];

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = "primary" }) => (
  <div className="ag-card p-6 flex items-start justify-between">
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-black">{value}</h3>
      <div className="flex items-center mt-2">
        {trend === 'up' ? (
          <ArrowUpRight className="text-emerald-500 mr-1" size={14} />
        ) : (
          <ArrowDownRight className="text-red-500 mr-1" size={14} />
        )}
        <span className={`text-xs font-semibold ${trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
          {trendValue}
        </span>
        <span className="text-xs text-slate-500 ml-1">vs last month</span>
      </div>
    </div>
    <div className={`p-3 bg-${color}/10 rounded-xl text-${color}`}>
      <Icon size={24} />
    </div>
  </div>
);

const Dashboard = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 426);
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeListings: 0,
    newLeads: 0,
    draftArticles: 0,
    pendingReviews: 0,
    resolvedLeads: 0
  });
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 426);
    window.addEventListener('resize', handleResize);
    fetchStats();
    fetchRecentBlogs();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchRecentBlogs = async () => {
    try {
      const response = await api.get('/admin/dashboard/recent-blogs');
      if (response.data) {
        setRecentBlogs(response.data);
      }
    } catch (error) {
      console.error('Error fetching recent blogs:', error);
    }
  };

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/admin/dashboard/stats');
      if (response.data) {
        setStats({
          totalProperties: response.data.totalProperties || 0,
          activeListings: response.data.activeListings || 0,
          newLeads: response.data.newLeads || 0,
          draftArticles: response.data.draftArticles || 0,
          pendingReviews: response.data.pendingReviews || 0,
          resolvedLeads: response.data.resolvedLeads || 0
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-black max-[426px]:text-center max-[426px]:text-3xl">Dashboard Overview</h1>
        <p className="text-slate-500 max-[426px]:hidden">Welcome back, Administrator. Here's a snapshot of your platform.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Properties"
          value={isLoading ? '...' : stats.totalProperties.toLocaleString()}
          icon={Building2}
          trend="up"
          trendValue="12.5%"
          color="primary"
        />
        <StatCard
          title="Active Listings"
          value={isLoading ? '...' : stats.activeListings.toLocaleString()}
          icon={TrendingUp}
          trend="up"
          trendValue="8.2%"
          color="indigo-600"
        />
        <StatCard
          title="New Leads"
          value={isLoading ? '...' : stats.newLeads.toLocaleString()}
          icon={Users}
          trend="up"
          trendValue="24.1%"
          color="emerald-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="ag-card p-6 max-[426px]:p-4">
            <div className="flex items-center justify-between max-[426px]:flex-col max-[426px]:items-start mb-8">
              <div>
                <h4 className="text-xl font-bold text-slate-900">Platform Performance</h4>
                <p className="text-sm text-slate-500">Property growth and lead generation trends.</p>
              </div>
              <div className="flex items-center space-x-4 max-[426px]:mt-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-primary rounded-full mr-2"></div>
                  <span className="text-xs font-semibold text-slate-600">Properties</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full mr-2"></div>
                  <span className="text-xs font-semibold text-slate-600">Leads</span>
                </div>
              </div>
            </div>
            <div className="h-[350px] max-[426px]:h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={isMobile ? { top: 10, right: 0, left: -30, bottom: 0 } : { top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorProp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#baa360" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#baa360" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="properties"
                    stroke="#baa360"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorProp)"
                  />
                  <Area
                    type="monotone"
                    dataKey="leads"
                    stroke="#6366f1"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorLeads)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Distribution Doughnut */}
            <div className="ag-card p-6 max-[426px]:p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-bold text-black">Category Mix</h4>
                <PieChartIcon size={18} className="text-slate-500" />
              </div>
              <div className="flex flex-col items-center">
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col space-y-3 mt-6 w-full px-2">
                  {categoryDistribution.map((entry) => (
                    <div key={entry.name} className="flex items-center justify-between group">
                      <div className="flex items-center">
                        <div className="w-2.5 h-2.5 rounded-full mr-3 shadow-sm transition-all" style={{ backgroundColor: entry.color }}></div>
                        <span className="text-sm font-semibold text-slate-500 group-hover:text-black transition-colors">{entry.name}</span>
                      </div>
                      <span className="text-sm font-bold text-black">{Math.round((entry.value / 1060) * 100)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Regional Activity */}
            <div className="ag-card p-6 max-[426px]:p-4">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-bold text-black">Regional Pulse</h4>
                <BarChart2 size={18} className="text-slate-500" />
              </div>
              <div className="space-y-4">
                {topLocations.map((loc) => (
                  <div key={loc.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-black">{loc.name}</span>
                      <div className="flex items-center text-[12px] font-black text-emerald-500">
                        <ArrowUpRight size={12} className="mr-0.5" /> {loc.growth}
                      </div>
                    </div>
                    <div className="relative w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`absolute left-0 top-0 h-full rounded-full ${loc.color}`}
                        style={{ width: `${(loc.leads / 840) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[12px] text-slate-500 font-medium">
                      <span>{loc.leads} Interested Leads</span>
                      <span>{(loc.leads / 2450 * 100).toFixed(1)}% Share</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] max-[426px]:text-[12px] text-slate-500 font-bold uppercase tracking-widest text-center">Market Leader</p>
                <p className="text-xs max-[426px]:text-sm font-bold text-primary text-center mt-1">CBD Belapur is currently top trending</p>
              </div>
            </div>
          </div>

          {/* Recent Properties */}
          <div className="ag-card overflow-hidden">
            <div className="p-6 max-[426px]:p-4 border-b border-slate-50 flex items-center justify-between">
              <h4 className="text-lg font-bold text-black">Recent Properties</h4>
              <NavLink to="/properties" className="text-sm font-semibold text-primary hover:underline flex items-center">
                View All <ChevronRight size={16} />
              </NavLink>
            </div>
            <div className="divide-y divide-slate-50">
              {propertiesData.map((prop) => (
                <div key={prop.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-primary">
                      <Building2 size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-black leading-tight">{prop.title}</p>
                      <div className="flex items-center text-xs text-slate-500 mt-1">
                        <MapPin size={12} className="mr-1" /> {prop.location}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-black">{prop.price}</p>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${prop.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                      }`}>
                      {prop.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Activity */}
        <div className="space-y-6">
          {/* Recent Enquiries */}
          <div className="ag-card overflow-hidden">
            <div className="p-6 max-[426px]:p-4 border-b border-slate-50 flex items-center justify-between">
              <h4 className="text-lg font-bold text-black">Recent Leads</h4>
              <NavLink to="/enquiries" className="text-sm font-semibold text-primary hover:underline flex items-center text-right">
                <ChevronRight size={18} />
              </NavLink>
            </div>
            <div className="p-4 space-y-4">
              {enquiriesData.map((lead) => (
                <div key={lead.id} className="flex items-start space-x-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold shrink-0">
                    {lead.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-black text-base truncate">{lead.name}</p>
                    <p className="text-sm text-slate-500 flex items-center truncate">
                      <MessageSquare size={14} className="mr-1" /> {lead.property}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[12px] font-medium text-slate-500">{lead.date}</span>
                      <span className={`text-[10px] font-black uppercase ${lead.status === 'Pending' ? 'text-amber-500' : 'text-emerald-500'}`}>
                        {lead.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Blog Activity */}
          <div className="ag-card overflow-hidden">
            <div className="p-6 max-[426px]:p-4 border-b border-slate-50 flex items-center justify-between">
              <h4 className="text-lg font-bold text-black">Blog Activity</h4>
              <NavLink to="/blogs" className="text-sm font-semibold text-primary hover:underline flex items-center">
                <ChevronRight size={18} />
              </NavLink>
            </div>
            <div className="p-4 space-y-4">
              {recentBlogs.length > 0 ? (
                recentBlogs.map((blog) => (
                  <div key={blog.id} className="group">
                    <p className="text-base font-bold text-black group-hover:text-primary transition-colors line-clamp-1">
                      {blog.title}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center text-sm text-slate-500">
                        <Eye size={14} className="mr-1" /> {(blog.views || 0).toLocaleString()} views
                      </div>
                      <span className="text-[12px] text-slate-500 font-medium">{blog.date}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 text-center py-4">No recent blogs</p>
              )}
            </div>
          </div>



          {/* Quick Stats Summary */}
          <div className="ag-card p-6 max-[426px]:p-4 bg-primary/5 border-primary/10">
            <h4 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Platform Pulse</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-base font-medium text-slate-600">
                  <CheckCircle2 size={18} className="mr-2 text-emerald-500" />
                  Resolved Leads
                </div>
                <span className="text-sm font-bold text-slate-900">{stats.resolvedLeads}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-base font-medium text-slate-600">
                  <Clock size={18} className="mr-2 text-amber-500" />
                  Pending Reviews
                </div>
                <span className="text-sm font-bold text-slate-900">{stats.pendingReviews}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-base font-medium text-slate-600">
                  <FileText size={18} className="mr-2 text-indigo-500" />
                  Draft Articles
                </div>
                <span className="text-sm font-bold text-slate-900">{stats.draftArticles}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

