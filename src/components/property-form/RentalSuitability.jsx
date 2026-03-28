"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Calendar, CheckCircle, Info } from "lucide-react";

const SUITABILITY_OPTIONS = ["Family", "Bachelor", "Company Lease", "Working Professional"];

const RentalSuitability = ({ formData, updateFormData }) => {

    const toggleSuitability = (item) => {
        const currentList = formData.suitableFor || [];
        if (currentList.includes(item)) {
            updateFormData("suitableFor", currentList.filter((i) => i !== item));
        } else {
            updateFormData("suitableFor", [...currentList, item]);
        }
    };

    return (
        <AnimatePresence>
            {formData.purpose === "rent" && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mb-8"
                >
                    <div className="bg-white/80 backdrop-blur-xl border border-zinc-100 rounded-[32px] p-8 shadow-sm hover:shadow-md transition-all duration-500">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-600">
                                <Users className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-zinc-900">Rental Preferences</h2>
                                <p className="text-sm text-zinc-500 font-medium">Define your ideal tenant profile</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Suitable For */}
                            <div className="space-y-6">
                                <label className="text-[12px] font-black text-brand-paragraph uppercase tracking-widest px-1">Suitable For</label>
                                <div className="flex flex-wrap gap-3">
                                    {SUITABILITY_OPTIONS.map((item) => {
                                        const isSelected = (formData.suitableFor || []).includes(item);
                                        return (
                                            <motion.button
                                                key={item}
                                                type="button"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => toggleSuitability(item)}
                                                className={`px-5 py-2 rounded-2xl text-[14px] font-semibold border transition-all flex items-center gap-2 cursor-pointer group
                                                    ${isSelected
                                                        ? "bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/20"
                                                        : "bg-white border-brand-muted/50 text-brand-paragraph hover:border-brand-primary hover:text-brand-primary"}`}
                                            >
                                                {isSelected ? <CheckCircle className="w-4 h-4 text-white" /> : <Info className="w-4 h-4 text-brand-paragraph group-hover:text-brand-primary transition-colors" />}
                                                {item}
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Available From */}
                            <div className="space-y-6">
                                <label className="text-[12px] font-black text-brand-paragraph uppercase tracking-widest px-1">Available From</label>
                                <div className="space-y-4">
                                    <div className="relative group">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-primary group-hover:scale-110 transition-transform">
                                            <Calendar className="w-5 h-5" />
                                        </div>

                                        <input
                                            type="date"
                                            value={formData.availableFrom || ""}
                                            onChange={(e) => updateFormData("availableFrom", e.target.value)}
                                            className="w-full bg-zinc-50/50 border border-brand-muted/50 rounded-2xl pl-14 pr-5 py-3 text-[15px] font-semibold text-brand-paragraph focus:outline-none focus:border-brand-primary focus:bg-white transition-all appearance-none cursor-pointer hover:border-brand-primary/50 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                                        />
                                    </div>
                                    <p className="text-[12px] font-bold text-brand-muted px-2 italic uppercase tracking-wider flex items-center gap-2">
                                        <Info className="w-3.5 h-3.5" />
                                        Note: Specific dates attract more serious tenants
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default RentalSuitability;
