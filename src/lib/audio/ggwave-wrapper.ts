import initGGWaveFactory from 'ggwave';

type GGWaveModule = {
    encode: (instanceId: number, payload: string, protocolId: number, volume: number) => any;
    decode: (instanceId: number, capture: Float32Array) => string | null;
    init: (parameters?: any) => number;
    getDefaultParameters: () => any;
    TxProtocolIds: { [key: string]: number };
    [key: string]: any;
};

let ggwaveModule: GGWaveModule | null = null;
let ggwaveId: number | null = null;
let initializing = false;

export const getGGWave = async (): Promise<{ module: GGWaveModule, id: number } | null> => {
    if (ggwaveModule && ggwaveId !== null) return { module: ggwaveModule, id: ggwaveId };

    if (initializing) {
        while (initializing) {
            await new Promise(r => setTimeout(r, 100));
            if (ggwaveModule && ggwaveId !== null) return { module: ggwaveModule, id: ggwaveId };
        }
    }

    initializing = true;
    try {
        console.log("Loading GGWave Module...");
        // @ts-ignore
        const factory = initGGWaveFactory;
        const module = await factory();

        if (!module) throw new Error("Module creation failed");

        ggwaveModule = module as any;

        console.log("Initializing GGWave Instance...");
        const parameters = module.getDefaultParameters ? module.getDefaultParameters() : undefined;
        // Some bindings typically behave like this: init(params) -> int instanceId
        if (module.init) {
            ggwaveId = module.init(parameters);
            console.log("GGWave instance ID:", ggwaveId);
        } else {
            console.warn("Module.init not found, assuming stateless or implicit instance 0?");
            ggwaveId = 0; // Fallback, though likely to fail if init was expected
        }

        return { module: ggwaveModule!, id: ggwaveId! };
    } catch (e) {
        console.error("Failed to load ggwave", e);
        return null;
    } finally {
        initializing = false;
    }
};

export const encodeMessage = (instance: any, message: string, protocolId: number = 1, volume: number = 20) => {
    // We expect 'instance' here to be the object returned by getGGWave ({ module, id })
    // OR we can just use the closed-over variables if we trust the singleton nature.
    // However, to keep it clean, let's assume the caller passes what getGGWave returned.

    // For backward compatibility with the hook that might just pass the module:
    // We'll rely on the singleton variables if possible, or expect { module, id }

    if (!ggwaveModule || ggwaveId === null) {
        console.error("GGWave not ready");
        return null;
    }

    try {
        return ggwaveModule.encode(ggwaveId, message, protocolId, volume);
    } catch (e) {
        console.error("Encoding error", e);
        return null;
    }
};

export const decodeAudio = (instance: any, capture: Float32Array) => {
    if (!ggwaveModule || ggwaveId === null) return null;
    try {
        return ggwaveModule.decode(ggwaveId, capture);
    } catch (e) {
        return null;
    }
};
