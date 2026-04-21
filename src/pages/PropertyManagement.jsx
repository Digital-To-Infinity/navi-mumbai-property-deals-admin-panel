import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PropertyForm from './AddProperty';
import { toast } from 'react-hot-toast';
import api from '../utils/api';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Monitor,
  CheckCircle,
  Clock,
  Archive,
  MoreVertical,
  Building2,
  X,
  Copy,
  Eye,
  Star,
  Share2,
  ChevronDown
} from 'lucide-react';


const propertiesData = [
  { id: 1, title: 'Luxury Villa in Belapur', location: 'CBD Belapur, Navi Mumbai', price: '₹4.5 Cr', status: 'Active', category: 'Villa', date: '2026-03-20', featured: true },
  { id: 2, title: 'Modern Apartment in Vashi', location: 'Sector 17, Vashi', price: '₹2.8 Cr', status: 'Sold', category: 'Apartment', date: '2026-03-15', featured: false },
  { id: 3, title: 'Studio Flat in Kharghar', location: 'Kharghar, Navi Mumbai', price: '₹65 L', status: 'Draft', category: 'Flat', date: '2026-03-10', featured: false },
  { id: 4, title: 'Penthouse with View', location: 'Nerul, Navi Mumbai', price: '₹8.2 Cr', status: 'Active', category: 'Penthouse', date: '2026-03-05', featured: false },
  { id: 5, title: 'Office Space Belapur', location: 'Belapur Station, Navi Mumbai', price: '₹12 Cr', status: 'Active', category: 'Commercial', date: '2026-02-28', featured: false },
  { id: 6, title: 'Commercial Shop in Seawoods', location: 'Seawoods, Navi Mumbai', price: '₹1.5 Cr', status: 'Active', category: 'Commercial', date: '2026-02-25', featured: false },
  { id: 7, title: '2BHK Apartment in Sanpada', location: 'Section 10, Sanpada', price: '₹1.2 Cr', status: 'Active', category: 'Apartment', date: '2026-02-20', featured: true },
  { id: 8, title: 'Row House in Kopar Khairane', location: 'Sector 5, Kopar Khairane', price: '₹3.4 Cr', status: 'Sold', category: 'House', date: '2026-02-15', featured: false },
  { id: 9, title: '1RK Studio in Airoli', location: 'Airoli, Navi Mumbai', price: '₹45 L', status: 'Active', category: 'Studio', date: '2026-02-10', featured: false },
  { id: 10, title: 'Garden Facing Flat in Ulwe', location: 'Sector 19, Ulwe', price: '₹75 L', status: 'Active', category: 'Apartment', date: '2026-02-05', featured: true },
  { id: 11, title: 'Premium Office Hub', location: 'Turbhe, Navi Mumbai', price: '₹5.5 Cr', status: 'Active', category: 'Commercial', date: '2026-01-30', featured: false },
  { id: 12, title: 'Spacious 3BHK in Kamothe', location: 'Sector 21, Kamothe', price: '₹1.1 Cr', status: 'Draft', category: 'Apartment', date: '2026-01-25', featured: false },
  { id: 13, title: 'Cozy Villa in Ghansoli', location: 'Ghansoli, Navi Mumbai', price: '₹2.1 Cr', status: 'Active', category: 'Villa', date: '2026-01-20', featured: false },
  { id: 14, title: 'Retail Space Nerul', location: 'Nerul East, Navi Mumbai', price: '₹85 L', status: 'Sold', category: 'Commercial', date: '2026-01-15', featured: false },
  { id: 15, title: 'New Launch in Dronagiri', location: 'Dronagiri, Navi Mumbai', price: '₹40 L', status: 'Active', category: 'Apartment', date: '2026-01-10', featured: true },
];

