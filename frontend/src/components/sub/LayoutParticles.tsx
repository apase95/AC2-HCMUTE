import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from "tsparticles";

interface LayoutParticlesProps {
    zIndex?: number;
}

export const LayoutParticles = ({ zIndex = 1 }: LayoutParticlesProps) => {
  
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
                value: 40,
                density: { enable: true, area: 800 },
            },
            shape: {
                type: "image",
                options: {
                    image: [
                        // {   src: "/real-cherry-blossom.png", width: 100, height: 100, },
                        // {   src: "/petals-cherry-blossom.png", width: 100, height: 100, },
                        // {   src: "/petals-cherry-blossom.png", width: 100, height: 100, },
                        {   src: "/snow_flake.png", width: 100, height: 100, },
                        {   src: "/snow_flake.png", width: 100, height: 100, },
                        {   src: "/snow_flake.png", width: 100, height: 100, },
                    ],
                },
            },
            opacity: {
                value: { min: 0.8, max: 1 },
            },
            size: {
                value: { min: 4, max: 8 },
            },
            move: {
                enable: true,
                direction: "bottom",
                speed: { min: 1, max: 2 },
                straight: false,
                random: true,
                outModes: { default: "out", bottom: "out"},
            },
            rotate: {
                value: { min: 0, max: 360 },
                animation: { enable: true, speed: { min: 5, max: 15 }, sync: false, },
                direction: "random",
            },
            wobble: {
                enable: true,
                distance: 10,
                speed: { min: -1, max: 2 },
            },
            tilt: {
                enable: false,
                value: { min: 0, max: 45 },
                animation: { enable: true, speed: 1 },
            },
        },
        fpsLimit: 60,
        background: {
            color: "transparent",
        },
        fullScreen: {
            enable: true,
            zIndex: zIndex,
        },
        detectRetina: true,
    };

    if (init) {
        return <Particles id="tsparticles" options={particlesOptions} />;
    }

    return null;
}
