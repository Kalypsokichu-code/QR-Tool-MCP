export type GenerateQrCodeInput = {
    url: string;
    style?: string;
    format?: "svg";
    size?: number;
    logoPosition?: "center" | "bottom-right";
};
export type PreviewUrlInput = {
    url: string;
    style?: string;
};
export type BatchUrlInput = {
    urls: string[];
    style?: string;
};
//# sourceMappingURL=schemas.d.ts.map