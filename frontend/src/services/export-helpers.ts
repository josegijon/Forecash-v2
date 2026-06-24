const REVOKE_URL_DELAY_MS = 1000;

export const dateTag = (): string => new Date().toISOString().slice(0, 10);

export const triggerDownload = (blob: Blob, fileName: string): void => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), REVOKE_URL_DELAY_MS);
};
