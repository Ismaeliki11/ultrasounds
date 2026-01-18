"use client";

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useAudioContext } from '@/contexts/AudioContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Activity, Power, Wifi } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTransmitter } from '@/hooks/useTransmitter';
import { useReceiver } from '@/hooks/useReceiver';

// Dynamic imports to prevent hydration errors (SSR: false)
const Visualizer = dynamic(() => import('@/components/Visualizer').then(m => m.Visualizer), { ssr: false });
const Transmitter = dynamic(() => import('@/components/Transmitter').then(m => m.Transmitter), { ssr: false });
const Receiver = dynamic(() => import('@/components/Receiver').then(m => m.Receiver), { ssr: false });

export default function Home() {
  const { isReady, init } = useAudioContext();
  const [activeTab, setActiveTab] = useState<'transmit' | 'receive'>('transmit');
  const [logs, setLogs] = useState<string[]>([]);

  // Logs management
  const addLog = (msg: string) => setLogs(prev => [msg, ...prev].slice(0, 50));

  // Hooks
  const { transmit, isTransmitting } = useTransmitter();
  const { startListening, isListening, stopListening } = useReceiver((msg) => {
    addLog(msg);
  });

  // Handlers
  const handleBoot = async () => {
    await init();
  };

  const handleTransmit = async (data: string) => {
    addLog(`>>> SENT: ${data.substring(0, 20)}${data.length > 20 ? '...' : ''}`);
    await transmit(data);
  };

  const toggleListener = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <main className="min-h-screen relative flex flex-col p-4 md:p-8 overflow-hidden">
      <div className="crt-scanline" />

      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-primary/5 blur-[120px] -z-10 rounded-full pointer-events-none" />

      {/* Header */}
      <header className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded bg-black/50 border border-primary/50 flex items-center justify-center shadow-[0_0_15px_rgba(var(--primary),0.3)]">
            <Activity className="text-primary animate-pulse" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-primary to-white neon-text">
              LUMINALINK
            </h1>
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Ultrasound Data Uplink v2.0
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <div className="text-right font-mono text-xs text-primary/60">
            <div>FREQ: 18-22kHz</div>
            <div>PROTO: GGWave-Custom</div>
          </div>
          <div className={`w-3 h-3 rounded-full ${isReady ? 'bg-primary shadow-[0_0_10px_theme("colors.primary.DEFAULT")]' : 'bg-red-500'}`} />
        </div>
      </header>

      {!isReady ? (
        <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
          <Card className="max-w-md w-full p-8 flex flex-col items-center bg-black/80 border-primary/30">
            <Power size={64} className="text-primary mb-6 animate-pulse" />
            <h2 className="text-2xl font-bold text-white mb-4 tracking-widest">SYSTEM STANDBY</h2>
            <p className="text-center text-muted-foreground mb-8 font-mono text-sm leading-relaxed">
              Initialize audio engine to establish ultrasonic data link.
              <br />Permissions required: Microphone / Speakers.
            </p>
            <Button
              variant="neon"
              size="lg"
              onClick={handleBoot}
              className="w-full text-lg h-14"
            >
              INITIALIZE SYSTEM
            </Button>
          </Card>
        </div>
      ) : (
        <div className="flex-1 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column: Controls */}
          <div className="lg:col-span-7 flex flex-col gap-6">

            {/* Visualizer Card */}
            <Card className="h-[160px] relative bg-black/80 border-primary/20 overflow-hidden">
              <div className="absolute top-2 left-3 text-[10px] font-mono text-primary/50 z-10">
                SPECTRAL_ANALYSIS
              </div>
              <Visualizer />
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent pointer-events-none" />
            </Card>

            {/* Mode Switcher */}
            <div className="flex p-1 bg-black/40 border border-white/10 rounded-lg backdrop-blur-sm">
              <button
                onClick={() => setActiveTab('transmit')}
                className={cn(
                  "flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-all rounded",
                  activeTab === 'transmit'
                    ? "bg-primary text-black shadow-lg"
                    : "text-muted-foreground hover:text-white"
                )}
              >
                Transmitter
              </button>
              <div className="w-px bg-white/10 my-2" />
              <button
                onClick={() => setActiveTab('receive')}
                className={cn(
                  "flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-all rounded",
                  activeTab === 'receive'
                    ? "bg-secondary text-black shadow-lg"
                    : "text-muted-foreground hover:text-white"
                )}
              >
                Receiver
              </button>
            </div>

            {/* Active Module */}
            <div className="flex-1">
              {activeTab === 'transmit' ? (
                <div className="animate-in slide-in-from-left-4 fade-in duration-300">
                  <Transmitter onTransmit={handleTransmit} isTransmitting={isTransmitting} />
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center gap-6 animate-in slide-in-from-right-4 fade-in duration-300">
                  <Card className="w-full p-8 bg-black/60 border-secondary/30 flex flex-col items-center text-center">
                    <div className={cn("w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-all duration-500",
                      isListening ? "bg-secondary/20 shadow-[0_0_50px_rgba(var(--secondary),0.3)]" : "bg-white/5"
                    )}>
                      <Wifi size={40} className={cn("transition-colors", isListening ? "text-secondary" : "text-muted-foreground")} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {isListening ? "LISTENING FOR SIGNALS..." : "RECEIVER OFFLINE"}
                    </h3>
                    <p className="text-muted-foreground text-sm max-w-xs mb-6 font-mono">
                      {isListening
                        ? "Microphone active. Monitoring ultrasonic frequencies for data packets."
                        : "Activate receiver to capture incoming text or image transmissions."
                      }
                    </p>
                    <Button
                      onClick={toggleListener}
                      className={cn("w-full h-12 font-bold tracking-widest", isListening ? "bg-red-500 hover:bg-red-600 text-white" : "bg-secondary hover:bg-secondary/80 text-black")}
                    >
                      {isListening ? "TERMINATE LINK" : "ACTIVATE RECEIVER"}
                    </Button>
                  </Card>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Logs/Data */}
          <div className="lg:col-span-5 h-full min-h-[500px]">
            <Receiver logs={logs} isListening={isListening} />
          </div>

        </div>
      )}
    </main>
  );
}
