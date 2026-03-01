import { motion } from 'framer-motion';
import { Trash2, Calendar } from 'lucide-react';

/**
 * Individual vocabulary word card
 * @param {Object} word - Word data
 * @param {Function} onDelete - Callback when delete is clicked
 * @param {string} variant - 'grid' or 'list' display mode
 */
export default function VocabularyCard({ word, onDelete, variant = 'grid' }) {
    const getTypeColor = () => {
        const colors = {
            'Noun': 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-700',
            'Verb': 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700',
            'Adjective': 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-400 border-purple-300 dark:border-purple-700',
            'Adverb': 'bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-400 border-orange-300 dark:border-orange-700',
            'Expression': 'bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-400 border-pink-300 dark:border-pink-700',
            'Idiom': 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400 border-red-300 dark:border-red-700'
        };
        return colors[word.type] || colors['Expression'];
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        if (confirm(`Remove "${word.term}" from vocabulary?`)) {
            onDelete(word);
        }
    };

    if (variant === 'list') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-700 transition-colors group"
            >
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-navy dark:text-gold">{word.term}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${getTypeColor()}`}>
                            {word.type}
                        </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1">
                        {word.definition_cn}
                    </p>
                </div>

                <button
                    onClick={handleDelete}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    aria-label="Delete word"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow"
        >
            {/* Header with term and delete */}
            <div className="flex items-start justify-between mb-2">
                <h3 className="font-display text-xl font-bold text-navy dark:text-gold">
                    {word.term}
                </h3>
                <button
                    onClick={handleDelete}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                    aria-label="Delete word"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            {/* Type badge */}
            <div className="mb-3">
                <span className={`inline-block text-xs px-2 py-1 rounded-full border ${getTypeColor()}`}>
                    {word.type}
                </span>
            </div>

            {/* Definition */}
            <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">
                {word.definition_cn}
            </p>

            {/* Example */}
            {word.example && (
                <div className="mb-3 p-2 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 italic">
                        "{word.example}"
                    </p>
                </div>
            )}

            {/* Footer with source and date */}
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-700">
                {word.sourceLetter && (
                    <span>{word.sourceLetter} Letter</span>
                )}
                <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDistanceToNow(word.createdAt)}
                </span>
            </div>
        </motion.div>
    );
}

// Simple date formatter (replaces date-fns)
function formatDistanceToNow(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 86400)}d ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 604800)}w ago`;
    return date.toLocaleDateString();
}
