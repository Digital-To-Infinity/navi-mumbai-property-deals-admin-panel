"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, User, CheckCircle2, Building2, LayoutGrid, Briefcase, Building, Check, Tag, Key } from "lucide-react";
import CustomDropdown from "./CustomDropdown";

const CONFIG_MAPPING = {
    residential: {
        label: "Residential",
        options: [
            { value: "1bhk", label: "1BHK" },
            { value: "2bhk", label: "2BHK" },
            { value: "3bhk", label: "3BHK" },
            { value: "4bhk", label: "4BHK" },
            { value: "5bhk+", label: "5BHK+" },
        ],
    },
    commercial: {
        label: "Commercial",
        options: [
            { value: "office", label: "Office" },
            { value: "shops", label: "Shops" },
            { value: "factory", label: "Factory" },
            { value: "warehouses", label: "Warehouses" },
            { value: "showrooms", label: "Showrooms" },
            { value: "industrial-plot", label: "Industrial Plot" },
        ],
    },
    plot: {
        label: "Plot",
        options: [
            { value: "plots-navi-mumbai", label: "Plots in Navi Mumbai" },
            { value: "freehold-plots", label: "Freehold Plots" },
            { value: "authority-plots", label: "Authority Plots" },
            { value: "mcgm-authority-plots", label: "MCGM Authority Plots" },
            { value: "mmrda-authority-plots", label: "MMRDA Authority Plots" },
        ],
    },
    "paying-guest": {
        label: "PG/Co-Living",
        options: [
            { value: "pg-navi-mumbai", label: "PG in Navi Mumbai" },
            { value: "co-living-spaces", label: "Co-Living Spaces" },
        ],
    },
};

