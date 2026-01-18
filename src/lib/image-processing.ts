
export const IMAGE_SIZE = 64; // 64x64 pixels
export const PROTOCOL_PREFIX = "IMG:";

// Process image to a compressed 1-bit string
export async function processImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = IMAGE_SIZE;
            canvas.height = IMAGE_SIZE;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject("No canvas context");
                return;
            }

            // Draw resized
            ctx.drawImage(img, 0, 0, IMAGE_SIZE, IMAGE_SIZE);

            // Get data
            const imageData = ctx.getImageData(0, 0, IMAGE_SIZE, IMAGE_SIZE);
            const data = imageData.data;

            // 1-bit packing
            const bitArray: number[] = [];
            let currentByte = 0;
            let bitIndex = 0;

            for (let i = 0; i < data.length; i += 4) {
                // Simple grayscale + threshold
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                const avg = (r + g + b) / 3;
                const bit = avg > 127 ? 1 : 0;

                if (bit) {
                    currentByte |= (1 << (7 - bitIndex));
                }

                bitIndex++;
                if (bitIndex === 8) {
                    bitArray.push(currentByte);
                    currentByte = 0;
                    bitIndex = 0;
                }
            }

            // Push last byte if pending
            if (bitIndex > 0) {
                bitArray.push(currentByte);
            }

            // Convert to Base64
            const binaryString = String.fromCharCode.apply(null, bitArray);
            const base64 = btoa(binaryString);

            resolve(`${PROTOCOL_PREFIX}${base64}`);
        };
        img.onerror = reject;
    });
}

// Render protocol string back to data URL
export function renderImage(payload: string): string | null {
    if (!payload.startsWith(PROTOCOL_PREFIX)) return null;

    const base64 = payload.slice(PROTOCOL_PREFIX.length);
    try {
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        // Unpack bits
        const canvas = document.createElement('canvas');
        canvas.width = IMAGE_SIZE;
        canvas.height = IMAGE_SIZE;
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        const imageData = ctx.createImageData(IMAGE_SIZE, IMAGE_SIZE);

        let pixelIndex = 0;
        for (let i = 0; i < len; i++) {
            const byte = bytes[i];
            for (let b = 0; b < 8; b++) {
                if (pixelIndex >= IMAGE_SIZE * IMAGE_SIZE) break;

                const bit = (byte >> (7 - b)) & 1;
                const val = bit ? 255 : 0;

                const dataIndex = pixelIndex * 4;
                imageData.data[dataIndex] = val;     // R
                imageData.data[dataIndex + 1] = val; // G
                imageData.data[dataIndex + 2] = val; // B
                imageData.data[dataIndex + 3] = 255; // A

                pixelIndex++;
            }
        }

        ctx.putImageData(imageData, 0, 0);
        return canvas.toDataURL();

    } catch (e) {
        console.error("Failed to render image", e);
        return null;
    }
}
