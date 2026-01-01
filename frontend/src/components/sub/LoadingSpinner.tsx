export const LoadingSpinner = () => {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm space-y-6">
            <div className="spinner">
                <div className="spinner1"></div>
            </div>
            <span className="text-white text-xl font-bold tracking-widest animate-pulse drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                LOADING...
            </span>
        </div>
    );
};
