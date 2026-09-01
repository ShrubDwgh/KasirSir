/**
 * Check if browser supports BarcodeDetector API
 */
export async function supportsBarcodeDetector(): Promise<boolean> {
  try {
    // @ts-ignore
    return 'BarcodeDetector' in window;
  } catch {
    return false;
  }
}

/**
 * Decode barcode from image/video using jsQR
 */
export async function decodeBarcode(imageData: ImageData): Promise<string | null> {
  try {
    // @ts-ignore
    const jsQR = window.jsQR;
    if (!jsQR) return null;

    const result = jsQR(imageData.data, imageData.width, imageData.height);
    return result?.data || null;
  } catch (error) {
    console.error('Barcode decode error:', error);
    return null;
  }
}
