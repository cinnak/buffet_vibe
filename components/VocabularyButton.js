import { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { isWordSaved, addWord, removeWord } from '@/lib/storage/vocabularyStorage';

/**
 * Bookmark button for saving words to vocabulary
 * @param {Object} wordData - Word data { term, type, definition_cn, example, sourceLetter }
 * @param {Function} onSave - Callback when word is saved
 * @param {Function} onRemove - Callback when word is removed
 * @param {boolean} showLabel - Whether to show "Saved" label
 */
export default function VocabularyButton({ wordData, onSave, onRemove, showLabel = false }) {
    const [isSaved, setIsSaved] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        setIsSaved(isWordSaved(wordData.term));
    }, [wordData.term]);

    const handleClick = (e) => {
        e.stopPropagation();
        setIsAnimating(true);

        if (isSaved) {
            // Find and remove the word
            const words = require('@/lib/storage/vocabularyStorage').getVocabulary();
            const word = words.find(w => w.term.toLowerCase() === wordData.term.toLowerCase());
            if (word) {
                removeWord(word.id);
                onRemove?.(wordData);
            }
        } else {
            addWord(wordData);
            onSave?.(wordData);
        }

        setIsSaved(!isSaved);

        setTimeout(() => setIsAnimating(false), 300);
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClick}
            className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-all ${
                isSaved
                    ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
            title={isSaved ? 'Saved to vocabulary' : 'Save to vocabulary'}
        >
            {isSaved ? (
                <BookmarkCheck className={`w-4 h-4 ${isAnimating ? 'scale-125' : ''}`} />
            ) : (
                <Bookmark className={`w-4 h-4 ${isAnimating ? 'scale-125' : ''}`} />
            )}
            {showLabel && (
                <span>{isSaved ? 'Saved' : 'Save'}</span>
            )}
        </motion.button>
    );
}
