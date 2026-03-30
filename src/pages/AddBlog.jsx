import React, { useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { 
  ChevronLeft, 
  Save, 
  Eye, 
  Tag, 
  FileText, 
  Image as ImageIcon,
  CheckCircle2,
  X,
  Plus
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import { toast } from 'react-hot-toast';

const AddBlog = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState('Published');
    const [category, setCategory] = useState('Property News');
    const [tags, setTags] = useState(['Navi Mumbai', 'Real Estate']);
    const [tagInput, setTagInput] = useState('');

    const handleAddTag = (e) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            if (!tags.includes(tagInput.trim())) {
                setTags([...tags, tagInput.trim()]);
            }
            setTagInput('');
        }
    };

    const removeTag = (tag) => {
        setTags(tags.filter(t => t !== tag));
    };

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image', 'video'],
            ['clean']
        ],
    };

    const handleSave = () => {
        console.log({ title, content, status, category, tags });
        toast.success(id ? 'Article updated successfully!' : 'Article published successfully!');
        navigate('/admin-panel/blogs');
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button 
                        onClick={() => navigate('/admin-panel/blogs')}
                        className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-slate-800 transition-all hover:bg-slate-50"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{id ? 'Edit Article' : 'Compose New Article'}</h1>
                        <p className="text-slate-500">Create compelling content for your real estate audience.</p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="flex items-center px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:text-slate-900 transition-all active:scale-95 shadow-sm">
                        <Eye size={18} className="mr-2" />
                        Preview
                    </button>
                    <button 
                        onClick={handleSave}
                        className="ag-button flex items-center shadow-lg active:scale-95 !px-8"
                    >
                        <Save size={18} className="mr-2" />
                        Save Article
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Editor Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="ag-card p-4 md:p-8 space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Article Title</label>
                            <input 
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter a catchy headline..."
                                className="w-full text-3xl font-bold border-none bg-transparent placeholder:text-slate-200 focus:outline-none focus:ring-0 px-1 py-2 text-slate-900"
                            />
                        </div>

                        <div className="space-y-2">
                             <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Story Content</label>
                             <div className="rich-text-editor">
                                <ReactQuill 
                                    theme="snow" 
                                    value={content} 
                                    onChange={setContent}
                                    modules={modules}
                                    placeholder="Start writing your property news, area guides, or lifestyle tips here..."
                                />
                             </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Settings */}
                <div className="space-y-6">
                    {/* Status & Visibility */}
                    <div className="ag-card p-6 space-y-6">
                        <h4 className="font-bold text-slate-900 flex items-center"><CheckCircle2 size={18} className="mr-2 text-primary" /> Visibility & Status</h4>
                        
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-600">Category</label>
                                <select 
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="ag-input appearance-none !bg-slate-50/50 border-slate-100"
                                >
                                    <option>Property News</option>
                                    <option>Area Guide</option>
                                    <option>Investment Tips</option>
                                    <option>Lifestyle</option>
                                    <option>Company Updates</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-600">Post Status</label>
                                <div className="flex items-center space-x-3 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                                    <button 
                                        onClick={() => setStatus('Published')}
                                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${status === 'Published' ? 'bg-white text-emerald-600 shadow-sm border border-emerald-50' : 'text-slate-400'}`}
                                    >
                                        Published
                                    </button>
                                    <button 
                                        onClick={() => setStatus('Draft')}
                                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${status === 'Draft' ? 'bg-white text-amber-600 shadow-sm border border-amber-50' : 'text-slate-400'}`}
                                    >
                                        Draft
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tags Section */}
                    <div className="ag-card p-6 space-y-6">
                         <h4 className="font-bold text-slate-900 flex items-center"><Tag size={18} className="mr-2 text-primary" /> Labeling & Tags</h4>
                         
                         <div className="space-y-4">
                             <div className="flex flex-wrap gap-2">
                                 {tags.map(tag => (
                                     <span key={tag} className="flex items-center bg-primary/10 text-primary border border-primary/10 px-3 py-1.5 rounded-lg text-xs font-bold">
                                         {tag}
                                         <button onClick={() => removeTag(tag)} className="ml-2 hover:text-red-500 transition-colors cursor-pointer">
                                             <X size={14} />
                                         </button>
                                     </span>
                                 ))}
                                 {tags.length === 0 && <p className="text-xs text-slate-400 italic">No tags added yet.</p>}
                             </div>

                             <div className="relative">
                                <Plus className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input 
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={handleAddTag}
                                    placeholder="Add tag and press Enter"
                                    className="ag-input !bg-slate-50/50 border-slate-100 pl-10 !text-sm"
                                />
                             </div>
                         </div>
                    </div>

                    {/* Featured Image Placeholder */}
                    <div className="ag-card p-6 space-y-4">
                         <h4 className="font-bold text-slate-900 flex items-center"><ImageIcon size={18} className="mr-2 text-primary" /> Cover Media</h4>
                         <div className="aspect-video bg-slate-50 border border-slate-100 border-dashed rounded-xl flex items-center justify-center text-slate-300 hover:bg-slate-100 transition-all cursor-pointer">
                            <div className="text-center group">
                                <Plus size={24} className="mx-auto group-hover:scale-110 transition-transform" />
                                <span className="text-[10px] font-bold uppercase tracking-widest mt-2 block">Upload Image</span>
                            </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddBlog;
