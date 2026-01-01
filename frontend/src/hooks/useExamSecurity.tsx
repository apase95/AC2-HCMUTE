import { useEffect } from "react";

export const useExamSecurity = (isActive: boolean = true) => {
    useEffect(() => {
        if (!isActive) return;
        
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
        };
        
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && ['c', 'v', 'a', 'p', 's'].includes(e.key.toLowerCase())) {
                e.preventDefault();
                alert("The action is disabled during the exam.");
            }
            if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
                e.preventDefault();
            }

            if (e.key === 'PrintScreen') {
                navigator.clipboard.writeText('');
                alert("The action is disabled during the exam.");
            }

        };
        
        const handleVisibilityChange = () => {
            if (document.hidden) {
                console.warn("User left the exam tab!");
                alert("You have switched tabs during the exam.");
            }
        };    

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [isActive]);
}
