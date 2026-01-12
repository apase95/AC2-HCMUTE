
export const BannerHomePage = () => {
    return (
        <div className="flex flex-col items-center gap-10 relative z-10">
            <div className="text-center space-y-4 animate-fade-in-up select-none">
                <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight">
                    Welcome to <br className="hidden md:block" />
                    <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent drop-shadow-lg">
                        AWS Cloud Club
                    </span>
                    <span className="block text-3xl md:text-5xl mt-2 text-white/90">HCMUTE</span>
                </h1>
                <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto font-light">
                    Explore <span className="text-white font-semibold">Roadmap</span>, read{" "}
                    <span className="text-white font-semibold">Blogs</span>, study{" "}
                    <span className="text-white font-semibold">Documents</span> and take{" "}
                    <span className="text-white font-semibold">Exams</span> to master the cloud
                </p>
            </div>

            <div className="relative w-full flex justify-center items-center group">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px]
                    bg-blue-500 blur-[250px] rounded-full animate-pulse-slow"
                />
                <img
                    src="/logo-cloud-club-white.png"
                    alt="AWS Cloud Club Banner"
                    draggable={false}
                    className="relative z-10 w-[80%] md:w-[60%] lg:w-[35%] h-auto object-contain drop-shadow-2xl 
                        transition-transform duration-500 ease-in-out transform
                        hover:scale-105 hover:-rotate-2 select-none animate-float"
                />
            </div>
        </div>
    );
};
