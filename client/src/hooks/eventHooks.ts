import { useEffect, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { catchErrorHandler } from '../utils/errorHandlers';

export function useOutsideClick(callback: () => void) {
    const ref = useRef<HTMLLIElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                callback(); // Call the callback if click is outside
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [callback]);

    return ref;
}

export function useEscKey(isOpen: boolean, onClose: () => void) {
    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscKey);

        // Prevent scrolling on body when modal is open
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscKey);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, onClose]);
}

export function useAutoLogout(): void {
    const router = useRouter();

    async function logoutUser() {
        try {
            await axios.post('/logout', {}, { withCredentials: true });
            router.push('/login');
        } catch (err) {
            const customMessage = 'Error logging out';
            catchErrorHandler(err, customMessage);
            router.push('/login');
        }
    }

    async function verifyToken() {
        try {
            const response = await axios.get('/verify', { withCredentials: true });

            if (response.status !== 200) {
                console.error(response.data.message);
                logoutUser();
            }
        } catch (err: unknown) {
            const customMessage = 'Error verifying token';
            catchErrorHandler(err, customMessage);

            logoutUser();
            router.push('/login');
        }
    }

    useEffect(() => {
        let inactivityTimer: NodeJS.Timeout; // timer to log user out after 15 minutes of inactivity
        let lastInteractionTime: number = Date.now(); // Track the last user interaction
        let lastVerifyTime: number = Date.now(); // Track the last /verify call

        async function resetTimers() {
            clearTimeout(inactivityTimer);

            // Set inactivity timer to log out after 15 minutes of inactivity
            inactivityTimer = setTimeout(logoutUser, 15 * 60 * 1000); // 15 minutes

            // Call /verify if 10 minutes have passed since last call and user interacted in last 15 minutes
            if (Date.now() - lastVerifyTime >= 10 * 60 * 1000 && Date.now() - lastInteractionTime <= 15 * 60 * 1000) {
                verifyToken();
                lastVerifyTime = Date.now();
            }
        }

        async function handleInteraction() {
            lastInteractionTime = Date.now();
            resetTimers();
        }

        // Set up event listeners to detect user interaction
        const events = ['mousemove', 'keydown', 'click', 'scroll'];
        events.forEach((event) => window.addEventListener(event, handleInteraction));

        resetTimers();

        // Cleanup event listeners and timers when the component unmounts
        return () => {
            clearTimeout(inactivityTimer);
            events.forEach((event) => window.removeEventListener(event, handleInteraction));
        };
    }, []); //eslint-disable-line react-hooks/exhaustive-deps

    return null; // No UI rendering
}
