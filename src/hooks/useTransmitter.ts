import { useState, useCallback } from 'react';
import { useAudioContext } from '@/contexts/AudioContext';
import { getGGWave, encodeMessage } from '@/lib/audio/ggwave-wrapper';

export const useTransmitter = () => {
    const { context, analyser } = useAudioContext();
    const [isTransmitting, setIsTransmitting] = useState(false);

    const transmit = useCallback(async (message: string, protocolId: number = 1) => {
        if (!context) {
            console.error("Audio context not ready");
            return;
        }

        setIsTransmitting(true);
        try {
            const ggwave = await getGGWave();
            if (!ggwave) return;

            // Encode
            // Note: ggwave.encode returns something. In the JS lib it often returns a specialized object or array.
            // We might need to handle it carefully.
            const waveform = encodeMessage(ggwave, message, protocolId, 10);

            if (waveform) {
                // Convert to AudioBuffer
                // Assuming waveform is Float32Array
                const buffer = context.createBuffer(1, waveform.length, context.sampleRate);
                const data = buffer.getChannelData(0);
                data.set(waveform);

                const source = context.createBufferSource();
                source.buffer = buffer;

                if (analyser) {
                    source.connect(analyser);
                    analyser.connect(context.destination);
                } else {
                    source.connect(context.destination);
                }

                source.start();

                source.onended = () => setIsTransmitting(false);
            } else {
                setIsTransmitting(false);
            }

        } catch (error) {
            console.error("Transmission error", error);
            setIsTransmitting(false);
        }
    }, [context, analyser]);

    return { transmit, isTransmitting };
};
