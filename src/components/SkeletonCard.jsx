const SkeletonCard = () => (
    <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm animate-pulse">
        {/* Shimmering Image Area */}
        <div className="h-64 bg-slate-200" />

        <div className="p-6 space-y-4">
            {/* Shimmering Title */}
            <div className="space-y-2">
                <div className="h-5 bg-slate-200 rounded-full w-3/4" />
                <div className="h-5 bg-slate-200 rounded-full w-1/2" />
            </div>

            {/* Shimmering Location Tag */}
            <div className="h-3 bg-slate-100 rounded-full w-1/3" />

            {/* Shimmering Price Section */}
            <div className="flex justify-between items-center pt-2">
                <div className="h-8 bg-slate-200 rounded-lg w-24" />
                <div className="h-6 bg-slate-100 rounded-lg w-16" />
            </div>

            {/* Shimmering Button */}
            <div className="h-14 bg-slate-200 rounded-2xl w-full mt-4" />
        </div>
    </div>
);

export default SkeletonCard;