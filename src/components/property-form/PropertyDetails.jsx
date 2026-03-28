"use client";
import React from "react";
import { motion } from "framer-motion";
import { Layers, Compass, Calendar, Car, Sofa, Ruler, Grid3X3, Home, Hammer, Sparkles, Clock, History, CalendarDays, Check, Layout, Square } from "lucide-react";
import CustomDropdown from "./CustomDropdown";

const PropertyDetails = ({ formData, updateFormData }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-xl border border-zinc-100 rounded-[32px] p-8 shadow-sm hover:shadow-md transition-all duration-500"
        >
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                    <Layers className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-xl font-black text-zinc-900">Property Details</h2>
                    <p className="text-sm text-zinc-500 font-medium">Specific measurements and building features</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Area */}
                <div className="space-y-4 group">
                    <label className="text-[12px] font-black text-brand-paragraph uppercase tracking-widest px-1 group-focus-within:text-brand-primary transition-colors flex items-center gap-2">
                       <Ruler className="w-4 h-4" /> Total Area
                    </label>
                    <div className="relative flex items-center group">
                        <div className="absolute left-5 text-brand-paragraph group-focus-within:text-brand-primary transition-colors">
                           <Square className="w-5 h-5" />
                        </div>
                        <input
                            type="text"
                            placeholder="e.g. 1,200"
                            value={formData.area}
                            onChange={(e) => updateFormData("area", e.target.value)}
                            className="w-full bg-zinc-50/50 border border-brand-muted/50 rounded-2xl pl-14 pr-24 py-4 text-[15px] font-black focus:outline-none focus:border-brand-primary focus:bg-white transition-all placeholder:text-[14px] placeholder:text-brand-muted placeholder:font-semibold"
                        />
                        <div className="absolute right-3 py-1.5 px-3 bg-brand-primary/10 rounded-xl text-brand-primary text-[10px] font-black uppercase tracking-wider">
                           SQ.FT
                        </div>
                    </div>
                </div>

                {/* Furnishing */}
                <CustomDropdown
                    label="Furnishing Status"
                    options={[
                        { value: "unfurnished", label: "Unfurnished" },
                        { value: "semi-furnished", label: "Semi-Furnished" },
                        { value: "furnished", label: "Fully Furnished" },
                    ]}
                    value={formData.furnishing}
                    onChange={(val) => updateFormData("furnishing", val)}
                    icon={<Sofa className="w-5 h-5" />}
                />

                {/* Facing */}
                <CustomDropdown
                    label="Facing Direction"
                    options={[
                        { value: "east", label: "East" },
                        { value: "west", label: "West" },
                        { value: "north", label: "North" },
                        { value: "south", label: "South" },
                        { value: "north-east", label: "North-East" },
                        { value: "north-west", label: "North-West" },
                        { value: "south-east", label: "South-East" },
                        { value: "south-west", label: "South-West" },
                    ]}
                    value={formData.facing}
                    onChange={(val) => updateFormData("facing", val)}
                    icon={<Compass className="w-5 h-5" />}
                />

                {/* Floor Information */}
                <div className="space-y-2 group">
                    <label className="text-[12px] font-black text-brand-paragraph uppercase tracking-widest px-1 group-focus-within:text-brand-primary transition-colors">Floor Number</label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="e.g. 15th"
                            value={formData.floor}
                            onChange={(e) => updateFormData("floor", e.target.value)}
                            className="w-full bg-zinc-50/50 border border-brand-muted/50 rounded-2xl px-5 py-4 text-[14px] font-semibold focus:outline-none focus:border-brand-primary focus:bg-white transition-all placeholder:text-[14px] placeholder:text-brand-muted"
                        />
                    </div>
                </div>

                <div className="space-y-2 group">
                    <label className="text-[12px] font-black text-brand-paragraph uppercase tracking-widest px-1 group-focus-within:text-brand-primary transition-colors">Total Floors</label>
                    <div className="relative">
                        <input
                            type="number"
                            placeholder="e.g. 25"
                            value={formData.totalFloors}
                            onChange={(e) => updateFormData("totalFloors", e.target.value)}
                            className="w-full bg-zinc-50/50 border border-brand-muted/50 rounded-2xl px-5 py-4 text-[14px] font-semibold focus:outline-none focus:border-brand-primary focus:bg-white transition-all placeholder:text-[14px] placeholder:text-brand-muted"
                        />
                    </div>
                </div>

                {/* Parking */}
                <CustomDropdown
                    label="Parking Available"
                    options={[
                        { value: "None", label: "None" },
                        { value: "1 Covered", label: "1 Covered" },
                        { value: "2 Covered", label: "2 Covered" },
                        { value: "1 Open", label: "1 Open" },
                        { value: "2 Open", label: "2 Open" },
                        { value: "3+ Covered", label: "3+ Covered" },
                    ]}
                    value={formData.parking}
                    onChange={(val) => updateFormData("parking", val)}
                    icon={<Car className="w-5 h-5" />}
                />

                {/* Construction Status */}
                {formData.purpose === "sell" && (
                    <div className="space-y-4 md:col-span-2 lg:col-span-3">
                        <label className="text-[12px] font-black text-brand-paragraph uppercase tracking-widest px-1">Construction Status</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[
                                { id: "ready-to-move", label: "Ready to Move", icon: Home, desc: "Immediate possession" },
                                { id: "under-construction", label: "Under Construction", icon: Hammer, desc: "Work in progress" },
                                { id: "new-launch", label: "New Launch", icon: Sparkles, desc: "Newly announced project" }
                            ].map(({ id, label, icon: Icon, desc }) => {
                                const isActive = formData.constructionStatus === id;
                                return (
                                    <button
                                        key={id}
                                        type="button"
                                        onClick={() => updateFormData("constructionStatus", id)}
                                        className={`group relative flex items-center gap-4 p-4 rounded-3xl transition-all duration-300 border-2 text-left cursor-pointer
                                            ${isActive 
                                                ? "bg-brand-primary/5 border-brand-primary" 
                                                : "bg-zinc-50/30 border-zinc-100 hover:border-brand-primary/30 hover:bg-white"}`}
                                    >
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 flex-shrink-0
                                            ${isActive 
                                                ? "bg-brand-primary text-white scale-105 shadow-brand-primary/20" 
                                                : "bg-zinc-100 text-brand-paragraph group-hover:bg-brand-primary/10 group-hover:text-brand-primary"}`}
                                        >
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className={`text-[13px] font-black leading-tight transition-colors
                                                ${isActive ? "text-brand-heading" : "text-brand-paragraph group-hover:text-brand-heading"}`}
                                            >
                                                {label}
                                            </span>
                                            <span className={`text-[12px] font-bold transition-colors
                                                ${isActive ? "text-brand-primary/70" : "text-brand-paragraph/50 group-hover:text-brand-paragraph/70"}`}
                                            >
                                                {desc}
                                            </span>
                                        </div>
                                        {isActive && (
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-brand-primary text-white rounded-full flex items-center justify-center shadow-md animate-in zoom-in duration-300 border-2 border-white">
                                                <Check className="w-3.5 h-3.5" />
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Age of Property */}
                <div className="space-y-4 md:col-span-2 lg:col-span-3">
                    <label className="text-[12px] font-black text-brand-paragraph uppercase tracking-widest px-1">Age of Property</label>
                    <div className="flex p-1.5 bg-brand-muted/10 rounded-[28px] gap-1 relative overflow-hidden">
                        {[
                            { value: "0-1", label: "New (0-1 Yrs)", icon: Sparkles },
                            { value: "1-5", label: "1-5 Years", icon: CalendarDays },
                            { value: "5-10", label: "5-10 Years", icon: History },
                            { value: "10+", label: "10+ Years", icon: Clock }
                        ].map((item) => {
                            const isActive = formData.age === item.value;
                            return (
                                <button 
                                    key={item.value}
                                    type="button"
                                    onClick={() => updateFormData("age", item.value)}
                                    className={`relative flex-1 py-4 rounded-2xl text-[12px] font-black transition-all cursor-pointer flex items-center justify-center gap-2 z-10 cursor-pointer
                                        ${isActive ? "text-white" : "text-brand-paragraph hover:text-brand-heading"}`}
                                >
                                    <item.icon className={`w-4 h-4 transition-colors ${isActive ? "text-white" : "text-brand-paragraph/60"}`} />
                                    <span className="hidden sm:inline">{item.label}</span>
                                    <span className="sm:hidden">{item.value === "10+" ? "10+" : item.value}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-age-bg"
                                            className="absolute inset-0 bg-brand-primary rounded-2xl -z-10"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default PropertyDetails;
