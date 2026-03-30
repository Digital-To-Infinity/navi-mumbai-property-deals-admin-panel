import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import logo from '../assets/nm-property-logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Authenticating...');
    try {
      await login(email, password);
      toast.success('Successfully logged in!', { id: loadingToast });
      navigate('/admin-panel');
    } catch (error) {
      toast.error('Invalid credentials. Access Denied.', { id: loadingToast });
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center bg-[#f8fafc] overflow-hidden relative pt-12">
        {/* Animated Background Decor */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[80px] animate-pulse delay-700" />
        
        <div className="w-full max-w-lg p-8 max-[426px]:p-4 z-10 animate-fade-in">
            <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 md:p-14 max-[426px]:p-4 relative overflow-hidden group">
                {/* Branding Indicator */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-primary" />
                
                <div className="space-y-10 text-center">
                    <div className="space-y-4">
                        <img src={logo} alt="Navi Mumbai Property Deals" className="h-14 mx-auto drop-shadow-sm group-hover:scale-110 transition-transform duration-700" />
                        <div>
                            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Portal Access</h2>
                            <p className="text-slate-500 font-medium text-sm mt-1 uppercase tracking-widest">Authorized Access Only</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 text-left">
                        <div className="space-y-2">
                             <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                             <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                                <input 
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@propertydeals.com"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary focus:bg-white transition-all text-slate-900 placeholder:text-slate-500"
                                />
                             </div>
                        </div>

                        <div className="space-y-2">
                             <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Secure Password</label>
                             <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="admin123"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-12 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary focus:bg-white transition-all text-slate-900 placeholder:text-slate-500"
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-600 transition-colors cursor-pointer"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                             </div>
                        </div>

                        <div className="flex items-center justify-between text-xs px-1">
                             <label className="flex items-center space-x-2 cursor-pointer group/label">
                                 <input type="checkbox" className="w-4 h-4 rounded border-slate-200 text-primary focus:ring-primary/20 cursor-pointer" />
                                 <span className="text-slate-500 font-bold group-hover/label:text-slate-700 transition-colors">Keep me signed in</span>
                             </label>
                             <a href="#" className="text-primary hover:text-primary-dark font-bold hover:underline transition-all">Forgot?</a>
                        </div>

                        <button 
                            type="submit"
                            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-2xl transition-all shadow-xl shadow-primary/20 active:scale-[0.98] flex items-center justify-center group/btn cursor-pointer"
                        >
                            Sign In Securely
                            <ChevronRight size={20} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <div className="pt-2 flex items-center justify-center space-x-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        <ShieldCheck size={14} className="text-primary" />
                        <span>Powered by Secure Realty CRM</span>
                    </div>
                </div>
            </div>
            
            <p className="text-center mt-8 text-slate-500 text-xs font-semibold">
                © 2026 Navi Mumbai Property Deals. All Rights Reserved.
            </p>
        </div>
    </div>
  );
};

export default Login;