const BasicInfo = ({ formData, updateFormData }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-xl border border-zinc-100 rounded-[32px] p-8 shadow-sm hover:shadow-md transition-all duration-500"
        >
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                    <Info className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-xl font-black text-brand-heading">Basic Information</h2>
                    <p className="text-sm text-brand-paragraph font-medium">Start with the essentials of your property</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Title */}
                <div className="space-y-2 group">
                    <label className="text-[12px] font-black text-brand-paragraph uppercase tracking-widest px-1 group-focus-within:text-brand-primary transition-colors">Property Title</label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="e.g. Luxury 3 BHK Sky Residence"
                            value={formData.title}
                            onChange={(e) => updateFormData("title", e.target.value)}
                            className="w-full bg-zinc-50/50 border border-brand-muted/50 rounded-2xl px-5 py-4 text-[14px] font-semibold focus:outline-none focus:border-brand-primary focus:bg-white transition-all placeholder:text-[14px] placeholder:text-brand-muted"
                        />
                        {formData.title?.length > 10 && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-primary">
                                <CheckCircle2 className="w-5 h-5" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Purpose Toggle */}
                <div className="space-y-2">
                    <label className="text-[12px] font-black text-brand-paragraph uppercase tracking-widest px-1">I want to</label>
                    <div className="flex p-1.5 bg-brand-muted/10 rounded-2xl gap-1 relative overflow-hidden">
                        {[
                            { id: "sell", label: "List for Sale", icon: Tag },
                            { id: "rent", label: "List for Rent", icon: Key }
                        ].map(({ id, label, icon: Icon }) => {
                            const isActive = formData.purpose === id;
                            return (
                                <button
                                    key={id}
                                    type="button"
                                    onClick={() => {
                                        updateFormData("purpose", id);
                                        // Reset propertyType if it's invalid for the new purpose
                                        if (id === "sell" && formData.propertyType === "paying-guest") {
                                            updateFormData("propertyType", "");
                                        } else if (id === "rent" && formData.propertyType === "plot") {
                                            updateFormData("propertyType", "");
                                        }
                                    }}
                                    className={`relative flex-1 py-3.5 rounded-xl text-[13px] font-black transition-all capitalize cursor-pointer flex items-center justify-center gap-2 z-10
                                        ${isActive ? "text-white" : "text-brand-paragraph hover:text-brand-heading"}`}
                                >
                                    <Icon className={`w-4 h-4 transition-colors ${isActive ? "text-white" : "text-brand-paragraph/60"}`} />
                                    {label}
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-purpose-bg"
                                            className="absolute inset-0 bg-brand-primary rounded-xl -z-10 shadow-lg shadow-brand-primary/20"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Property Type */}
                <CustomDropdown
                    label="Property Type"
                    options={
                        formData.purpose === "sell"
                            ? [
                                { value: "residential", label: "Residential" },
                                { value: "commercial", label: "Commercial" },
                                { value: "plot", label: "Plot" },
                            ]
                            : [
                                { value: "residential", label: "Residential" },
                                { value: "commercial", label: "Commercial" },
                                { value: "paying-guest", label: "PG/Co-Living" },
                            ]
                    }
                    value={formData.propertyType}
                    onChange={(val) => {
                        updateFormData("propertyType", val);
                        updateFormData("configuration", ""); // Reset configuration when type changes
                        updateFormData("configDetails", ""); // Reset details when type changes
                    }}
                    icon={<Building2 className="w-5 h-5" />}
                />

                {/* Configuration */}
                <CustomDropdown
                    label="Configuration"
                    options={CONFIG_MAPPING[formData.propertyType]?.options || []}
                    value={formData.configuration}
                    onChange={(val) => {
                        updateFormData("configuration", val);
                        updateFormData("configDetails", ""); // Reset details when config changes
                    }}
                    icon={<LayoutGrid className="w-5 h-5" />}
                    placeholder={CONFIG_MAPPING[formData.propertyType]?.label}
                />

                {/* Residential Configuration Details */}
                <AnimatePresence mode="wait">
                    {formData.propertyType === "residential" && formData.configuration && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-2 group md:col-span-2"
                        >
                            <label className="text-[12px] font-black text-brand-paragraph uppercase tracking-widest px-1 group-focus-within:text-brand-primary transition-colors">
                                {CONFIG_MAPPING.residential.options.find(opt => opt.value === formData.configuration)?.label} Details
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder={`e.g. ${CONFIG_MAPPING.residential.options.find(opt => opt.value === formData.configuration)?.label} Details - 3 Bedrooms, 1 Hall, 1 Kitchen, 3 Bathrooms`}
                                    value={formData.configDetails || ""}
                                    onChange={(e) => updateFormData("configDetails", e.target.value)}
                                    className="w-full bg-zinc-50/50 border border-brand-muted/50 rounded-2xl px-5 py-4 text-[14px] font-semibold focus:outline-none focus:border-brand-primary focus:bg-white transition-all shadow-sm placeholder:text-[14px] placeholder:text-brand-muted"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-paragraph group-focus-within:text-brand-primary transition-colors">
                                    <Info className="w-5 h-5" />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Listed By */}
                <div className="space-y-4 md:col-span-2">
                    <label className="text-[12px] font-black text-brand-paragraph uppercase tracking-widest px-1">Listed By</label>
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { id: "owner", icon: User, label: "Owner" },
                            { id: "agent", icon: Briefcase, label: "Agent" },

                            { id: "builder", icon: Building, label: "Builder" }
                        ].map(({ id, icon: Icon, label }) => (
                            <button
                                key={id}
                                type="button"
                                onClick={() => updateFormData("postedBy", id)}
                                className={`group relative flex flex-col items-center gap-3 p-5 rounded-[24px] transition-all duration-300 border-2 cursor-pointer
                                    ${formData.postedBy === id 
                                        ? "bg-brand-primary/5 border-brand-primary" 
                                        : "bg-zinc-50/30 border-brand-muted/50 hover:border-brand-primary/30 hover:bg-white"}`}
                            >
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300
                                    ${formData.postedBy === id 
                                        ? "bg-brand-primary text-white scale-110 shadow-lg shadow-brand-primary/20" 
                                        : "bg-zinc-100 text-brand-paragraph group-hover:bg-brand-primary/10 group-hover:text-brand-primary"}`}
                                >
                                    <Icon className="w-6 h-6" />
                                </div>
                                <span className={`text-[13px] font-black transition-colors
                                    ${formData.postedBy === id ? "text-brand-heading" : "text-brand-paragraph"}`}
                                >
                                    {label}
                                </span>
                                {formData.postedBy === id && (
                                    <motion.div
                                        layoutId="active-listed-by"
                                        className="absolute -top-2 -right-2 w-7 h-7 bg-brand-primary text-white rounded-full flex items-center justify-center shadow-md animate-in zoom-in duration-300 border-2 border-white"
                                    >
                                        <Check className="w-4 h-4" />
                                    </motion.div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default BasicInfo;
