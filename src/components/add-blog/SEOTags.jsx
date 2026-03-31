import { Tag, Plus, X } from 'lucide-react';

const SEOTags = ({ tags, tagInput, setTagInput, handleAddTag, removeTag }) => {
    return (
        <div className="ag-card p-6 md:p-8 max-[426px]:p-4 space-y-6 shadow-sm border-slate-100/50">
            <h4 className="font-bold text-slate-900 flex items-center"><Tag size={18} className="mr-2 text-primary" /> SEO Labels & Tags</h4>

            <div className="space-y-6">
                <div className="flex flex-wrap gap-3">
                    {tags.map(tag => (
                        <span key={tag} className="flex items-center bg-primary/5 text-primary border border-primary/10 px-4 py-2 rounded-xl text-xs font-bold shadow-sm">
                            {tag}
                            <button onClick={() => removeTag(tag)} className="ml-3 hover:text-red-500 transition-colors cursor-pointer">
                                <X size={14} />
                            </button>
                        </span>
                    ))}
                    {tags.length === 0 && <p className="text-xs text-slate-400 italic">No tags added yet. Add some keywords for better search visibility.</p>}
                </div>

                <div className="relative">
                    <Plus className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleAddTag}
                        placeholder="Type keyword and press Enter..."
                        className="ag-input !bg-slate-50/50 border-slate-100 !pl-16 h-14 !text-base placeholder:text-slate-500 focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all"
                    />
                </div>
            </div>
        </div>
    );
};

export default SEOTags;
