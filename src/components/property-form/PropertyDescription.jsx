"use client";
import React from "react";
import { motion } from "framer-motion";
import { AlignLeft } from "lucide-react";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const PropertyDescription = ({ formData, updateFormData }) => {
    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ color: [] }, { background: [] }],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ align: [] }],
            ["blockquote", "code-block"],
            ["link", "clean"],
        ],
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-xl border border-zinc-100 rounded-[32px] p-8 shadow-sm hover:shadow-md transition-all duration-500"
        >
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                    <AlignLeft className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-xl font-black text-brand-heading">Property Description</h2>
                    <p className="text-sm text-brand-paragraph font-medium">Describe your property in detail to attract more buyers</p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="relative group">
                    <label className="text-[12px] font-black text-brand-paragraph uppercase tracking-widest px-1 group-focus-within:text-brand-primary transition-colors flex items-center gap-2">
                        Detailed Description
                    </label>
                    <div className="relative mt-3 quill-v2-wrapper group-focus-within:ring-2 ring-brand-primary/10 rounded-2xl transition-all">
                        <style dangerouslySetInnerHTML={{ __html: `
                            .quill-v2-wrapper {
                                border: 1px solid rgba(0, 0, 0, 0.05);
                                border-radius: 16px;
                                overflow: hidden;
                                background: white;
                            }
                            .quill-v2-wrapper .ql-toolbar.ql-snow {
                                border: none;
                                border-bottom: 1px solid rgba(0, 0, 0, 0.05);
                                background: #fafafa;
                                padding: 12px 16px;
                            }
                            .quill-v2-wrapper .ql-container.ql-snow {
                                border: none;
                                font-family: inherit;
                                font-size: 14px;
                                min-height: 280px;
                            }
                            .quill-v2-wrapper .ql-editor {
                                min-height: 280px;
                                padding: 20px;
                                line-height: 1.8;
                                color: #374151;
                            }
                            .quill-v2-wrapper .ql-editor.ql-blank::before {
                                color: #94a3b8;
                                font-style: normal;
                                font-weight: 500;
                                left: 20px;
                            }
                        `}} />
                        <ReactQuill 
                            theme="snow"
                            value={formData.description || ""}
                            onChange={(content) => updateFormData("description", content)}
                            modules={modules}
                            placeholder="e.g. Luxury 3 BHK Sky Residence - Your Dream Home in Kharghar, Navi Mumbai..."
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default PropertyDescription;
