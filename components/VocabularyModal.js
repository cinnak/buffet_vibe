import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, BookOpen, Download } from 'lucide-react';
import VocabularyCard from './VocabularyCard';
import { getVocabulary, getWordsByType, searchWords, removeWord, clearVocabulary } from '@/lib/storage/vocabularyStorage';

/**
 * Vocabulary notebook modal
 * @param {boolean} isOpen - Whether modal is open
 * @param {Function} onClose - Callback to close modal
 */
export default function VocabularyModal({ isOpen = false, onClose }) {
    const [words, setWords] = useState([]);
    const [filter, setFilter] = useState('all'); // all, noun, verb, adjective, etc.
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('newest'); // newest, oldest, alphabetical

    // Load vocabulary on mount
    useEffect(() => {
        if (isOpen) {
            loadVocabulary();
        }
    }, [isOpen]);

    // Reload when words change (for external updates)
    const loadVocabulary = () => {
        setWords(getVocabulary());
    };

    // Get filtered and sorted words
    const displayWords = useMemo(() => {
        let filtered = words;

        // Apply type filter
        if (filter !== 'all') {
            filtered = filtered.filter(w => w.type.toLowerCase() === filter.toLowerCase());
        }

        // Apply search
        if (searchQuery) {
            filtered = filtered.filter(w =>
                w.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
                w.definition_cn.includes(searchQuery)
            );
        }

        // Apply sorting
        filtered = [...filtered].sort((a, b) => {
            if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
            if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
            if (sortBy === 'alphabetical') return a.term.localeCompare(b.term);
            return 0;
        });

        return filtered;
    }, [words, filter, searchQuery, sortBy]);

    // Get available types for filter tabs
    const availableTypes = useMemo(() => {
        const types = new Set(words.map(w => w.type));
        return Array.from(types).sort();
    }, [words]);

    // Get words grouped by type
    const wordsByType = getWordsByType();

    const handleDelete = (word) => {
        removeWord(word.id);
        setWords(getVocabulary());
    };

    const handleClearAll = () => {
        if (confirm('Are you sure you want to clear all vocabulary? This cannot be undone.')) {
            clearVocabulary();
            setWords([]);
        }
    };

    const handleExport = () => {
        const csvContent = [
            ['Term', 'Type', 'Definition', 'Example', 'Source Letter', 'Date Added'],
            ...words.map(w => [
                w.term,
                w.type,
                `"${w.definition_cn.replace(/"/g, '""')}"`,
                `"${w.example.replace(/"/g, '""')}"`,
                w.sourceLetter || '',
                w.createdAt
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `buffett-vocabulary-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Close on escape
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Prevent body scroll
    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = '';
        return () => { document.body.style.overflow = ''; };
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
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 shrink-0">
                                <div className="flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-500" />
                                    <h2 className="text-lg font-semibold text-navy dark:text-gold">Vocabulary Notebook</h2>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">
                                        ({words.length} / {100})
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleExport}
                                        disabled={words.length === 0}
                                        className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 disabled:opacity-50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                        title="Export to CSV"
                                    >
                                        <Download className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Search and Filter Bar */}
                            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 shrink-0">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    {/* Search */}
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search words or definitions..."
                                            className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-0 rounded-lg text-sm text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        />
                                    </div>

                                    {/* Sort */}
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="px-4 py-2 bg-slate-100 dark:bg-slate-800 border-0 rounded-lg text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    >
                                        <option value="newest">Newest First</option>
                                        <option value="oldest">Oldest First</option>
                                        <option value="alphabetical">A-Z</option>
                                    </select>
                                </div>
                            </div>

                            {/* Type Filter Tabs */}
                            <div className="px-6 py-2 border-b border-slate-200 dark:border-slate-700 shrink-0 overflow-x-auto">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setFilter('all')}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                                            filter === 'all'
                                                ? 'bg-amber-600 text-white'
                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                        }`}
                                    >
                                        All ({words.length})
                                    </button>
                                    {availableTypes.map(type => (
                                        <button
                                            key={type}
                                            onClick={() => setFilter(type)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                                                filter.toLowerCase() === type.toLowerCase()
                                                    ? 'bg-amber-600 text-white'
                                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                            }`}
                                        >
                                            {type} ({wordsByType[type]?.length || 0})
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Words Grid */}
                            <div className="flex-1 overflow-y-auto p-6">
                                {displayWords.length === 0 ? (
                                    <div className="text-center py-16">
                                        <BookOpen className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-700" />
                                        <p className="text-slate-500 dark:text-slate-400">
                                            {words.length === 0
                                                ? 'No words saved yet. Analyze some text to start building your vocabulary!'
                                                : 'No words match your search.'}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {displayWords.map((word) => (
                                            <VocabularyCard
                                                key={word.id}
                                                word={word}
                                                onDelete={handleDelete}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            {words.length > 0 && (
                                <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-700 shrink-0">
                                    <button
                                        onClick={handleClearAll}
                                        className="text-xs text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                    >
                                        Clear All Words
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
