import { useRef, useEffect, useState } from 'react';

/**
 * Custom hook to request a Screen Wake Lock.
 * Keeps the screen on when `enabled` is true.
 */
export const useWakeLock = (enabled) => {
    const wakeLockRef = useRef(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Feature detection
        if (!('wakeLock' in navigator)) {
            console.warn('Wake Lock API not supported in this browser.');
            return;
        }

        const requestLock = async () => {
            try {
                const lock = await navigator.wakeLock.request('screen');
                wakeLockRef.current = lock;

                lock.addEventListener('release', () => {
                    // console.log('Wake Lock released');
                    wakeLockRef.current = null;
                });

                // console.log('Wake Lock acquired');
            } catch (err) {
                console.error(`Wake Lock request failed: ${err.name}, ${err.message}`);
                setError(err);
            }
        };

        const releaseLock = async () => {
            if (wakeLockRef.current) {
                try {
                    await wakeLockRef.current.release();
                    wakeLockRef.current = null;
                } catch (err) {
                    console.error(`Wake Lock release failed: ${err.name}, ${err.message}`);
                }
            }
        };

        // Re-acquire lock on visibility change (OS releases it when tab hidden)
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && enabled && !wakeLockRef.current) {
                requestLock();
            }
        };

        if (enabled) {
            requestLock();
            document.addEventListener('visibilitychange', handleVisibilityChange);
        } else {
            releaseLock();
        }

        return () => {
            releaseLock();
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [enabled]);

    return { error };
};
