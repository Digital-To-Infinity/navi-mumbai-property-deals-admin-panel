import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  Search,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  Clock,
  MessageSquare,
  MoreVertical,
  Check,
  X,
  Trash2,
  MessageCircle,
  Copy
} from 'lucide-react';

const enquiriesData = [
  { id: 1, name: 'Rahul Sharma', email: 'rahul.s@example.com', phone: '+91 98765 43210', property: 'Luxury Villa Belapur', status: 'Pending', date: '2026-03-22', message: 'I am interested in this villa. Is it available for a visit this weekend?' },
  { id: 2, name: 'Anjali Gupta', email: 'anjali@example.com', phone: '+91 91234 56789', property: 'Office Space Vashi', status: 'Resolved', date: '2026-03-21', message: 'Looking for a 2000 sqft office space in Vashi.' },
  { id: 3, name: 'Vikram Singh', email: 'vikram@example.com', phone: '+91 98989 89898', property: 'Modern Flat Kamothe', status: 'Pending', date: '2026-03-20', message: 'What is the exact maintenance cost for this flat?' },
  { id: 4, name: 'Priya Joshi', email: 'priya@example.com', phone: '+91 91111 22222', property: 'Plot Kharghar', status: 'Resolved', date: '2026-03-19', message: 'I am interested in buying a plot in Kharghar.' },
];

