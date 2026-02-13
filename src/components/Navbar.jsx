const Navbar = ({ user, onSignOut }) => (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <div className="bg-[#0071C2] h-10 w-10 flex items-center justify-center rounded-lg shadow-md">
                <span className="text-white font-black text-xl">O</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 drop-shadow-sm">
    Otelier <span className="text-[#0071C2]">Explorer</span>
</h1>
        </div>
        <div className="flex items-center gap-6">
            <span className="text-sm font-bold text-slate-700 hidden sm:block">
                Welcome, <span className="text-[#0071C2]">{user?.email?.split('@')[0]}</span>
            </span>
            <button
                onClick={onSignOut}
                className="text-sm font-semibold text-rose-600 hover:text-rose-700 transition-colors py-2 px-4 hover:bg-rose-50 rounded-lg"
            >
                Sign Out
            </button>
        </div>
    </nav>
);

export default Navbar;