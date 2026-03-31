const AuthorDetails = ({ author, setAuthor, authorRole, setAuthorRole, readTime, setReadTime }) => {
    return (
        <div className="ag-card p-6 md:p-8 max-[426px]:p-4 space-y-6 shadow-sm border-slate-100/50">
            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Author Name</label>
                <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="ag-input !bg-slate-50/50"
                    placeholder="Enter author name"
                />
            </div>
            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Author Role</label>
                <input
                    type="text"
                    value={authorRole}
                    onChange={(e) => setAuthorRole(e.target.value)}
                    className="ag-input !bg-slate-50/50"
                    placeholder="e.g. Research Analyst"
                />
            </div>
            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Reading Time Estimate</label>
                <input
                    type="text"
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    className="ag-input !bg-slate-50/50"
                    placeholder="e.g. 5 min read"
                />
            </div>
        </div>
    );
};

export default AuthorDetails;
