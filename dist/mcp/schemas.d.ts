import { z } from "zod";
export declare const GenerateQrCodeSchema: {
    url: z.ZodString;
    style: z.ZodOptional<z.ZodEnum<{
        "slate-ember": "slate-ember";
        "ink-lime": "ink-lime";
        "charcoal-cyan": "charcoal-cyan";
        "night-sky": "night-sky";
        "graphite-gold": "graphite-gold";
        "espresso-rose": "espresso-rose";
        "plum-ice": "plum-ice";
        "forest-mint": "forest-mint";
        "cocoa-orange": "cocoa-orange";
        "mono-high": "mono-high";
    }>>;
    format: z.ZodOptional<z.ZodEnum<{
        svg: "svg";
        png: "png";
    }>>;
    size: z.ZodOptional<z.ZodNumber>;
    logoUrl: z.ZodOptional<z.ZodString>;
    logoPosition: z.ZodOptional<z.ZodEnum<{
        center: "center";
        "bottom-right": "bottom-right";
    }>>;
};
export declare const GetStylesSchema: {};
export declare const PreviewUrlSchema: {
    url: z.ZodString;
    style: z.ZodOptional<z.ZodString>;
};
export declare const BatchUrlSchema: {
    urls: z.ZodArray<z.ZodString>;
    style: z.ZodOptional<z.ZodString>;
};
export type GenerateQrCodeInput = {
    url: string;
    style?: string;
    format?: "svg" | "png";
    size?: number;
    logoUrl?: string;
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