import { X } from 'lucide-react';

const BlogHeader = ({ id, onCancel, windowWidth }) => {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <div>
                    <h1 className="text-2xl font-bold text-black">{id ? 'Edit Article' : 'Compose New Article'}</h1>
                    <p className="text-slate-500">Create compelling content for your real estate audience.</p>
                </div>
            </div>
            <button
                onClick={onCancel}
                className={`transition-all duration-300 cursor-pointer flex items-center justify-center
                            ${windowWidth <= 426
                        ? 'absolute -top-4 -right-4 z-[100] w-10 h-10 bg-white border border-slate-200 rounded-full shadow-lg text-slate-500 hover:text-red-500 hover:border-red-100 hover:bg-red-50 active:scale-90 bg-white/80 backdrop-blur-md'
                        : 'text-slate-500 hover:text-black font-semibold'}
                         `}
            >
                {windowWidth <= 426 ? <X size={20} strokeWidth={2.5} /> : 'Cancel'}
            </button>
        </div>
    );
};

export default BlogHeader;
