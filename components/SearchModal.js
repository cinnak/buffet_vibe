import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import { searchAllLetters } from '@/lib/searchUtils';

/**
 * Search modal container
 * @param {boolean} isOpen - Whether modal is open
 * @param {Function} onClose - Callback to close modal
 */
export default function SearchModal({ isOpen = false, onClose }) {
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [query, setQuery] = useState('');

    // Reset state when modal closes
    useEffect(() => {
        if (!isOpen) {
            setSearchResults([]);
            setQuery('');
        }
    }, [isOpen]);

    const handleSearch = (searchTerm) => {
        setQuery(searchTerm);
        setIsSearching(true);

        const results = searchAllLetters(searchTerm);
        setSearchResults(results);
        setIsSearching(false);
    };

    const handleClear = () => {
        setSearchResults([]);
        setQuery('');
    };

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [isOpen, onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                                <h2 className="text-lg font-semibold text-navy dark:text-gold flex items-center gap-2">
                                    <span>Search Letters</span>
                                    <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                                        (1977-2025)
                                    </span>
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                    aria-label="Close search"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Search Bar */}
                            <div className="px-6 pt-4">
                                <SearchBar
                                    onSearch={handleSearch}
                                    onClear={handleClear}
                                    onClose={onClose}
                                    isOpen={isOpen}
                                />
                            </div>

                            {/* Results */}
                            <div className="px-6 pb-6">
                                <SearchResults
                                    results={searchResults}
                                    query={query}
                                    onClose={onClose}
                                />
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
