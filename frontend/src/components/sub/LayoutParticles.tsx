import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from "tsparticles";

export const LayoutParticles = () => {
  
    const [init, setInit] = useState(false);
    
    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadFull(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const particlesOptions = {
        particles: {
            number: {
                value: 30,
                density: { enable: true, area: 800 },
            },
            shape: {
                type: "image",
                options: {
                    image: [
                        {
                            src: "/real-cherry-blossom.png",
                            width: 100,
                            height: 100,
                        },
                        {
                            src: "/petals-cherry-blossom.png",
                            width: 200,
                            height: 200,
                        },
                        {
                            src: "/petals-cherry-blossom.png",
                            width: 200,
                            height: 200,
                        },
                    ],
                },
            },
            opacity: {
                value: { min: 0.8, max: 1 },
            },
            size: {
                value: { min: 5, max: 15 },
            },
            move: {
                enable: true,
                direction: "bottom",
                speed: { min: 1, max: 3 },
                straight: false,
                random: false,
                outModes: { default: "out", bottom: "out", top: "out"},
            },
            rotate: {
                value: { min: 0, max: 360 },
                animation: { enable: true, speed: 5, sync: false, },
                direction: "random",
            },
            tilt: {
                enable: true,
                value: { min: 0, max: 45 },
                animation: { enable: true, speed: 3 },
            },
        },
        fpsLimit: 120,
        background: {
            color: "transparent",
        },
        fullScreen: {
            enable: true,
            zIndex: 1,
        },
        detectRetina: true,
    };

    if (init) {
        return <Particles id="tsparticles" options={particlesOptions} />;
    }

    return null;
}
