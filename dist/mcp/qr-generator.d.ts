export type QrGeneratorOptions = {
    data: string;
    styleId: string;
    size: number;
    format: "svg" | "png";
    logoSvgContent?: string;
    logoSizePercent?: number;
    logoStrokePx?: number;
    logoPosition?: {
        x: number;
        y: number;
    };
};
export declare function generateQrCode(options: QrGeneratorOptions): Promise<string>;
export declare function getAvailableStyles(): {
    id: string;
    name: string;
    colors: {
        background: string;
        dots: string;
        corners: string;
        accent: string;
    };
}[];
export declare function generatePreviewUrl(data: string, styleId?: string): string;
export declare function generateDownloadUrl(data: string, styleId?: string): string;
//# sourceMappingURL=qr-generator.d.ts.map