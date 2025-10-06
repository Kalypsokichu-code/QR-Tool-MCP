import { getAvailableStyles } from "../qr-generator.js";
export function handleGetAvailableStyles() {
    const styles = getAvailableStyles();
    const result = {
        success: true,
        count: styles.length,
        styles,
        message: `Found ${styles.length} available QR code styles`,
    };
    return JSON.stringify(result, null, 2);
}
//# sourceMappingURL=get-styles.js.map