const CRMManagement = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [enquiries, setEnquiries] = useState(enquiriesData);
  const [searchTerm, setSearchTerm] = useState('');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isFocused, setIsFocused] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState('down');
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

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
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResolve = (id) => {
    setEnquiries(prev => prev.map(inq =>
      inq.id === id ? { ...inq, status: 'Resolved' } : inq
    ));
    toast.success('Enquiry marked as resolved!');
  };

  const handleStatusUpdate = (id, newStatus) => {
    setEnquiries(prev => prev.map(inq =>
      inq.id === id ? { ...inq, status: newStatus } : inq
    ));
    toast.success(`Lead status updated to ${newStatus}`);
    setOpenDropdownId(null);
  };

  const handleCopyDetails = (enquiry) => {
    const details = `Name: ${enquiry.name}\nEmail: ${enquiry.email}\nPhone: ${enquiry.phone}\nProperty: ${enquiry.property}\nMessage: ${enquiry.message}`;
    navigator.clipboard.writeText(details);
    toast.success('Lead details copied to clipboard!');
    setOpenDropdownId(null);
  };

  const handleDelete = (id) => {
    toast((t) => (
      <div className="flex flex-col gap-4 p-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center shrink-0">
            <Trash2 size={20} />
          </div>
          <div>
            <p className="font-bold text-slate-900">Confirm Delete Enquiry?</p>
            <p className="text-xs text-slate-500 mt-0.5">This action cannot be undone.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <button
            onClick={() => {
              setEnquiries(prev => prev.filter(e => e.id !== id));
              toast.dismiss(t.id);
              toast.success('Enquiry deleted successfully!');
            }}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white text-[12px] font-black px-4 py-3 rounded-full transition-all cursor-pointer active:scale-95 uppercase tracking-wider"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[12px] font-black px-4 py-3 rounded-full transition-all cursor-pointer active:scale-95 uppercase tracking-wider"
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: 6000,
      position: 'top-center',
      style: {
        minWidth: '300px',
        padding: '16px',
        borderRadius: '24px',
        background: '#fff',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
      },
    });
    setOpenDropdownId(null);
  };

  const filteredEnquiries = enquiries.filter(inq => {
    const matchesTab = activeTab === 'all' || inq.status.toLowerCase() === activeTab.toLowerCase();
    const matchesSearch =
      inq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.property.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Contact Enquiries</h1>
          <p className="text-slate-500">Manage and follow up with your potential leads.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="ag-card p-6 max-[769px]:p-4 max-[426px]:p-6 flex items-center space-x-4 border-l-4 border-primary">
          <div className="p-3 bg-primary/10 text-primary rounded-xl"><MessageSquare size={24} /></div>
          <div>
            <p className="text-sm font-semibold text-slate-500">Total Enquiries</p>
            <p className="text-xl font-bold text-black">{enquiries.length}</p>
          </div>
        </div>
        <div className="ag-card p-6 max-[769px]:p-4 max-[426px]:p-6 flex items-center space-x-4 border-l-4 border-amber-500">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Clock size={24} /></div>
          <div>
            <p className="text-sm font-semibold text-slate-500">Pending Follow-up</p>
            <p className="text-xl font-bold text-black">{enquiries.filter(i => i.status === 'Pending').length}</p>
          </div>
        </div>
        <div className="ag-card p-6 max-[769px]:p-4 max-[426px]:p-6 flex items-center space-x-4 border-l-4 border-emerald-500">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle2 size={24} /></div>
          <div>
            <p className="text-sm font-semibold text-slate-500">Resolved</p>
            <p className="text-xl font-bold text-black">{enquiries.filter(i => i.status === 'Resolved').length}</p>
          </div>
        </div>
      </div>

      {/* Tabs & Filters */}
      <div className="flex flex-col nav:flex-row nav:items-center justify-between gap-6">
        <div className="flex items-center bg-white p-1 rounded-xl border border-slate-100 w-full nav:w-fit overflow-x-auto no-scrollbar shrink-0">
          {['all', 'pending', 'resolved'].map((tab) => (
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
                placeholder="Search leads..."
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

      {/* Enquiry List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredEnquiries.map((enquiry) => (
          <div key={enquiry.id} className="ag-card p-6 max-[426px]:p-4 hover:border-primary/30 transition-all group relative">
            <div className="flex flex-col space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 font-bold">
                      {enquiry.name.charAt(0)}
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold text-black">{enquiry.name}</h4>
                      <p className="text-sm text-slate-500">Received on {enquiry.date}</p>
                    </div>
                  </div>
                  <div>
                    {enquiry.status === 'Resolved' ? (
                      <span className="ag-badge ag-badge-published">Resolved</span>
                    ) : (
                      <span className="ag-badge ag-badge-draft">Pending</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-3 text-sm">
                  <div className="flex items-center text-slate-600 font-medium"><Mail size={16} className="mr-2 text-primary" /> {enquiry.email}</div>
                  <div className="flex items-center text-slate-600 font-medium"><Phone size={16} className="mr-2 text-primary" /> {enquiry.phone}</div>
                </div>

                <div className="flex items-center text-slate-900 font-semibold text-left">
                  <MapPin size={16} className="mr-2 text-primary" /> Interested in: {enquiry.property}
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-base text-slate-700 leading-relaxed text-left">
                  {enquiry.message}
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex flex-row items-center justify-between w-full border-t border-slate-100 pt-6">
                <div>
                  {enquiry.status === 'Pending' && (
                    <button
                      onClick={() => handleResolve(enquiry.id)}
                      className="flex items-center bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      <Check size={18} className="mr-2" />
                      Mark Resolved
                    </button>
                  )}
                </div>

                <div
                  className="relative"
                  ref={openDropdownId === enquiry.id ? dropdownRef : null}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const availableSpaceBelow = window.innerHeight - rect.bottom;
                    const dropdownHeight = 300;
                    if (availableSpaceBelow < dropdownHeight && rect.top > dropdownHeight) {
                      setDropdownPosition('up');
                    } else {
                      setDropdownPosition('down');
                    }
                    setOpenDropdownId(enquiry.id);
                  }}
                  onMouseLeave={() => setOpenDropdownId(null)}
                >
                  <button
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const availableSpaceBelow = window.innerHeight - rect.bottom;
                      const dropdownHeight = 300;
                      if (availableSpaceBelow < dropdownHeight && rect.top > dropdownHeight) {
                        setDropdownPosition('up');
                      } else {
                        setDropdownPosition('down');
                      }
                      setOpenDropdownId(openDropdownId === enquiry.id ? null : enquiry.id);
                    }}
                    className={`p-2.5 transition-colors rounded-full border cursor-pointer ${openDropdownId === enquiry.id ? 'bg-slate-100 text-black border-slate-200' : 'text-slate-500 hover:text-slate-800 bg-white border-slate-200 hover:bg-slate-50'}`}
                  >
                    <MoreVertical size={18} />
                  </button>

                  <AnimatePresence>
                    {openDropdownId === enquiry.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: dropdownPosition === 'up' ? -10 : 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: dropdownPosition === 'up' ? -10 : 10 }}
                        className={`absolute right-0 ${dropdownPosition === 'up' ? 'bottom-full mb-2' : 'top-full mt-2'} w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden py-2`}
                      >
                        <div className="px-4 py-2 border-b border-slate-50 mb-1">
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-left">Lead Actions</p>
                        </div>
                        <a
                          href={`tel:${enquiry.phone}`}
                          className="w-full flex items-center space-x-3 px-4 py-2.5 font-semibold text-sm text-slate-600 hover:bg-slate-50 hover:text-black transition-colors cursor-pointer"
                        >
                          <Phone size={16} />
                          <span>Call Lead</span>
                        </a>
                        <a
                          href={`mailto:${enquiry.email}`}
                          className="w-full flex items-center space-x-3 px-4 py-2.5 font-semibold text-sm text-slate-600 hover:bg-slate-50 hover:text-black transition-colors cursor-pointer"
                        >
                          <Mail size={16} />
                          <span>Email Lead</span>
                        </a>
                        <a
                          href={`https://wa.me/${enquiry.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center space-x-3 px-4 py-2.5 font-semibold text-sm text-slate-600 hover:bg-slate-50 hover:text-black transition-colors cursor-pointer"
                        >
                          <MessageCircle size={16} />
                          <span>WhatsApp</span>
                        </a>
                        <button
                          onClick={() => handleCopyDetails(enquiry)}
                          className="w-full flex items-center space-x-3 px-4 py-2.5 font-semibold text-sm text-slate-600 hover:bg-slate-50 hover:text-black transition-colors cursor-pointer"
                        >
                          <Copy size={16} />
                          <span>Copy Details</span>
                        </button>
                        <button
                          onClick={() => handleDelete(enquiry.id)}
                          className="w-full flex items-center space-x-3 px-4 py-2.5 font-semibold text-sm text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                        >
                          <Trash2 size={16} />
                          <span>Delete Lead</span>
                        </button>

                        <div className="px-4 py-2 border-y border-slate-50 my-1 bg-slate-50/50">
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-left">Update Status</p>
                        </div>
                        {['Pending', 'Resolved'].map((status) => (
                          <button
                            key={status}
                            onClick={() => handleStatusUpdate(enquiry.id, status)}
                            className={`w-full flex items-center justify-between px-4 py-2.5 font-semibold text-sm transition-colors cursor-pointer 
                              ${enquiry.status === status
                                ? 'text-primary font-bold bg-primary/5'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-black'}`}
                          >
                            <span>{status}</span>
                            {enquiry.status === status && <CheckCircle2 size={14} />}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CRMManagement;