const PropertyManagement = () => {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState('down');
  const [dropdownCoords, setDropdownCoords] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showPerPageDropdown, setShowPerPageDropdown] = useState(false);
  const perPageRef = useRef(null);

  const [searchParams, setSearchParams] = useSearchParams();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isFocused, setIsFocused] = useState(false);

  // Restore form state from URL on load
  useEffect(() => {
    const action = searchParams.get('action');
    const id = searchParams.get('id');

    if (action === 'add') {
      setShowForm(true);
      setEditingProperty(null);
    } else if (action === 'edit' && id) {
      const prop = properties.find(p => p.id === parseInt(id));
      if (prop) {
        setEditingProperty(prop);
        setShowForm(true);
      }
    } else {
      setShowForm(false);
      setEditingProperty(null);
    }
  }, [searchParams, properties]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setOpenDropdownId(null);
    };
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
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

  // Reset to first page when filtering or searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeTab]);

  const handleMouseEnter = (e, property) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    
    const rect = e.currentTarget.getBoundingClientRect();
    const availableSpaceBelow = window.innerHeight - rect.bottom;
    const dropdownHeight = 400; 
    const side = (availableSpaceBelow < dropdownHeight && rect.top > dropdownHeight) ? 'up' : 'down';
    
    setDropdownPosition(side);
    setDropdownCoords({
      top: side === 'up' ? rect.top + window.scrollY : rect.bottom + window.scrollY,
      left: rect.right + window.scrollX
    });
    setOpenDropdownId(property.id);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setOpenDropdownId(null);
    }, 150);
  };

  const handleStatusChange = (id, newStatus) => {
    setProperties(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
    toast.success(`Property status updated to ${newStatus}`);
    setOpenDropdownId(null);
  };

  const handleDuplicate = (property) => {
    const duplicatedProperty = {
      ...property,
      id: Math.max(0, ...properties.map(p => p.id)) + 1,
      title: `${property.title} (Copy)`,
      date: new Date().toISOString().split('T')[0],
    };
    setProperties(prev => [duplicatedProperty, ...prev]);
    toast.success('Property duplicated successfully!');
    setOpenDropdownId(null);
  };
  const handleToggleFeatured = (id) => {
    const property = properties.find(p => p.id === id);
    if (!property) return;

    const newState = !property.featured;
    setProperties(prev => prev.map(p => p.id === id ? { ...p, featured: newState } : p));
    toast.success(newState ? 'Marked as Featured' : 'Removed from Featured');
    setOpenDropdownId(null);
  };

  const handleShare = (id) => {
    const propertyLink = `https://navimumbaipropertydeals.com/property/${id}`;
    navigator.clipboard.writeText(propertyLink).then(() => {
      toast.success('Listing link copied to clipboard!');
    });
    setOpenDropdownId(null);
  };

  const handleSave = async (data) => {
    try {
      const formData = new FormData();
      
      // Step 1: Append all basic fields
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'gallery' && key !== 'amenities' && key !== 'features' && key !== 'suitableFor' && key !== 'nearbyPlaces') {
          formData.append(key, value);
        }
      });

      // Step 2: Append arrays as JSON strings
      formData.append('amenities', JSON.stringify(data.amenities || []));
      formData.append('features', JSON.stringify(data.features || []));
      formData.append('suitableFor', JSON.stringify(data.suitableFor || []));
      formData.append('nearbyPlaces', JSON.stringify(data.nearbyPlaces || []));

      // Step 3: Handle Gallery (Images)
      if (data.gallery && data.gallery.length > 0) {
        const existingImages = [];
        data.gallery.forEach((img) => {
          if (img.file) {
            // New file to upload - MUST use 'galleryImages' key as per backend
            formData.append('galleryImages', img.file);
          } else if (typeof img === 'string') {
            // Existing image URL
            existingImages.push(img);
          }
        });
        formData.append('existingGallery', JSON.stringify(existingImages));
      }

      toast.loading(editingProperty ? 'Updating property...' : 'Publishing property...', { id: 'saving-property' });

      let response;
      if (editingProperty) {
        response = await api.put(`/admin/properties/${editingProperty.id || editingProperty._id}`, formData);
      } else {
        response = await api.post('/admin/properties', formData);
      }

      toast.dismiss('saving-property');

      if (response.data?.success !== false) {
        toast.success(editingProperty ? 'Property updated successfully!' : 'Property published successfully!');
        setSearchParams({});
        setShowForm(false);
        setEditingProperty(null);
        fetchProperties(); // We should implement this to refresh our list
      }
    } catch (error) {
      toast.dismiss('saving-property');
      console.error('Save property error:', error);
      toast.error(error.response?.data?.message || 'Failed to save property');
    }
  };

  const fetchProperties = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/admin/properties');
      if (response.data) {
        setProperties(response.data.data || response.data || []);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      // Fallback to local data if API fails or is not yet ready
      // setProperties(propertiesData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleDelete = (id) => {
    toast((t) => (
      <div className="flex flex-col gap-4 p-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center shrink-0">
            <Trash2 size={20} />
          </div>
          <div>
            <p className="font-bold text-slate-900">Confirm Delete Property?</p>
            <p className="text-xs text-slate-500 mt-0.5">This action cannot be undone.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <button
            onClick={() => {
              setProperties(prev => prev.filter(p => p.id !== id));
              toast.dismiss(t.id);
              toast.success('Property deleted successfully!');
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
  };

  const filteredProperties = properties.filter(prop => {
    const matchesTab = activeTab === 'all' || prop.status.toLowerCase() === activeTab.toLowerCase();
    const matchesSearch =
      prop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (prop.category && prop.category.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesTab && matchesSearch;
  });

  const totalItems = filteredProperties.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredProperties.slice(startIndex, startIndex + itemsPerPage);

  const selectedProperty = currentItems.find(p => p.id === openDropdownId);

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <span className="ag-badge ag-badge-published"><CheckCircle size={12} className="mr-1" /> Active</span>;
      case 'sold':
        return <span className="ag-badge bg-blue-50 text-blue-700 border-blue-100"><Monitor size={12} className="mr-1" /> Sold</span>;
      case 'draft':
        return <span className="ag-badge ag-badge-draft"><Clock size={12} className="mr-1" /> Draft</span>;
      case 'archived':
        return <span className="ag-badge bg-red-50 text-red-700 border-red-100"><Archive size={12} className="mr-1" /> Archived</span>;
      default:
        return <span className="ag-badge bg-slate-50 text-slate-700 border-slate-100"><Archive size={12} className="mr-1" /> {status}</span>;
    }
  };

  if (showForm) {
    return (
      <div className="animate-fade-in relative">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{editingProperty ? 'Edit Property' : 'Add New Property'}</h1>
            <p className="text-slate-500 mt-2">Fill in the details below to list a new property.</p>
          </div>
          <button
            onClick={() => { setSearchParams({}); }}
            className={`
              transition-all duration-300 cursor-pointer flex items-center justify-center
              ${windowWidth <= 426
                ? 'absolute -top-4 -right-4 z-[100] w-10 h-10 bg-white border border-slate-200 rounded-full shadow-lg text-slate-500 hover:text-red-500 hover:border-red-100 hover:bg-red-50 active:scale-90 bg-white/80 backdrop-blur-md'
                : 'text-slate-500 hover:text-black font-semibold'}
            `}
          >
            {windowWidth <= 426 ? <X size={20} strokeWidth={2.5} /> : 'Cancel'}
          </button>
        </div>
        <PropertyForm
          initialData={editingProperty}
          onSave={handleSave}
          onCancel={() => { setSearchParams({}); }}
        />
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Header */}
      <div className="flex flex-col min-[427px]:flex-row min-[427px]:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl max-[426px]:text-3xl max-[426px]:mb-4 max-[426px]:text-center font-bold text-slate-900">Property Management</h1>
          <p className="text-slate-500 hidden sm:block">Manage your real estate listings, status, and pricing.</p>
        </div>
        <button
          onClick={() => setSearchParams({ action: 'add' })}
          className="ag-button flex items-center justify-center space-x-2 w-full min-[427px]:w-auto cursor-pointer whitespace-nowrap"
        >
          <Plus size={20} />
          <span>Add Property</span>
        </button>
      </div>

      {/* Tabs & Filters */}
      <div className="flex flex-col nav:flex-row nav:items-center justify-between gap-6">
        <div className="flex items-center bg-white p-1 rounded-xl border border-slate-100 w-full nav:w-fit overflow-x-auto no-scrollbar shrink-0">
          {['all', 'active', 'sold', 'draft', 'archived'].map((tab) => (
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
                placeholder="Search by title or location..."
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

      {/* Table */}
      <div className="ag-card overflow-visible">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Property Details</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Published</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {currentItems.length > 0 ? (
                currentItems.map((property) => (
                  <tr key={property.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                          <div className="w-full h-full bg-primary/5 flex items-center justify-center text-primary">
                            <Building2 size={24} />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="text-base font-bold text-semibold truncate max-w-[250px]">{property.title}</p>
                            {property.featured && (
                              <Star size={14} className="fill-amber-400 text-amber-400 shrink-0" title="Featured" />
                            )}
                          </div>
                          <p className="text-sm text-slate-500">{property.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(property.status)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-700 font-medium">{property.category}</span>
                    </td>
                    <td className="px-6 max-[426px]:px-2 py-4">
                      <span className="text-sm font-semibold text-black">{property.price}</span>
                    </td>
                    <td className="px-6 max-[426px]:px-2 py-4">
                      <span className="text-sm text-slate-600 font-medium">{property.date}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => { setSearchParams({ action: 'edit', id: property.id.toString() }); }}
                          className="p-2 text-slate-500 hover:text-black transition-colors hover:bg-white rounded-lg border border-transparent hover:border-slate-100 cursor-pointer"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(property.id)}
                          className="p-2 text-slate-500 hover:text-red-500 transition-colors hover:bg-white rounded-lg border border-transparent hover:border-slate-100 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                        <div className="flex items-center justify-end">
                          <button
                            onMouseEnter={(e) => handleMouseEnter(e, property)}
                            onMouseLeave={handleMouseLeave}
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDropdownId(openDropdownId === property.id ? null : property.id);
                            }}
                            className={`p-2 transition-colors rounded-lg cursor-pointer ${openDropdownId === property.id ? 'bg-slate-100 text-black' : 'text-slate-400 hover:text-slate-800'}`}
                            title="Action"
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
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center">
                      <div className="p-4 bg-slate-50 rounded-full mb-3 text-slate-500">
                        <Search size={32} />
                      </div>
                      <p className="font-semibold text-black mb-1">No properties found</p>
                      <p className="text-base text-slate-500">We couldn't find any properties matching "{searchTerm}"</p>
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
            {openDropdownId && selectedProperty && (
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
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Quick Actions</p>
                    </div>
                    <button className="w-full flex items-center space-x-3 px-4 py-2.5 font-semibold text-sm text-slate-600 hover:bg-slate-50 hover:text-black transition-colors cursor-pointer text-left">
                      <Eye size={16} />
                      <span>Preview Listing</span>
                    </button>
                    <button
                      onClick={() => handleShare(selectedProperty.id)}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 font-semibold text-sm text-slate-600 hover:bg-slate-50 hover:text-black transition-colors cursor-pointer text-left"
                    >
                      <Share2 size={16} />
                      <span>Share Listing</span>
                    </button>
                    <button
                      onClick={() => handleDuplicate(selectedProperty)}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 font-semibold text-sm text-slate-600 hover:bg-slate-50 hover:text-black transition-colors cursor-pointer text-left"
                    >
                      <Copy size={16} />
                      <span>Duplicate Property</span>
                    </button>
                    <button
                      onClick={() => handleToggleFeatured(selectedProperty.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-2.5 font-semibold text-sm transition-colors cursor-pointer text-left
                        ${selectedProperty.featured ? 'text-amber-600 bg-amber-50/50 hover:bg-amber-100' : 'text-slate-600 hover:bg-slate-50 hover:text-black'}`}
                    >
                      <Star size={16} className={selectedProperty.featured ? 'fill-current' : ''} />
                      <span>{selectedProperty.featured ? 'Remove from Featured' : 'Mark as Featured'}</span>
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedProperty.id, 'Archived')}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 font-semibold text-sm text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer text-left"
                    >
                      <Archive size={16} />
                      <span>Archive Property</span>
                    </button>

                    <div className="px-4 py-2 border-y border-slate-50 my-1 bg-slate-50/50">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Change Status</p>
                    </div>
                    {['Active', 'Sold', 'Draft'].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(selectedProperty.id, status)}
                        className={`w-full flex items-center justify-between px-4 py-2.5 font-semibold text-sm transition-colors cursor-pointer text-left
                          ${selectedProperty.status === status
                            ? 'text-primary font-bold bg-primary/5'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-black'}`}
                      >
                        <span>{status}</span>
                        {selectedProperty.status === status && <CheckCircle size={14} />}
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
              Showing <span className="text-primary font-bold">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-primary font-bold">{Math.min(currentPage * itemsPerPage, filteredProperties.length)}</span> of <span className="text-primary font-bold">{filteredProperties.length}</span> properties
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

export default PropertyManagement;
