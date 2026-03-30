"use client";
import { motion } from "framer-motion";
import { MapPin, Navigation, Map } from "lucide-react";

const LocationInfo = ({ formData, updateFormData }) => {
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
                    <h2 className="text-xl font-black text-zinc-900">Property Location</h2>
                    <p className="text-sm text-zinc-500 font-medium">Where is your property situated?</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* Full Address */}
                <div className="space-y-2 group">
                    <label className="text-[12px] font-black text-brand-paragraph uppercase tracking-widest px-1 group-focus-within:text-brand-primary transition-colors">Detailed Address</label>
                    <div className="relative">
                        <textarea
                            placeholder="e.g. Sector 35, Next to Central Park, Kharghar, Navi Mumbai, Maharashtra 410210"
                            rows={3}
                            value={formData.address}
                            onChange={(e) => updateFormData("address", e.target.value)}
                            className="w-full bg-zinc-50/50 border border-brand-muted/50 rounded-2xl px-5 pr-14 py-4 text-[14px] font-semibold focus:outline-none focus:border-brand-primary focus:bg-white transition-all placeholder:text-[14px] placeholder:text-brand-muted resize-none"
                        />
                        <div className="absolute right-4 top-4 text-brand-paragraph group-focus-within:text-brand-primary transition-colors">
                           <Navigation className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* Locality & Sector */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2 group">
                        <label className="text-[12px] font-black text-brand-paragraph uppercase tracking-widest px-1 group-focus-within:text-brand-primary transition-colors">Locality / Area</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="e.g. Kharghar"
                                value={formData.location}
                                onChange={(e) => updateFormData("location", e.target.value)}
                                className="w-full bg-zinc-50/50 border border-brand-muted/50 rounded-2xl px-5 pr-14 py-4 text-[14px] font-semibold focus:outline-none focus:border-brand-primary focus:bg-white transition-all placeholder:text-[14px] placeholder:text-brand-muted"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-paragraph group-focus-within:text-brand-primary transition-colors">
                                <Map className="w-5 h-5" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[12px] font-black text-brand-paragraph uppercase tracking-widest px-1">City</label>
                        <input
                            type="text"
                            value="Navi Mumbai"
                            disabled
                            className="w-full bg-zinc-100 border border-brand-muted/50 rounded-2xl px-5 py-4 text-[14px] font-bold text-brand-paragraph cursor-not-allowed"
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default LocationInfo;
