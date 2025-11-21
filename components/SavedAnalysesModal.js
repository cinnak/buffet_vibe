import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bookmark, Trash2, X } from 'lucide-react';

export default function SavedAnalysesModal({ isOpen, onClose }) {
    const [savedAnalyses, setSavedAnalyses] = useState([]);

    useEffect(() => {
        if (isOpen) {
            const saved = JSON.parse(localStorage.getItem('savedAnalyses') || '[]');
            setSavedAnalyses(saved);
        }
    }, [isOpen]);

    const handleDelete = (id) => {
        const updated = savedAnalyses.filter(item => item.id !== id);
        setSavedAnalyses(updated);
        localStorage.setItem('savedAnalyses', JSON.stringify(updated));
    };

    const handleClearAll = () => {
        if (confirm('Are you sure you want to delete all saved analyses?')) {
            setSavedAnalyses([]);
            localStorage.removeItem('savedAnalyses');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                        <Bookmark className="w-5 h-5 text-gold" />
                        <h2 className="text-xl font-bold text-navy dark:text-gold">Saved Analyses</h2>
                        <span className="text-sm text-slate-500">({savedAnalyses.length})</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {savedAnalyses.length > 0 && (
                            <button
                                onClick={handleClearAll}
                                className="text-sm text-red-500 hover:text-red-600 px-3 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                                Clear All
                            </button>
                        )}
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {savedAnalyses.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                            <Bookmark className="w-16 h-16 mb-4 opacity-20" />
                            <p className="text-lg font-medium">No saved analyses yet</p>
                            <p className="text-sm">Save analyses while reading to access them here</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {savedAnalyses.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 hover:border-gold dark:hover:border-gold transition-colors"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                                                {new Date(item.timestamp).toLocaleDateString()} • {item.proficiency}
                                            </div>
                                            {item.analysis.Wisdom?.concept && (
                                                <h3 className="font-semibold text-navy dark:text-gold">{item.analysis.Wisdom.concept}</h3>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="space-y-2 text-sm">
                                        {item.analysis.LanguageLab && item.analysis.LanguageLab.length > 0 && (
                                            <div>
                                                <span className="font-medium text-gold">Language Lab: </span>
                                                <span className="text-slate-600 dark:text-slate-300">
                                                    {item.analysis.LanguageLab.map(l => l.term).join(', ')}
                                                </span>
                                            </div>
                                        )}
                                        {item.analysis.Rhetoric?.technique && (
                                            <div>
                                                <span className="font-medium text-gold">Rhetoric: </span>
                                                <span className="text-slate-600 dark:text-slate-300">
                                                    {item.analysis.Rhetoric.technique}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
