declare module 'ggwave' {
    export interface GGWaveInstance {
        encode(instance: GGWaveInstance, payload: string, protocolId: number, volume: number): number | any; // returns pointer or array?
        decode(instance: unknown, capture: Float32Array): string | null;
        free(): void;
        HEAPF32: Float32Array;
        HEAPU8: Uint8Array;
        _malloc(size: number): number;
        _free(ptr: number): void;
        // Add more based on usage
        [key: string]: any;
    }

    const factory: () => Promise<GGWaveInstance>;
    export default factory;
}
