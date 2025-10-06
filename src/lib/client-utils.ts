// Regular expressions used for data URL parsing
const MIME_TYPE_REGEX = /data:(.*?)(;base64)?$/;
const BASE64_SUFFIX_REGEX = /;base64$/;

/**
 * Reads a file and returns an HTMLImageElement and its data URL.
 * @param file The file to read.
 * @returns A promise that resolves with an object containing the image element and data URL, or null if an error occurs.
 */
export function readFileAsImage(
  file: File
): Promise<{ img: HTMLImageElement; dataUrl: string } | null> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result);
      const img = new window.Image();
      img.onload = () => resolve({ img, dataUrl });
      img.onerror = () => resolve(null);
      img.src = dataUrl;
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

/**
 * Converts a blob to a data URL.
 * @param blob The blob to convert.
 * @returns A promise that resolves with the data URL.
 */
export function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Converts a data URL to a blob.
 * @param dataURL The data URL to convert.
 * @returns The converted blob.
 */
export function dataURLToBlob(dataURL: string): Blob {
  const commaIndex = dataURL.indexOf(",");
  if (commaIndex === -1) {
    throw new Error("Invalid data URL");
  }
  const header = dataURL.slice(0, commaIndex);
  const data = dataURL.slice(commaIndex + 1);
  const mimeMatch = header.match(MIME_TYPE_REGEX);
  const mime = mimeMatch?.[1] ?? "application/octet-stream";
  const isBase64 = BASE64_SUFFIX_REGEX.test(header);
  const binaryString = isBase64 ? atob(data) : decodeURIComponent(data);
  const len = binaryString.length;
  const uint8Array = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    uint8Array[i] = binaryString.charCodeAt(i);
  }
  return new Blob([uint8Array], { type: mime });
}

/**
 * Downloads a canvas element as a PNG image.
 * @param canvas The canvas element to download.
 * @param filename The desired filename for the downloaded image.
 */
export function downloadCanvas(canvas: HTMLCanvasElement, filename: string) {
  canvas.toBlob((blob) => {
    if (!blob) {
      return;
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, "image/png");
}

/**
 * Formats a number of bytes into a human-readable string.
 * @param bytes The number of bytes.
 * @returns A formatted string representing the byte size.
 */
export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "—";
  }
  const KILO = 1024;
  const MEGA = KILO * KILO;
  if (bytes < KILO) {
    return `${bytes} B`;
  }
  if (bytes < MEGA) {
    return `${(bytes / KILO).toFixed(1)} KB`;
  }
  return `${(bytes / MEGA).toFixed(2)} MB`;
}

/**
 * Loads an image from a given source URL.
 * @param src The source URL of the image.
 * @returns A promise that resolves with the HTMLImageElement.
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// Time conversion constants
const MS_TO_SECONDS = 1000;
const SECONDS_PER_MINUTE = 60;

/**
 * Formats elapsed time in milliseconds to a human-readable string.
 * @param ms The elapsed time in milliseconds.
 * @returns A formatted string like "2.5s" or "1m 23.4s"
 */
export function formatElapsedTime(ms: number): string {
  const seconds = ms / MS_TO_SECONDS;
  if (seconds < SECONDS_PER_MINUTE) {
    return `${seconds.toFixed(1)}s`;
  }
  const minutes = Math.floor(seconds / SECONDS_PER_MINUTE);
  const remainingSeconds = seconds % SECONDS_PER_MINUTE;
  return `${minutes}m ${remainingSeconds.toFixed(1)}s`;
}
