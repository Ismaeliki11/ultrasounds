import { createContext, useContext, useEffect, useRef, useState } from 'react';

type AudioContextType = {
    context: AudioContext | null;
    analyser: AnalyserNode | null;
    isReady: boolean;
    init: () => Promise<void>;
    resume: () => Promise<void>;
};

const AudioCtx = createContext<AudioContextType | null>(null);

export const useAudioContext = () => {
    const ctx = useContext(AudioCtx);
    if (!ctx) throw new Error("useAudioContext must be used within AudioProvider");
    return ctx;
};

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
    const [context, setContext] = useState<AudioContext | null>(null);
    const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
    const [isReady, setIsReady] = useState(false);

    const init = async () => {
        if (context) {
            console.log("AudioContext already exists, state:", context.state);
            return;
        }

        try {
            console.log("Initializing AudioContext...");
            const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
            const ctx = new AudioContextClass();

            // Create Analyser
            const ana = ctx.createAnalyser();
            ana.fftSize = 2048;
            ana.smoothingTimeConstant = 0.8;
            setAnalyser(ana);

            setContext(ctx);

            console.log("Initial context state:", ctx.state);

            if (ctx.state === 'suspended') {
                console.log("Attempting to resume context...");
                await ctx.resume();
                console.log("Context state after resume:", ctx.state);
            }

            if (ctx.state === 'running') {
                setIsReady(true);
                console.log("Audio system marked as READY");
            } else {
                console.warn("AudioContext state is not 'running' after init/resume:", ctx.state);
                // On some mobile devices, it might stay suspended until another interaction
                // but we mark it ready anyway if it's created, or handle it in resume()
                setIsReady(true);
            }
        } catch (e) {
            console.error("Critical error during AudioContext init:", e);
        }
    };

    const resume = async () => {
        if (context && context.state === 'suspended') {
            await context.resume();
            setIsReady(true);
        }
    };

    // Auto init on mount if possible (browsers block this usually)
    // We'll rely on explicit init call via UI button

    return (
        // @ts-ignore
        <AudioCtx.Provider value={{ context, analyser, isReady, init, resume }}>
            {children}
        </AudioCtx.Provider>
    );
};
