import  { useState } from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';
import icon from '../assets/icon.ico';
import { Menu } from 'lucide-react';


const Layout = () => {
    const { user } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex min-h-screen bg-[#f8fafc]">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm nav:hidden z-30 transition-all"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Navbar */}
                <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-4 nav:px-8 sticky top-0 z-20 nav:ml-72 transition-all">
                    <div className="flex items-center flex-1">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 mr-4 nav:hidden text-slate-500 hover:bg-slate-50 rounded-lg transition-colors"
                        >
                            <Menu size={20} />
                        </button>
                    </div>

                    <div className="flex items-center space-x-2 nav:space-x-4">
                        <div className="flex items-center space-x-3 pl-2 nav:pl-4 border-l border-slate-100">
                             <div className="hidden nav:block text-right">
                                <p className="text-sm font-bold text-slate-800 leading-none">NM Property Deals</p>
                                <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-semibold">Administrator</p>
                            </div>
                            <div className="w-10 h-10 bg-primary-light rounded-xl flex items-center justify-center border border-primary/10 overflow-hidden">
                                <img src={icon} alt="NM" className="w-full h-full object-contain p-1" />
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 nav:ml-72 p-6 nav:p-10 transition-all duration-300">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
