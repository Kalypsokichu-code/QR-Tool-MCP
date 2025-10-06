export type QrStyle = {
    id: string;
    name: string;
    dotColor: string;
    background: string;
    cornerSquare: string;
    cornerDot: string;
};
export type QrOptions = {
    data: string;
    size: number;
    styleId: string;
    padding: number;
};
export declare const STYLES: QrStyle[];
export declare function resolveStyle(styleId: string): QrStyle;
//# sourceMappingURL=qr-styles.d.ts.map