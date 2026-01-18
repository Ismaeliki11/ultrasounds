import { useState, useEffect, useRef } from 'react';
import { useAudioContext } from '@/contexts/AudioContext';
import { getGGWave, decodeAudio } from '@/lib/audio/ggwave-wrapper';

export const useReceiver = (onMessage: (msg: string) => void) => {
    const { context, analyser } = useAudioContext();
    const [isListening, setIsListening] = useState(false);
    const streamRef = useRef<MediaStream | null>(null);
    const processorRef = useRef<ScriptProcessorNode | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

    const startListening = async () => {
        if (!context) return;
        if (isListening) return;

        try {
            const ggwave = await getGGWave();
            if (!ggwave) return;

            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                alert("Microphone access is not supported in this environment. Please ensure you are using HTTPS or localhost.");
                console.error("navigator.mediaDevices.getUserMedia is undefined");
                return;
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: false,
                    autoGainControl: false,
                    noiseSuppression: false,
                    sampleRate: 48000
                }
            });
            streamRef.current = stream;

            const source = context.createMediaStreamSource(stream);
            sourceRef.current = source;

            // Connect to Analyser for visualization (but not destination to avoid feedback)
            if (analyser) {
                source.connect(analyser);
            }

            // Create ScriptProcessor
            // Buffer size 4096 is standard for this
            const processor = context.createScriptProcessor(4096, 1, 1);
            processorRef.current = processor;

            processor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);
                // Feed to ggwave
                const res = decodeAudio(ggwave, inputData);
                if (res) {
                    onMessage(res);
                }
            };

            // Mute output to prevent feedback loop
            const gain = context.createGain();
            gain.gain.value = 0;
            source.connect(processor);
            processor.connect(gain);
            gain.connect(context.destination);

            setIsListening(true);
        } catch (err) {
            console.error("Failed to start receiver", err);
        }
    };

    const stopListening = () => {
        if (processorRef.current) {
            processorRef.current.disconnect();
            processorRef.current = null;
        }
        if (sourceRef.current) {
            sourceRef.current.disconnect();
            sourceRef.current = null;
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            streamRef.current = null;
        }
        setIsListening(false);
    };

    useEffect(() => {
        return () => stopListening();
    }, []);

    return { startListening, stopListening, isListening };
};
