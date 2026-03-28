import React, { useState } from 'react';
import {
  Save,
  ChevronLeft,
  ChevronRight,
  Info,
  AlignLeft,
  Users,
  IndianRupee,
  MapPin,
  Layers,
  Sparkles,
  Camera,
  Map,
  CheckCircle2,
  Undo2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BasicInfo from './property-form/BasicInfo';
import PropertyDescription from './property-form/PropertyDescription';
import RentalSuitability from './property-form/RentalSuitability';
import Pricing from './property-form/Pricing';
import LocationInfo from './property-form/LocationInfo';
import PropertyDetails from './property-form/PropertyDetails';
import AmenitiesFeatures from './property-form/AmenitiesFeatures';
import ImageUpload from './property-form/ImageUpload';
import NearbyPlaces from './property-form/NearbyPlaces';

const PropertyForm = ({ initialData, onSave }) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState(() => {
    const data = initialData || {};
    return {
      title: data.title || "",
      purpose: data.purpose?.toLowerCase() || "sell",
      propertyType: data.propertyType || data.category?.toLowerCase() || "",
      configuration: data.configuration || "",
      configDetails: data.configDetails || "",
      postedBy: data.postedBy || "owner",
      description: data.description || "",
      suitableFor: data.suitableFor || [],
      availableFrom: data.availableFrom || "",
      price: data.price || "",
      priceType: data.priceType?.toLowerCase() || "fixed",
      pricePerSqft: data.pricePerSqft || "",
      maintenance: data.maintenance || "",
      isReraVerified: data.isReraVerified || false,
      rentPrice: data.rentPrice || "",
      securityDeposit: data.securityDeposit || "",
      address: data.address || "",
      location: data.location || "",
      area: data.area || "",
      furnishing: data.furnishing || "",
      facing: data.facing || "",
      floor: data.floor || "",
      totalFloors: data.totalFloors || "",
      parking: data.parking || "",
      constructionStatus: data.constructionStatus || "",
      age: data.age || "",
      amenities: data.amenities || [],
      features: data.features || [],
      gallery: data.gallery || data.images || [],
      nearbyPlaces: data.nearbyPlaces || [],
    };
  });

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const sections = [
    { id: 'basic', label: 'Basic Info', icon: Info, component: BasicInfo },
    { id: 'description', label: 'Description', icon: AlignLeft, component: PropertyDescription },
    { id: 'rental', label: 'Rental Preferences', icon: Users, component: RentalSuitability, show: formData.purpose === 'rent' },
    { id: 'pricing', label: 'Pricing', icon: IndianRupee, component: Pricing },
    { id: 'location', label: 'Location', icon: MapPin, component: LocationInfo },
    { id: 'details', label: 'Details', icon: Layers, component: PropertyDetails },
    { id: 'amenities', label: 'Amenities', icon: Sparkles, component: AmenitiesFeatures },
    { id: 'gallery', label: 'Gallery', icon: Camera, component: ImageUpload },
    { id: 'nearby', label: 'Nearby', icon: Map, component: NearbyPlaces },
  ];

  const visibleSections = sections.filter(s => s.show !== false);
  const currentIndex = visibleSections.findIndex(s => s.id === activeTab);

  const handleNext = () => {
    if (currentIndex < visibleSections.length - 1) {
      setActiveTab(visibleSections[currentIndex + 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setActiveTab(visibleSections[currentIndex - 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const ActiveComponent = visibleSections.find(s => s.id === activeTab)?.component || BasicInfo;

  return (
    <div className="max-w-6xl mx-auto pb-40">
      {/* Navigation Header */}
      <div className="bg-white/70 backdrop-blur-xl border border-zinc-100 rounded-[32px] p-2 mb-8 shadow-sm flex items-center justify-between overflow-x-auto no-scrollbar scroll-smooth">
        <div className="flex items-center gap-1 p-1">
          {visibleSections.map((section) => {
            const Icon = section.icon;
            const isActive = activeTab === section.id;
            const isCompleted = visibleSections.indexOf(section) < currentIndex;

            return (
              <button
                key={section.id}
                onClick={() => setActiveTab(section.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[13px] font-black transition-all whitespace-nowrap cursor-pointer
                  ${isActive
                    ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20'
                    : isCompleted
                      ? 'text-brand-primary bg-brand-primary/10 hover:bg-brand-primary/20'
                      : 'text-brand-paragraph hover:text-brand-heading hover:bg-zinc-100'}`}
              >
                {isCompleted ? <CheckCircle2 size={16} /> : <Icon size={16} />}
                {section.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative min-h-[600px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.99 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <ActiveComponent
              formData={formData}
              updateFormData={updateFormData}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Sticky Footer Actions */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 z-50">
        <div className="bg-white/80 backdrop-blur-2xl border border-zinc-100/50 rounded-[32px] p-4 shadow-2xl flex items-center justify-between gap-4">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`flex items-center gap-2 px-8 py-4 rounded-2xl text-[14px] font-black text-brand-paragraph hover:text-brand-heading hover:bg-zinc-100 transition-all cursor-pointer ${currentIndex === 0 ? 'invisible' : 'visible'}`}
          >
            <ChevronLeft size={20} />
            Back
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.history.back()}
              className="hidden md:flex items-center gap-2 px-6 py-4 rounded-2xl text-[14px] font-black text-brand-paragraph hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer"
            >
              <Undo2 size={18} />
              Cancel
            </button>

            {currentIndex < visibleSections.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-3 bg-zinc-900 text-white px-10 py-4 rounded-2xl text-[14px] font-black hover:bg-black transition-all cursor-pointer shadow-xl shadow-zinc-900/10 active:scale-95"
              >
                Next Section
                <ChevronRight size={20} />
              </button>
            ) : (
              <button
                onClick={() => onSave(formData)}
                className="flex items-center gap-3 bg-brand-primary text-white px-12 py-4 rounded-2xl text-[14px] font-black hover:bg-brand-primary-dark transition-all cursor-pointer shadow-xl shadow-brand-primary/20 active:scale-95"
              >
                <Save size={20} />
                Publish Property
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyForm;
