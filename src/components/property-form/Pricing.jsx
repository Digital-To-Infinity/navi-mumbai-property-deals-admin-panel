"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IndianRupee, Wallet, Calendar, TrendingUp, Tag, ShieldCheck } from "lucide-react";
import CustomDropdown from "./CustomDropdown";

const Pricing = ({ formData, updateFormData }) => {
    const priceTypeOptions = [
        { value: "fixed", label: "Fixed Price" },
        { value: "negotiable", label: "Negotiable" },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-xl border border-zinc-100 rounded-[32px] p-8 shadow-sm hover:shadow-md transition-all duration-500"
        >
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                    <IndianRupee className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-xl font-black text-zinc-900">Pricing Details</h2>
                    <p className="text-sm text-zinc-500 font-medium">Define the financial terms of your property</p>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {formData.purpose === "sell" ? (
                    <motion.div
                        key="sell-pricing"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-8"
                    >
                        {/* Price */}
                        <div className="space-y-2 group">
                            <label className="text-[12px] font-black text-brand-paragraph uppercase tracking-widest px-1 group-focus-within:text-brand-primary transition-colors">Price</label>
                            <div className="relative">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">₹</div>
                                <input
                                    type="text"
                                    placeholder="e.g. 1.25 Cr"
                                    value={formData.price}
                                    onChange={(e) => updateFormData("price", e.target.value)}
                                    className="w-full bg-zinc-50/50 border border-brand-muted/50 rounded-2xl pl-10 pr-5 py-4 text-[14px] font-semibold focus:outline-none focus:border-brand-primary focus:bg-white transition-all placeholder:text-[14px] placeholder:text-brand-muted"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    <Wallet className="w-5 h-5 text-brand-paragraph group-focus-within:text-brand-primary transition-colors" />
                                </div>
                            </div>
                        </div>

                        {/* Negotiable or Fixed */}
                        <CustomDropdown
                            label="Price Type"
                            options={priceTypeOptions}
                            value={formData.priceType}
                            onChange={(val) => updateFormData("priceType", val)}
                            icon={<Tag className="w-4 h-4" />}
                            placeholder="Select Price Type"
                        />

                        {/* Price per Sqft */}
                        <div className="space-y-2 group">
                            <label className="text-[12px] font-black text-brand-paragraph uppercase tracking-widest px-1 group-focus-within:text-brand-primary transition-colors">Price per Sqft</label>
                            <div className="relative">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-muted font-bold">₹</div>
                                <input
                                    type="text"
                                    placeholder="e.g. 8,500 psf"
                                    value={formData.pricePerSqft}
                                    onChange={(e) => updateFormData("pricePerSqft", e.target.value)}
                                    className="w-full bg-zinc-50/50 border border-brand-muted/50 rounded-2xl pl-10 pr-5 py-4 text-[14px] font-semibold focus:outline-none focus:border-brand-primary focus:bg-white transition-all placeholder:text-[14px] placeholder:text-brand-muted"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    <TrendingUp className="w-5 h-5 text-brand-paragraph group-focus-within:text-brand-primary transition-colors" />
                                </div>
                            </div>
                        </div>

                        {/* Maintenance Charges */}
                        <div className="space-y-2 group">
                            <label className="text-[12px] font-black text-brand-paragraph uppercase tracking-widest px-1 group-focus-within:text-brand-primary transition-colors">Maintenance Charges</label>
                            <div className="relative">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-muted font-bold">₹</div>
                                <input
                                    type="text"
                                    placeholder="e.g. 5,000 / mo"
                                    value={formData.maintenance}
                                    onChange={(e) => updateFormData("maintenance", e.target.value)}
                                    className="w-full bg-zinc-50/50 border border-brand-muted/50 rounded-2xl pl-10 pr-5 py-4 text-[14px] font-semibold focus:outline-none focus:border-brand-primary focus:bg-white transition-all placeholder:text-[14px] placeholder:text-brand-muted"
                                />
                            </div>
                        </div>

                        {/* Certification */}
                        <div className="space-y-2 group md:col-span-2">
                            <label className="text-[12px] font-black text-brand-paragraph uppercase tracking-widest px-1 group-focus-within:text-brand-primary transition-colors">Certification</label>
                            <button
                                type="button"
                                onClick={() => updateFormData("isReraVerified", !formData.isReraVerified)}
                                className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl border transition-all cursor-pointer
                                    ${formData.isReraVerified 
                                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                                        : 'bg-zinc-50 border-brand-muted/50 text-brand-paragraph hover:border-emerald-200/50'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <ShieldCheck className={`w-5 h-5 ${formData.isReraVerified ? 'text-emerald-700' : 'text-brand-paragraph'}`} />
                                    <span className="text-[13px] font-black">RERA Verified Property</span>
                                </div>
                                <div className={`w-11 h-6 rounded-full transition-colors relative flex items-center ${formData.isReraVerified ? 'bg-emerald-500' : 'bg-zinc-200'}`}>
                                    <motion.div 
                                        animate={{ x: formData.isReraVerified ? 22 : 2 }}
                                        className="w-5 h-5 bg-white rounded-full shadow-sm"
                                    />
                                </div>
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="rent-pricing"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-8"
                    >
                        {/* Rent Price */}
                        <div className="space-y-2 group">
                            <label className="text-[12px] font-black text-brand-paragraph uppercase tracking-widest px-1 group-focus-within:text-brand-primary transition-colors">Rent price per month</label>
                            <div className="relative">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-muted font-bold">₹</div>
                                <input
                                    type="text"
                                    placeholder="e.g. 25,000 / mo"
                                    value={formData.rentPrice}
                                    onChange={(e) => updateFormData("rentPrice", e.target.value)}
                                    className="w-full bg-zinc-50/50 border border-brand-muted/50 rounded-2xl pl-10 pr-5 py-4 text-[14px] font-bold focus:outline-none focus:border-brand-primary focus:bg-white transition-all placeholder:text-[14px] placeholder:text-brand-muted"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    <Calendar className="w-5 h-5 text-brand-paragraph" />
                                </div>
                            </div>
                        </div>

                        {/* Negotiable or Fixed */}
                        <CustomDropdown
                            label="Price Type"
                            options={priceTypeOptions}
                            value={formData.priceType}
                            onChange={(val) => updateFormData("priceType", val)}
                            icon={<Tag className="w-4 h-4" />}
                            placeholder="Select Price Type"
                        />

                        {/* Deposit */}
                        <div className="space-y-2 group">
                            <label className="text-[12px] font-black text-brand-paragraph uppercase tracking-widest px-1 group-focus-within:text-brand-primary transition-colors">Deposit</label>
                            <div className="relative">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-muted font-bold">₹</div>
                                <input
                                    type="text"
                                    placeholder="e.g. 1.00 L"
                                    value={formData.securityDeposit}
                                    onChange={(e) => updateFormData("securityDeposit", e.target.value)}
                                    className="w-full bg-zinc-50/50 border border-brand-muted/50 rounded-2xl pl-10 pr-5 py-4 text-[14px] font-bold focus:outline-none focus:border-brand-primary focus:bg-white transition-all placeholder:text-[14px] placeholder:text-brand-muted"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    <Wallet className="w-5 h-5 text-brand-paragraph" />
                                </div>
                            </div>
                        </div>

                        {/* Maintenance Charges */}
                        <div className="space-y-2 group">
                            <label className="text-[12px] font-black text-brand-paragraph uppercase tracking-widest px-1 group-focus-within:text-brand-primary transition-colors">Maintenance Charges</label>
                            <div className="relative">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-muted font-bold">₹</div>
                                <input
                                    type="text"
                                    placeholder="e.g. 5,000 / mo"
                                    value={formData.maintenance}
                                    onChange={(e) => updateFormData("maintenance", e.target.value)}
                                    className="w-full bg-zinc-50/50 border border-brand-muted/50 rounded-2xl pl-10 pr-5 py-4 text-[14px] font-bold focus:outline-none focus:border-brand-primary focus:bg-white transition-all placeholder:text-[14px] placeholder:text-brand-muted"
                                />
                            </div>
                        </div>

                        {/* Certification */}
                        <div className="space-y-2 group md:col-span-2">
                            <label className="text-[12px] font-black text-brand-paragraph uppercase tracking-widest px-1 group-focus-within:text-brand-primary transition-colors">Certification</label>
                            <button
                                type="button"
                                onClick={() => updateFormData("isReraVerified", !formData.isReraVerified)}
                                className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl border transition-all cursor-pointer
                                    ${formData.isReraVerified 
                                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                                        : 'bg-zinc-50 border-brand-muted/50 text-brand-paragraph hover:border-emerald-200/50'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <ShieldCheck className={`w-5 h-5 ${formData.isReraVerified ? 'text-emerald-700' : 'text-brand-paragraph'}`} />
                                    <span className="text-[13px] font-black">RERA Verified Property</span>
                                </div>
                                <div className={`w-11 h-6 rounded-full transition-colors relative flex items-center ${formData.isReraVerified ? 'bg-emerald-500' : 'bg-zinc-200'}`}>
                                    <motion.div 
                                        animate={{ x: formData.isReraVerified ? 22 : 2 }}
                                        className="w-5 h-5 bg-white rounded-full shadow-sm"
                                    />
                                </div>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Pricing;
