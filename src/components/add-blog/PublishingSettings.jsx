import { CheckCircle2, LayoutGrid, PencilLine } from 'lucide-react';
import CustomDropdown from '../property-form/CustomDropdown';
import { motion, AnimatePresence } from 'framer-motion';

const PublishingSettings = ({ 
    category, 
    setCategory, 
    customCategory, 
    setCustomCategory, 
    status, 
    setStatus, 
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
                                <div className="relative group">
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
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="space-y-2">
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
            </div>
        </div>
    );
};

export default PublishingSettings;
