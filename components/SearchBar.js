import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Search input component with debounced input
 * @param {Function} onSearch - Callback when search query changes (debounced)
 * @param {Function} onClear - Callback when search is cleared
 * @param {Function} onClose - Callback to close search
 * @param {boolean} isOpen - Whether search is open
 */
export default function SearchBar({ onSearch, onClear, onClose, isOpen = true }) {
    const [query, setQuery] = useState('');
    const inputRef = useRef(null);
    const searchTimeoutRef = useRef(null);

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
        }
    }, [isOpen]);

    // Keyboard shortcut: Ctrl+K or Cmd+K
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                inputRef.current?.focus();
            }
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    // Debounced search
    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        if (query.trim().length === 0) {
            onClear?.();
            return;
        }

        if (query.trim().length >= 2) {
            searchTimeoutRef.current = setTimeout(() => {
                onSearch(query.trim());
            }, 300);
        }

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [query, onSearch, onClear]);

    const handleClear = () => {
        setQuery('');
        onClear?.();
        inputRef.current?.focus();
    };

    return (
        <div className="relative">
            <div className="relative flex items-center">
                <Search className="absolute left-3 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search all letters... (Ctrl+K)"
                    className="w-full pl-10 pr-10 py-3 bg-slate-100 dark:bg-slate-800 border-0 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <AnimatePresence>
                    {query && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={handleClear}
                            className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                            aria-label="Clear search"
                        >
                            <X className="w-5 h-5" />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>

            {/* Search hint */}
            {!query && (
                <div className="absolute top-full left-0 right-0 mt-2 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 px-1">
                    <span className="flex items-center gap-1">
                        <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-xs">Ctrl</kbd>
                        <span>+</span>
                        <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-xs">K</kbd>
                        <span>to focus</span>
                    </span>
                    <span className="flex items-center gap-1">
                        <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-xs">Esc</kbd>
                        <span>to close</span>
                    </span>
                </div>
            )}
        </div>
    );
}
