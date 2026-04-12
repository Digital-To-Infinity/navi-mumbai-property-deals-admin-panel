import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Trash2,
  Star,
  X,
  ChevronDown,
  MoreVertical
} from 'lucide-react';
import api from '../utils/api';

const mockReviews = [
  {
    _id: "raw-1",
    propertyId: "villa-belapur-123",
    propertySlug: "luxury-villa-belapur",
    name: "Aarav Sharma",
    city: "Navi Mumbai",
    role: "Owner",
    ratings: {
      connectivity: 5,
      lifestyle: 4,
      safety: 5,
      environment: 4
    },
    like: "The connectivity is extremely good with regular bus services directly to the station. Finding schools, local shopping complexes, and healthcare is very convenient since it is centrally located. The neighborhood feels very quiet, and the green surroundings make the daily walks peaceful.",
    dislike: "On weekends, local traffic can be an issue towards the main highway. The society maintenance could be slightly better, and the visitor parking sometimes gets completely full during festive seasons, causing minor inconveniences to the guests. Overall fairly well-managed but could improve here.",
    status: "pending",
    createdAt: "2026-04-10T10:30:00Z"
  },
  {
    _id: "raw-2",
    propertyId: "sea-woods-premium",
    propertySlug: "sea-woods-premium-apartments",
    name: "Priya Desai",
    city: "Mumbai",
    role: "Tenant",
    ratings: {
      connectivity: 5,
      lifestyle: 5,
      safety: 4,
      environment: 5
    },
    like: "I love the sweeping sea views and the amazing lifestyle amenities provided within this complex. Grand clubhouses, excellent gym, and dedicated children play areas make it an ideal place to live. Security is very strict and modern, ensuring we feel very safe even late at night.",
    dislike: "The rent and maintenance charges are quite steep compared to surrounding areas. During heavy monsoons, the approach road sometimes gets briefly waterlogged. Also, the nearest big supermarket is a slight drive away, so quick grocery runs can be slightly tedious if not relying on delivery apps.",
    status: "approved",
    createdAt: "2026-04-05T14:15:22Z"
  },
  {
    _id: "raw-3",
    propertyId: "kharghar-valley-shilp",
    propertySlug: "valley-shilp-kharghar",
    name: "Rohit Mehta",
    city: "Pune",
    role: "Former Resident",
    ratings: {
      connectivity: 3,
      lifestyle: 4,
      safety: 3,
      environment: 5
    },
    like: "Kharghar feels like a hill station during the monsoons. The massive central park and golf course nearby provide an unmatched environment in Navi Mumbai. Great cafes and wide roads make driving a pleasure. Truly feels like a planned modern city.",
    dislike: "Public transport within Kharghar inner nodes is lacking. Finding auto-rickshaws late at night is difficult, and the walk to the station is too long. Some nodes still suffer from water scarcity during the summer months, which is quite frustrating for long-term residents.",
    status: "rejected",
    createdAt: "2026-04-01T09:12:45Z"
  }
];

const ReviewManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals / Dropdowns / Focus state
  const [selectedReview, setSelectedReview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showPerPageDropdown, setShowPerPageDropdown] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState('down');
  const [dropdownCoords, setDropdownCoords] = useState({ top: 0, left: 0 });
  
  const searchInputRef = useRef(null);
  const perPageRef = useRef(null);
  const dropdownRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeTab]);

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
      if (perPageRef.current && !perPageRef.current.contains(event.target)) {
        setShowPerPageDropdown(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setOpenDropdownId(null);
    };
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, []);

  const handleMouseEnter = (e, reviewId) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    
    const rect = e.currentTarget.getBoundingClientRect();
    const availableSpaceBelow = window.innerHeight - rect.bottom;
    const dropdownHeight = 250; 
    const side = (availableSpaceBelow < dropdownHeight && rect.top > dropdownHeight) ? 'up' : 'down';
    
    setDropdownPosition(side);
    setDropdownCoords({
      top: side === 'up' ? rect.top + window.scrollY : rect.bottom + window.scrollY,
      left: rect.right + window.scrollX
    });
    setOpenDropdownId(reviewId);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setOpenDropdownId(null);
    }, 150);
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/reviews');
      if (response.data && (Array.isArray(response.data) ? response.data.length > 0 : response.data.reviews?.length > 0)) {
        setReviews(Array.isArray(response.data) ? response.data : response.data.reviews || []);
      } else {
        setReviews(mockReviews);
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      setReviews(mockReviews);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await api.patch(`/admin/reviews/${id}/status`, { status: newStatus });
      setReviews(prev => prev.map(rev => 
        rev._id === id || rev.id === id ? { ...rev, status: newStatus } : rev
      ));
      toast.success(`Review ${newStatus === 'approved' ? 'approved' : 'rejected'} successfully!`);
    } catch (error) {
      toast.error(`Failed to update review status.`);
      console.error("Update error", error);
    }
  };

  const handleDelete = (id, name) => {
    toast((t) => (
      <div className="flex flex-col gap-4 p-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center shrink-0">
            <Trash2 size={20} />
          </div>
          <div>
            <p className="font-bold text-slate-900 text-left">Remove Review from: {name}?</p>
            <p className="text-xs text-slate-500 mt-0.5 text-left">This will permanently delete it.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <button
            onClick={async () => {
              try {
                await api.delete(`/admin/reviews/${id}`);
                setReviews(prev => prev.filter(rev => rev._id !== id && rev.id !== id));
                toast.dismiss(t.id);
                toast.success('Review deleted successfully!');
                if (selectedReview && (selectedReview._id === id || selectedReview.id === id)) {
                  setIsModalOpen(false);
                }
              } catch (error) {
                toast.error('Failed to delete review!');
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
  };

  const calculateAverageRating = (ratings) => {
    if (!ratings) return 0;
    const { connectivity = 0, lifestyle = 0, safety = 0, environment = 0 } = ratings;
    return ((connectivity + lifestyle + safety + environment) / 4).toFixed(1);
  };

  const filteredReviews = reviews.filter(rev => {
    const matchesTab = activeTab === 'all' || rev.status?.toLowerCase() === activeTab.toLowerCase();
    const matchesSearch = 
      rev.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      rev.propertySlug?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rev.propertyId?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Header */}
      <div className="flex flex-col min-[427px]:flex-row min-[427px]:items-center justify-between gap-4">
        <div className="text-left">
          <h1 className="text-2xl font-bold text-slate-900 max-[426px]:text-center max-[426px]:text-3xl">Review Management</h1>
          <p className="text-slate-500 max-[426px]:hidden">Moderate property and locality reviews submitted by users.</p>
        </div>
      </div>

      {/* Tabs & Filters */}
      <div className="flex flex-col nav:flex-row nav:items-center justify-between gap-6">
        <div className="flex items-center bg-white p-1 rounded-xl border border-slate-100 w-full nav:w-fit overflow-x-auto no-scrollbar shrink-0">
          {['all', 'pending', 'approved', 'rejected'].map((tab) => (
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
                placeholder="Search by name or property..."
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

      {/* Data Table */}
      <div className="ag-card">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-500 uppercase tracking-wider text-xs font-bold whitespace-nowrap">
              <tr>
                <th className="px-6 py-4 min-w-[300px]">Reviewer</th>
                <th className="px-6 py-4 w-[160px]">Property</th>
                <th className="px-6 py-4 w-[140px]">Avg Rating</th>
                <th className="px-6 py-4 w-[160px]">Status</th>
                <th className="px-6 py-4 w-[140px]">Date</th>
                <th className="px-6 py-4 text-right w-[160px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading && reviews.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">Loading reviews...</td>
                </tr>
              ) : paginatedReviews.length > 0 ? (
                paginatedReviews.map((review) => {
                  const id = review._id || review.id;
                  const date = review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'N/A';
                  return (
                    <tr key={id} className={`hover:bg-slate-50/50 transition-colors group ${openDropdownId === id ? 'relative z-[60]' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-6">
                          <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold shrink-0">
                            {review.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="text-left">
                            <h4 className="font-bold text-semibold text-black text-base leading-tight">{review.name}</h4>
                            <p className="text-sm text-slate-400">{review.role} • {review.city}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-slate-700 whitespace-nowrap">{review.propertyId || review.propertySlug || 'Unknown'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center space-x-1 bg-amber-50 text-amber-600 px-3 py-1 rounded-lg w-fit border border-amber-100">
                          <Star size={14} className="fill-current" />
                          <span className="font-bold text-xs">{calculateAverageRating(review.ratings)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                         <div className="flex items-center space-x-2">
                           <div className={`w-2 h-2 rounded-full ${review.status === 'approved' ? 'bg-emerald-500' : review.status === 'rejected' ? 'bg-red-500' : 'bg-amber-400 animate-pulse'}`} />
                           <span className={`text-xs font-bold ${review.status === 'approved' ? 'text-emerald-600' : review.status === 'rejected' ? 'text-red-600' : 'text-amber-600'}`}>
                             {review.status ? review.status.charAt(0).toUpperCase() + review.status.slice(1) : 'Pending'}
                           </span>
                         </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-500 whitespace-nowrap">{date}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-1">
                           <button
                             onClick={() => handleDelete(id, review.name)}
                             title="Delete"
                             className="p-2 text-slate-500 hover:text-red-500 transition-colors hover:bg-white rounded-lg border border-transparent hover:border-slate-100 cursor-pointer"
                           >
                             <Trash2 size={18} />
                           </button>
                           <div className="flex items-center justify-end">
                             <button
                               onMouseEnter={(e) => handleMouseEnter(e, id)}
                               onMouseLeave={handleMouseLeave}
                               onClick={(e) => {
                                 e.stopPropagation();
                                 setOpenDropdownId(openDropdownId === id ? null : id);
                               }}
                               className={`p-2 transition-colors rounded-lg cursor-pointer ${openDropdownId === id ? 'bg-slate-100 text-black' : 'text-slate-400 hover:text-slate-800'}`}
                               title="Actions"
                             >
                               <MoreVertical size={18} />
                             </button>
                           </div>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center">
                      <div className="p-4 bg-slate-50 rounded-full mb-3 text-slate-500">
                        <Search size={32} />
                      </div>
                      <p className="font-semibold text-black mb-1">No reviews found</p>
                      <p className="text-base text-slate-500">We couldn't find any reviews matching "{searchTerm}"</p>
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
            {openDropdownId && (() => {
              const review = paginatedReviews.find(r => (r._id || r.id) === openDropdownId);
              if (!review) return null;
              
              return (
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
                        left: dropdownCoords.left - 224,
                        transformOrigin: dropdownPosition === 'up' ? 'bottom right' : 'top right',
                      }}
                      className={`pointer-events-auto w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden py-2 text-left ${dropdownPosition === 'up' ? '-translate-y-full' : ''}`}
                    >
                      <div className="px-4 py-2 border-b border-slate-50 mb-1">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Review Actions</p>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedReview(review);
                          setIsModalOpen(true);
                          setOpenDropdownId(null);
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-2.5 font-semibold text-sm text-slate-600 hover:bg-slate-50 hover:text-black transition-colors cursor-pointer text-left"
                      >
                        <Eye size={16} />
                        <span>View Details</span>
                      </button>

                      <div className="px-4 py-2 border-y border-slate-50 my-1 bg-slate-50/50">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Change Status</p>
                      </div>

                      {['approved', 'pending', 'rejected'].map((statusOption) => (
                        <button
                          key={statusOption}
                          onClick={() => {
                            handleUpdateStatus(openDropdownId, statusOption);
                            setOpenDropdownId(null);
                          }}
                          className={`w-full flex items-center justify-between px-4 py-2.5 font-semibold text-sm capitalize transition-colors cursor-pointer text-left
                            ${review.status === statusOption
                              ? 'text-primary font-bold bg-primary/5'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-black'}`}
                        >
                          <span className="flex items-center">
                            {statusOption === 'approved' && <CheckCircle2 size={14} className="mr-2 text-emerald-500" />}
                            {statusOption === 'rejected' && <XCircle size={14} className="mr-2 text-red-500" />}
                            {statusOption === 'pending' && <Clock size={14} className="mr-2 text-amber-500" />}
                            {statusOption}
                          </span>
                          {review.status === statusOption && <CheckCircle2 size={14} className="text-primary" />}
                        </button>
                      ))}
                    </motion.div>
                  </div>
                </div>
              );
            })()}
          </AnimatePresence>,
          document.body
        )}

        {/* Pagination */}
        <div className="px-6 py-6 bg-slate-50/50 border-t border-slate-100 flex flex-col nav:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-8 w-full nav:w-auto">
            <p className="text-sm text-black font-medium whitespace-nowrap">
              Showing <span className="text-primary font-bold">{Math.min((currentPage - 1) * itemsPerPage + 1, filteredReviews.length || 1)}</span> to <span className="text-primary font-bold">{Math.min(currentPage * itemsPerPage, filteredReviews.length)}</span> of <span className="text-primary font-bold">{filteredReviews.length}</span> reviews
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
                        {itemsPerPage === val && <CheckCircle2 size={14} className="text-primary" />}
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
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.max(totalPages, 1)))}
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

      {/* Detail View Modal */}
      <AnimatePresence>
        {isModalOpen && selectedReview && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Review Details</h2>
                  <p className="text-sm text-slate-500">Property: <span className="font-bold">{selectedReview.propertyId || selectedReview.propertySlug}</span></p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors cursor-pointer text-slate-500"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto space-y-6 text-left">
                {/* Reviewer Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Reviewer Name</p>
                    <p className="text-slate-900 font-bold">{selectedReview.name}</p>
                    <p className="text-xs text-slate-500 font-semibold">{selectedReview.role} • {selectedReview.city}</p>
                  </div>
                  <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100">
                    <p className="text-[10px] font-bold text-amber-600/70 uppercase tracking-wider mb-1">Ratings Sub-Scores</p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 font-semibold">
                      <div>Connectivity: <span className="font-bold text-black">{selectedReview.ratings?.connectivity || 0}</span></div>
                      <div>Lifestyle: <span className="font-bold text-black">{selectedReview.ratings?.lifestyle || 0}</span></div>
                      <div>Safety: <span className="font-bold text-black">{selectedReview.ratings?.safety || 0}</span></div>
                      <div>Environment: <span className="font-bold text-black">{selectedReview.ratings?.environment || 0}</span></div>
                    </div>
                  </div>
                </div>

                {/* Likes / Dislikes */}
                <div className="space-y-4">
                  <div className="bg-emerald-50/50 border border-emerald-100 p-5 rounded-2xl">
                    <h3 className="text-emerald-800 font-bold flex items-center mb-2 text-sm">
                       <CheckCircle2 size={16} className="mr-2" /> What they liked
                    </h3>
                    <p className="text-slate-700 leading-relaxed text-sm whitespace-pre-wrap font-medium">
                      {selectedReview.like || "No text provided."}
                    </p>
                  </div>
                  <div className="bg-red-50/50 border border-red-100 p-5 rounded-2xl">
                    <h3 className="text-red-800 font-bold flex items-center mb-2 text-sm">
                       <XCircle size={16} className="mr-2" /> What they disliked
                    </h3>
                    <p className="text-slate-700 leading-relaxed text-sm whitespace-pre-wrap font-medium">
                      {selectedReview.dislike || "No text provided."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Footer / Actions */}
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center gap-3 justify-end">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer text-sm"
                >
                  Close
                </button>
                {selectedReview.status !== 'rejected' && (
                  <button
                    onClick={() => {
                      handleUpdateStatus(selectedReview._id || selectedReview.id, 'rejected');
                      setIsModalOpen(false);
                    }}
                    className="flex items-center px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    <XCircle size={16} className="mr-2" /> Reject
                  </button>
                )}
                {selectedReview.status !== 'approved' && (
                  <button
                    onClick={() => {
                      handleUpdateStatus(selectedReview._id || selectedReview.id, 'approved');
                      setIsModalOpen(false);
                    }}
                    className="flex items-center px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    <CheckCircle2 size={16} className="mr-2" /> Approve
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReviewManagement;
