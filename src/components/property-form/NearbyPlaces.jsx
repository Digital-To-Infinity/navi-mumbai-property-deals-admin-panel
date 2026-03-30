"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation, Plus, MapPin, X, Map, School, Hospital, Train, ShoppingCart, ShoppingBag, Landmark, Utensils } from "lucide-react";
import CustomDropdown from "./CustomDropdown";

const CATEGORIES = [
    { value: "station", label: "Station", icon: Train, color: "bg-blue-500" },
    { value: "airport", label: "Airport", icon: Navigation, color: "bg-indigo-500" },
    { value: "school", label: "School", icon: School, color: "bg-amber-500" },
    { value: "hospital", label: "Hospital", icon: Hospital, color: "bg-emerald-500" },
    { value: "market", label: "Market", icon: ShoppingCart, color: "bg-violet-500" },
    { value: "mall", label: "Mall", icon: ShoppingBag, color: "bg-pink-500" },
    { value: "park", label: "Park", icon: Landmark, color: "bg-green-500" },
    { value: "restaurant", label: "Restaurant", icon: Utensils, color: "bg-orange-500" },
    { value: "bank", label: "Bank/ATM", icon: Landmark, color: "bg-cyan-500" },
];

const NearbyPlaces = ({ formData, updateFormData }) => {
    const [selectedCategory, setSelectedCategory] = useState("");
    const [placeName, setPlaceName] = useState("");
    const [distance, setDistance] = useState("");

    const handleAdd = () => {
        if (!selectedCategory || !placeName || !distance) return;

        const newItem = {
            category: selectedCategory,
            name: placeName,
            distance: distance,
        };

        const currentList = formData.nearbyPlaces || [];
        updateFormData("nearbyPlaces", [...currentList, newItem]);

        // Reset inputs
        setPlaceName("");
        setDistance("");
    };

    const removePlace = (index) => {
        const currentList = formData.nearbyPlaces || [];
        updateFormData("nearbyPlaces", currentList.filter((_, i) => i !== index));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-xl border border-zinc-100 rounded-[32px] p-8 max-[426px]:p-4 shadow-sm hover:shadow-md transition-all duration-500"
        >
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                    <MapPin className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-xl font-black text-zinc-900">Nearby Landmarks</h2>
                    <p className="text-sm text-zinc-500 font-medium">Highlight key locations around your property</p>
                </div>
            </div>

            <div className="space-y-8">
                {/* Add Landmark Form */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-zinc-50 p-6 max-[426px]:p-3 rounded-3xl border border-dashed border-zinc-200">
                    <div className="md:col-span-1">
                        <CustomDropdown
                            label="Category"
                            options={CATEGORIES}
                            value={selectedCategory}
                            onChange={setSelectedCategory}
                            placeholder="Select"
                        />
                    </div>

                    <div className="md:col-span-1 space-y-2 group">
                        <label className="text-[12px] font-black text-brand-paragraph uppercase tracking-widest px-1">Place Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Kharghar Stn"
                            value={placeName}
                            onChange={(e) => setPlaceName(e.target.value)}
                            className="w-full h-[53px] bg-white border border-brand-muted/30 rounded-2xl px-5 py-4 text-[14px] font-semibold focus:outline-none focus:border-brand-primary transition-all"
                        />
                    </div>

                    <div className="md:col-span-1 space-y-2 group">
                        <label className="text-[12px] font-black text-brand-paragraph uppercase tracking-widest px-1">Distance (KM)</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="e.g. 1.2"
                                value={distance}
                                onChange={(e) => setDistance(e.target.value)}
                                className="w-full h-[53px] bg-white border border-brand-muted/30 rounded-2xl px-5 py-4 text-[14px] font-semibold focus:outline-none focus:border-brand-primary pr-12 transition-all"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-brand-muted">KM</span>
                        </div>
                    </div>

                    <div className="md:col-span-1 flex flex-col space-y-2">
                        <label className="text-[12px] font-black opacity-0 max-md:hidden uppercase tracking-widest px-1">Add Landmark</label>
                        <button
                            type="button"
                            onClick={handleAdd}
                            disabled={!selectedCategory || !placeName || !distance}
                            className="w-full h-[53px] bg-brand-primary text-white rounded-2xl text-[12px] font-black uppercase tracking-widest hover:bg-brand-primary/90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-brand-primary/20 disabled:opacity-50 disabled:shadow-none"
                        >
                            <Plus className="w-4 h-4" /> Add
                        </button>
                    </div>
                </div>

                {/* Landmarks List */}
                <div className="flex flex-wrap max-[426px]:flex-col gap-4">
                    <AnimatePresence>
                        {(formData.nearbyPlaces || []).map((place, index) => {
                            const cat = CATEGORIES.find(c => c.value === place.category);
                            const Icon = cat?.icon || Map;

                            return (
                                <motion.div
                                    key={`${place.name}-${index}`}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="relative bg-white border border-zinc-100 p-4 rounded-3xl flex items-center gap-4 shadow-sm hover:shadow-md transition-all group w-fit max-[426px]:w-full"
                                >
                                    <div className={`w-12 h-12 rounded-2xl ${cat?.color || 'bg-zinc-500'} flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-zinc-200/50`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div className="flex flex-col pr-8">
                                        <span className="text-[13px] font-black text-zinc-900 group-hover:text-brand-primary transition-colors">{place.name}</span>
                                        <span className="text-[11px] font-bold text-zinc-500">{place.distance} KM Distance</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removePlace(index)}
                                        className="absolute -top-2 -right-2 w-7 h-7 bg-white text-zinc-400 hover:text-red-500 rounded-full flex items-center justify-center shadow-md border hover:border-red-500/20 transition-all cursor-pointer"
                                    >
                                        <X size={14} />
                                    </button>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>

                    {(formData.nearbyPlaces || []).length === 0 && (
                        <div className="w-full text-center py-10 bg-zinc-50 rounded-3xl border border-dashed border-zinc-200">
                            <Map className="w-10 h-10 text-zinc-200 mx-auto mb-2" />
                            <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">No landmarks added yet</p>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default NearbyPlaces;
