import { CheckCircle2, LayoutGrid } from 'lucide-react';
import CustomDropdown from '../property-form/CustomDropdown';

const PublishingSettings = ({ category, setCategory, status, setStatus, categoryOptions }) => {
    return (
        <div className="ag-card p-6 md:p-8 max-[426px]:p-4 space-y-6 shadow-sm border-slate-100/50">
            <h4 className="font-bold text-slate-900 flex items-center"><CheckCircle2 size={18} className="mr-2 text-primary" /> Publishing Settings</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-0">
                    <CustomDropdown
                        label="Category"
                        options={categoryOptions}
                        value={category}
                        onChange={(val) => setCategory(val)}
                        icon={<LayoutGrid className="w-5 h-5" />}
                        placeholder="Choose Blog Category..."
                    />
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
