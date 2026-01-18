import { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/Card';
import { renderImage, PROTOCOL_PREFIX } from '@/lib/image-processing';
import { Terminal, Image as ImageIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface ReceiverProps {
    logs: string[];
    isListening: boolean;
}

export const Receiver = ({ logs, isListening }: ReceiverProps) => {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    return (
        <div className="w-full max-w-md mx-auto h-[500px] flex flex-col">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                    <Terminal size={14} /> INCOMING DATA STREAM
                </h3>
                {isListening && (
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                )}
            </div>

            <div className="flex-1 rounded-lg border border-white/10 bg-black/80 p-4 overflow-y-auto font-mono text-sm shadow-inner glass-panel">
                <AnimatePresence initial={false}>
                    {logs.length === 0 && (
                        <div className="h-full flex items-center justify-center text-muted-foreground/50 opacity-50 select-none">
                            Awaiting Signal...
                        </div>
                    )}
                    {logs.map((log, i) => {
                        const isImage = log.startsWith(PROTOCOL_PREFIX);
                        const isText = log.startsWith("TXT:");

                        let content = null;
                        if (isImage) {
                            const src = renderImage(log);
                            content = src ? (
                                <div className="mt-2 mb-2 p-2 bg-white/5 rounded border border-white/10 w-fit">
                                    <div className="text-xs text-primary mb-1 flex items-center gap-1 opacity-70">
                                        <ImageIcon size={10} /> DECODED BITMAP
                                    </div>
                                    {/* Pixelated rendering for retro feel */}
                                    <img src={src} alt="Received" className="w-32 h-32 image-pixelated border border-primary/30" style={{ imageRendering: 'pixelated' }} />
                                </div>
                            ) : <span className="text-red-500">[CORRUPTED IMAGE DATA]</span>;
                        } else if (isText) {
                            content = <span className="text-white">{log.slice(4)}</span>;
                        } else {
                            // Legacy/Raw handling
                            content = <span className="text-white/60">{log}</span>;
                        }

                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="mb-4 border-l-2 border-primary/30 pl-3 py-1"
                            >
                                <div className="text-[10px] text-primary/50 mb-1">
                                    {new Date().toLocaleTimeString()}
                                </div>
                                <div className="break-words">
                                    {content}
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
                <div ref={bottomRef} />
            </div>
        </div>
    );
};
