import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const BlogEditor = ({ title, handleTitleChange, content, setContent, modules }) => {
    return (
        <div className="ag-card p-6 md:p-8 max-[426px]:p-4 space-y-6 shadow-sm border-slate-100/50">
            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Article Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="Enter a catchy headline..."
                    className="w-full text-3xl font-bold border-none bg-transparent placeholder:text-slate-200 focus:outline-none focus:ring-0 px-1 py-2 text-slate-900"
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Story Content</label>
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
    );
};

export default BlogEditor;
