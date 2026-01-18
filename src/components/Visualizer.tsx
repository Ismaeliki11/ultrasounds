"use client";

import { useEffect, useRef } from 'react';
import { useAudioContext } from '@/contexts/AudioContext';

export const Visualizer = () => {
    const { analyser, isReady } = useAudioContext();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!analyser || !canvasRef.current || !isReady) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const bufferLength = analyser.fftSize;
        const dataArray = new Uint8Array(bufferLength);

        let animationId: number;

        const draw = () => {
            animationId = requestAnimationFrame(draw);

            analyser.getByteTimeDomainData(dataArray);

            // clear with fade effect
            ctx.fillStyle = 'rgba(5, 10, 5, 0.2)'; // trail effect (dark green tint)
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.lineWidth = 2;

            // Gradient: Green to Cyan
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
            gradient.addColorStop(0, '#00ff80');   // Neon Green
            gradient.addColorStop(0.5, '#00ffff'); // Cyan
            gradient.addColorStop(1, '#00ff80');   // Neon Green

            ctx.strokeStyle = gradient;
            ctx.beginPath();

            const sliceWidth = canvas.width * 1.0 / bufferLength;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] / 128.0; // 0..2
                const y = v * canvas.height / 2;

                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }

                x += sliceWidth;
            }

            ctx.lineTo(canvas.width, canvas.height / 2);
            ctx.stroke();

            // Glow logic
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#00ff80';
        };

        draw();

        return () => {
            cancelAnimationFrame(animationId);
        };
    }, [analyser, isReady]);

    // Handle resizing
    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current) {
                canvasRef.current.width = canvasRef.current.offsetWidth * window.devicePixelRatio;
                canvasRef.current.height = canvasRef.current.offsetHeight * window.devicePixelRatio;
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="w-full h-full relative">
            <canvas
                ref={canvasRef}
                className="w-full h-full"
            />
            {!isReady && (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    <span className="animate-pulse">Waiting for Audio...</span>
                </div>
            )}
        </div>
    );
};
