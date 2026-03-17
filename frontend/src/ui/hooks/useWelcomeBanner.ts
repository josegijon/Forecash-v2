import { useState, useEffect } from "react";

const STORAGE_KEY = "forecash_welcome_seen";

export const useWelcomeBanner = () => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const seen = localStorage.getItem(STORAGE_KEY);
        if (!seen) setIsOpen(true);
    }, []);

    const close = () => {
        localStorage.setItem(STORAGE_KEY, "true");
        setIsOpen(false);
    };

    return { isOpen, close };
};