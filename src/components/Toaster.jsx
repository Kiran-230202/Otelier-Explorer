import { useEffect } from 'react';

const Toaster = ({ message, subMessage, type = 'success', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const isSuccess = type === 'success';

    return (
        /* Increased Z-index and added a forced width */
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[9999] w-full max-w-[350px] px-4">
            <div className="flex items-center gap-4 rounded-2xl border border-white/20 bg-slate-900/90 p-4 backdrop-blur-2xl shadow-2xl ring-1 ring-white/10">
                {/* Status Icon */}
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-lg ${isSuccess ? 'bg-emerald-500 shadow-emerald-500/40' : 'bg-rose-500 shadow-rose-500/40'
                    }`}>
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d={isSuccess ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"} />
                    </svg>
                </div>

                {/* Text Content */}
                <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-black tracking-wide text-white uppercase truncate">
                        {message}
                    </p>
                    <p className="text-xs font-medium text-slate-300 line-clamp-2">
                        {subMessage}
                    </p>
                </div>

                {/* Close Button */}
                <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Toaster;