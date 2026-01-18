import { useState, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Input';
import { Upload, Type, Image as ImageIcon, Zap } from 'lucide-react';
import { processImage, PROTOCOL_PREFIX } from '@/lib/image-processing';

interface TransmitterProps {
    onTransmit: (message: string) => Promise<void>;
    isTransmitting: boolean;
}

export const Transmitter = ({ onTransmit, isTransmitting }: TransmitterProps) => {
    const [mode, setMode] = useState('text');
    const [text, setText] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSend = async () => {
        if (mode === 'text' && text.trim()) {
            await onTransmit(`TXT:${text}`);
            setText('');
        } else if (mode === 'image' && imageFile) {
            setProcessing(true);
            try {
                const payload = await processImage(imageFile);
                await onTransmit(payload);
                setImageFile(null);
                setPreview(null);
            } catch (err) {
                console.error(err);
                alert("Failed to process image");
            } finally {
                setProcessing(false);
            }
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <Tabs value={mode} onValueChange={setMode} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="text" className="flex items-center gap-2">
                        <Type size={16} /> Text Protocol
                    </TabsTrigger>
                    <TabsTrigger value="image" className="flex items-center gap-2">
                        <ImageIcon size={16} /> Image Protocol
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="text">
                    <Card>
                        <CardContent className="pt-6 space-y-4">
                            <Textarea
                                placeholder="Enter encoded message..."
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="font-mono text-green-400 bg-black/60 min-h-[120px]"
                            />
                            <Button
                                variant="neon"
                                className="w-full"
                                onClick={handleSend}
                                disabled={isTransmitting || !text.trim()}
                            >
                                {isTransmitting ? "Transmitting Signal..." : "Broadcast Text"}
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="image">
                    <Card>
                        <CardContent className="pt-6 space-y-4">
                            <div
                                className="border-2 border-dashed border-white/20 rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary/50 transition-colors bg-black/30 sticky top-0"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                {preview ? (
                                    <div className="relative w-32 h-32 mb-2">
                                        <img src={preview} alt="Preview" className="w-full h-full object-cover rounded shadow-lg border border-white/10" />
                                    </div>
                                ) : (
                                    <Upload className="w-10 h-10 text-muted-foreground mb-2" />
                                )}
                                <p className="text-sm text-muted-foreground">
                                    {preview ? "Click to change" : "Drop image or click to upload"}
                                </p>
                                <p className="text-xs text-primary/70 mt-2">
                                    Max resolution: 64x64px (Auto-resized)
                                </p>
                            </div>

                            <Button
                                variant="neon"
                                className="w-full"
                                onClick={handleSend}
                                disabled={isTransmitting || !imageFile || processing}
                            >
                                {processing ? "Compressing..." : isTransmitting ? "Transmitting Bitstream..." : "Broadcast Image"}
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};
