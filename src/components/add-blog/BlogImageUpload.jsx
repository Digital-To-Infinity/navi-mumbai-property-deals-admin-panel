"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { ImagePlus, X, Camera, Sparkles, AlertCircle, GripVertical } from "lucide-react";

const BlogImageUpload = ({ images, onChange }) => {
    const [previews, setPreviews] = useState(images || []);

    // Sync state with parent if it changes externally
    useEffect(() => {
        if (images && JSON.stringify(images) !== JSON.stringify(previews)) {
            setPreviews(images);
        }
    }, [images]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files || []);
        const newPreviews = files.map(f => URL.createObjectURL(f));
        const updatedPreviews = [...previews, ...newPreviews];
        setPreviews(updatedPreviews);
        onChange(updatedPreviews);
    };

    const removeImage = (index) => {
        const updated = previews.filter((_, i) => i !== index);
        setPreviews(updated);
        onChange(updated);
    };

    const handleReorder = (newOrder) => {
        setPreviews(newOrder);
        onChange(newOrder);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/80 backdrop-blur-xl border border-zinc-100 rounded-[32px] p-6 md:p-8 max-[426px]:p-4 shadow-sm hover:shadow-md transition-all duration-500"
        >
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                    <Camera className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-xl font-black text-zinc-900">Featured Media & Gallery</h2>
                    <p className="text-sm text-zinc-500 font-medium">Add a cover image and support media for your article</p>
                </div>
            </div>

            <div className="space-y-8">
                {/* Upload Zone */}
                <div className="relative group">
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                    />
                    <div className="border-4 border-dashed border-zinc-100 rounded-[32px] p-12 max-[426px]:p-6 text-center group-hover:border-brand-primary/30 group-hover:bg-brand-primary/5 transition-all">
                        <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-6 text-zinc-300 group-hover:scale-110 group-hover:bg-white group-hover:text-brand-primary transition-all shadow-sm">
                            <ImagePlus className="w-10 h-10" />
                        </div>
                        <h3 className="text-zinc-900 font-black text-lg mb-2">Upload Article Photos</h3>
                        <p className="text-zinc-500 font-medium max-w-sm mx-auto">
                            Add a striking cover image. Supported: JPG, PNG, WEBP.
                        </p>
                    </div>
                </div>

                {/* Previews with Reorder */}
                {previews.length > 0 && (
                    <Reorder.Group 
                        axis="y" 
                        values={previews} 
                        onReorder={handleReorder}
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                    >
                        <AnimatePresence>
                            {previews.map((src, index) => (
                                <Reorder.Item
                                    key={src}
                                    value={src}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="aspect-video relative rounded-2xl overflow-hidden group shadow-sm bg-zinc-100 cursor-grab active:cursor-grabbing"
                                >
                                    <img 
                                        src={src} 
                                        alt={`Blog photo ${index + 1}`} 
                                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                    />
                                    
                                    {/* Action Buttons overlay */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <div className="w-10 h-10 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center pointer-events-none">
                                            <GripVertical className="w-5 h-5" />
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeImage(index);
                                            }}
                                            className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Cover Badge */}
                                    {index === 0 && (
                                        <div className="absolute top-2 left-2 px-2 py-1 bg-brand-primary text-white text-[9px] font-black uppercase rounded-lg shadow-sm flex items-center gap-1 z-20">
                                            <Sparkles className="w-3 h-3" /> Blog Cover
                                        </div>
                                    )}

                                    {/* Position Indicator */}
                                    <div className="absolute bottom-2 right-2 w-6 h-6 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                        {index + 1}
                                    </div>
                                </Reorder.Item>
                            ))}
                        </AnimatePresence>
                    </Reorder.Group>
                )}

                {/* Tip */}
                <div className="flex gap-4 p-6 max-[426px]:p-3 bg-amber-50 rounded-2xl border border-amber-100 items-start">
                    <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0" />
                    <p className="text-[13px] text-amber-800 font-medium leading-relaxed">
                        <span className="font-black uppercase tracking-widest text-[11px] block mb-1">Editor Advice:</span>
                        High-quality resolution images increase article engagement by up to 65%. 
                        <br />
                        <span className="text-zinc-400 text-[10px] font-bold mt-2 block italic"> TIP: Drag and drop to reorder. The first photo will be your article's Featured Cover.</span>
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default BlogImageUpload;
