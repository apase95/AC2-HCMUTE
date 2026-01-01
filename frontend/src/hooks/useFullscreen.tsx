import { useCallback, useEffect, useState } from "react";

export const useFullscreen = () => {
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
    
    const handleFullscreenChange = () => {
        const isDocFullscreen = !!document.fullscreenElement;
        setIsFullscreen(isDocFullscreen);
    };

    useEffect(() => {
        document.addEventListener('fullscreenchange', handleFullscreenChange);    
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    const enterFullscreen = useCallback(async () => {
        try {
            if (document.documentElement.requestFullscreen) {
                await document.documentElement.requestFullscreen();
            }
        } catch (err) {
            console.error("Error when entering fullscreen:", err);
        }
    }, []);

    const exitFullscreen = useCallback(async () => {
        try {
            if (document.fullscreenElement && document.exitFullscreen) {
                await document.exitFullscreen();
            }
        } catch (err) {
            console.error("Error when exiting fullscreen:", err);
        }
    }, []);


    return { isFullscreen, enterFullscreen, exitFullscreen };
};
