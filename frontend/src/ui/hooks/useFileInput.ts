import { useRef } from "react";

export const useFileInput = (
    accept: string,
    onFile: (file: File) => void
) => {
    const ref = useRef<HTMLInputElement | null>(null);

    const open = () => {
        if (!ref.current) {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = accept;
            input.onchange = () => {
                const file = input.files?.[0];
                if (file) onFile(file);
            };
            ref.current = input;
        }
        ref.current.value = "";
        ref.current.click();
    };

    return open;
};