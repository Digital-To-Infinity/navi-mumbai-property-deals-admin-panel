import { CheckCircle2, LayoutGrid, PencilLine, Plus } from 'lucide-react';
import CustomDropdown from '../property-form/CustomDropdown';
import { motion, AnimatePresence } from 'framer-motion';

const PublishingSettings = ({ 
    category, 
    setCategory, 
    customCategory, 
    setCustomCategory, 
    handleAddCategory,
    status, 
    setStatus, 
    featured,
    setFeatured,
    categoryOptions 
}) => {
    return (
        <div className="ag-card p-6 md:p-8 max-[426px]:p-4 space-y-6 shadow-sm border-slate-100/50">
            <h4 className="font-bold text-slate-900 flex items-center"><CheckCircle2 size={18} className="mr-2 text-primary" /> Publishing Settings</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <CustomDropdown
                        label="Category"
                        options={categoryOptions}
                        value={category}
                        onChange={(val) => setCategory(val)}
                        icon={<LayoutGrid className="w-5 h-5" />}
                        placeholder="Choose Blog Category..."
                    />

                    <AnimatePresence>
                        {category === 'Other' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, y: -20 }}
                                animate={{ opacity: 1, height: 'auto', y: 0 }}
                                exit={{ opacity: 0, height: 0, y: -20 }}
                                className="space-y-2 pt-2 overflow-hidden"
                            >
                                <label className="text-[12px] font-black text-brand-paragraph uppercase tracking-widest px-1">
                                    Custom Category Name
                                </label>
                                <div className="flex items-center gap-3">
                                    <div className="relative group flex-1">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                                            <PencilLine size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            value={customCategory}
                                            onChange={(e) => setCustomCategory(e.target.value)}
                                            placeholder="Enter your custom category..."
                                            className="w-full bg-zinc-50/50 border border-brand-muted/50 rounded-2xl pl-12 pr-5 py-4 text-[14px] font-semibold focus:outline-none focus:border-brand-primary focus:bg-white focus:ring-4 focus:ring-brand-primary/10 transition-all"
                                        />
                                    </div>
                                    <button
                                        onClick={handleAddCategory}
                                        className="h-[58px] px-6 bg-brand-primary text-white rounded-2xl font-black text-[12px] uppercase tracking-wider hover:bg-brand-primary/90 transition-all active:scale-95 shadow-lg shadow-brand-primary/20 flex items-center gap-2 shrink-0 cursor-pointer"
                                    >
                                        <Plus size={18} />
                                        <span>Add</span>
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="space-y-4">
                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-semibold text-slate-500">Post Status</label>
                        <div className="flex items-center space-x-3 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                            <button
                                onClick={() => setStatus('Published')}
                                className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all cursor-pointer ${status === 'Published' ? 'bg-white text-emerald-600 shadow-sm border border-emerald-50' : 'text-slate-500 hover:text-black'}`}
                            >
                                Published
                            </button>
                            <button
                                onClick={() => setStatus('Draft')}
                                className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all cursor-pointer ${status === 'Draft' ? 'bg-white text-amber-600 border border-amber-50' : 'text-slate-500 hover:text-black'}`}
                            >
                                Draft
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${featured ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-400'}`}>
                                <svg viewBox="0 0 24 24" fill={featured ? "currentColor" : "none"} stroke="currentColor" className="w-5 h-5">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">Featured Article</p>
                                <p className="text-[11px] font-medium text-slate-500">Display prominently on home</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setFeatured(!featured)}
                            className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer ${featured ? 'bg-primary' : 'bg-slate-300'}`}
                        >
                            <motion.div
                                animate={{ x: featured ? 26 : 2 }}
                                className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm"
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublishingSettings;
