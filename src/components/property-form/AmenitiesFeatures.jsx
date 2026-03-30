"use client";
import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Plus, X } from "lucide-react";

const AmenitiesFeatures = ({ formData, updateFormData }) => {
    const [amenityInput, setAmenityInput] = React.useState("");
    const [featureInput, setFeatureInput] = React.useState("");

    const addItem = (listName, value) => {
        if (!value.trim()) return;
        const currentList = formData[listName] || [];
        if (!currentList.includes(value.trim())) {
            updateFormData(listName, [...currentList, value.trim()]);
        }
    };

    const removeItem = (listName, item) => {
        const currentList = formData[listName] || [];
        updateFormData(listName, currentList.filter((i) => i !== item));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-xl border border-zinc-100 rounded-[32px] p-8 max-[426px]:p-4 shadow-sm hover:shadow-md transition-all duration-500"
        >
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                    <Sparkles className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-xl font-black text-zinc-900">Amenities & Features</h2>
                    <p className="text-sm text-zinc-500 font-medium">Highlight the lifestyle perks of your property</p>
                </div>
            </div>

            <div className="space-y-12">
                {/* Amenities */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-[12px] font-black text-brand-paragraph uppercase tracking-widest px-1">Social Amenities</label>
                        <span className="text-[11px] font-bold text-brand-paragraph bg-zinc-100 px-3 py-1.5 rounded-full">
                            {(formData.amenities || []).length} Added
                        </span>
                    </div>

                    <div className="relative group">
                        <input
                            type="text"
                            value={amenityInput}
                            onChange={(e) => setAmenityInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addItem("amenities", amenityInput);
                                    setAmenityInput("");
                                }
                            }}
                            placeholder="Type an amenity and press Enter..."
                            className="w-full bg-zinc-50 border border-brand-muted/50 rounded-2xl px-6 py-4 text-sm font-semibold placeholder:text-brand-muted focus:outline-none focus:ring-1 focus:ring-brand-primary/20 focus:border-brand-primary transition-all pr-24"
                        />
                        <button
                            type="button"
                            onClick={() => {
                                addItem("amenities", amenityInput);
                                setAmenityInput("");
                            }}
                            className="absolute right-2 top-2 bottom-2 px-4 bg-brand-primary text-white rounded-xl text-xs font-bold hover:bg-brand-primary/90 transition-colors flex items-center gap-2 cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            Add
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {(formData.amenities || []).map((item, index) => (
                            <motion.div
                                key={`${item}-${index}`}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-brand-primary/5 border border-brand-primary text-brand-primary px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 group hover:bg-brand-primary/10 transition-colors"
                            >
                                {item}
                                <button
                                    type="button"
                                    onClick={() => removeItem("amenities", item)}
                                    className="p-1 hover:bg-brand-primary/20 rounded-full transition-colors cursor-pointer"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Features */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-[12px] font-black text-zinc-800 uppercase tracking-widest px-1">Property Features</label>
                        <span className="text-[11px] font-bold text-brand-paragraph bg-zinc-100 px-3 py-1.5 rounded-full">
                            {(formData.features || []).length} Added
                        </span>
                    </div>

                    <div className="relative group">
                        <input
                            type="text"
                            value={featureInput}
                            onChange={(e) => setFeatureInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addItem("features", featureInput);
                                    setFeatureInput("");
                                }
                            }}
                            placeholder="Type a feature and press Enter..."
                            className="w-full bg-zinc-50 border border-brand-muted/50 rounded-2xl px-6 py-4 text-sm font-semibold placeholder:text-brand-muted focus:outline-none focus:ring-1 focus:ring-brand-primary/20 focus:border-brand-primary transition-all pr-24"
                        />
                        <button
                            type="button"
                            onClick={() => {
                                addItem("features", featureInput);
                                setFeatureInput("");
                            }}
                            className="absolute right-2 top-2 bottom-2 px-4 bg-brand-primary text-white rounded-xl text-xs font-bold hover:bg-brand-primary/90 transition-colors flex items-center gap-2 cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            Add
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {(formData.features || []).map((item, index) => (
                            <motion.div
                                key={`${item}-${index}`}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-brand-primary/5 border border-brand-primary text-brand-primary px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 group hover:bg-brand-primary/10 transition-colors"
                            >
                                {item}
                                <button
                                    type="button"
                                    onClick={() => removeItem("features", item)}
                                    className="p-1 hover:bg-brand-primary/20 rounded-full transition-colors cursor-pointer"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default AmenitiesFeatures;
