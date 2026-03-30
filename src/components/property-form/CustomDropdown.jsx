import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CustomDropdown = ({ label, options, value, onChange, icon, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className="space-y-2 group" ref={dropdownRef}>
            {label && (
                <label className="text-[12px] font-black text-brand-paragraph uppercase tracking-widest px-1 group-focus-within:text-brand-primary transition-colors">
                    {label}
                </label>
            )}
            <div 
                className="relative"
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
            >
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full bg-zinc-50/50 border rounded-2xl px-5 py-4 text-[14px] font-semibold flex items-center justify-between transition-all cursor-pointer ${
                        isOpen 
                            ? 'border-brand-primary bg-white ring-4 ring-brand-primary/10' 
                            : 'border-brand-muted/50 hover:border-brand-primary/30'
                    }`}
                >
                    <div className="flex items-center gap-3">
                        {icon && <span className={`${isOpen ? 'text-brand-primary' : 'text-brand-paragraph'} transition-colors`}>{icon}</span>}
                        <span className={value ? 'text-brand-heading' : 'text-brand-muted'}>
                            {selectedOption ? selectedOption.label : (placeholder || 'Select Option')}
                        </span>
                    </div>
                    <ChevronDown
                        className={`text-brand-muted transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand-primary' : ''}`}
                        size={18}
                    />
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-xl shadow-brand-primary/10 border border-zinc-100 overflow-hidden py-2"
                        >
                            <div className="max-h-64 overflow-y-auto custom-scrollbar">
                                {options.length > 0 ? (
                                    options.map((option) => {
                                        const isSelected = value === option.value;
                                        return (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => {
                                                    onChange(option.value);
                                                    setIsOpen(false);
                                                }}
                                                className={`w-full flex items-center justify-between px-4 py-3 text-sm font-semibold transition-all duration-200 group/item cursor-pointer ${
                                                    isSelected
                                                        ? 'text-brand-primary bg-brand-primary/5'
                                                        : 'text-brand-paragraph hover:bg-zinc-50 hover:text-brand-heading'
                                                }`}
                                            >
                                                <div className="flex items-center space-x-3 text-base">
                                                    <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                                                        isSelected ? 'bg-brand-primary scale-125' : 'bg-zinc-200 group-hover/item:bg-brand-primary/40'
                                                    }`} />
                                                    <span>{option.label}</span>
                                                </div>
                                                {isSelected && <Check size={14} className="text-brand-primary" strokeWidth={3} />}
                                            </button>
                                        );
                                    })
                                ) : (
                                    <div className="px-4 py-3 text-sm text-brand-muted italic">No options available</div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CustomDropdown;
