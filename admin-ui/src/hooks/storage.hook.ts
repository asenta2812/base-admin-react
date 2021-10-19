import React from 'react'

type KeyLocalStorage = 'access-token' | 'auth';
export function useLocalStorage<T>(key: KeyLocalStorage, initialValue = null): { value: T | null, setValue: any, removeValue: any } {
    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = React.useState(() => {
        try {
            // Get from local storage by key
            const item = window.localStorage.getItem(key);
            // Parse stored json or if none return initialValue
            return item ? JSON.parse(item) as T : initialValue;
        } catch (error) {
            return initialValue;
        }
    });
    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to localStorage.
    const setValue = (value: any): void => {
        try {
            // Allow value to be a function so we have same API as useState
            const valueToStore =
                value instanceof Function ? value(storedValue) : value;
            // Save state
            setStoredValue(valueToStore);
            // Save to local storage
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            // A more advanced implementation would handle the error case
            throw new Error();
        }
    };

    const removeValue = () => {
        try {
            // Save state
            setStoredValue(initialValue);
            // Save to local storage
            window.localStorage.removeItem(key);
        } catch (error) {
            // A more advanced implementation would handle the error case
            throw new Error();
        }
    }
    return { value: storedValue, setValue, removeValue };
}