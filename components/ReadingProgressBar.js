import { useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * Thin progress bar displayed at the top of letter content
 * @param {number} percentage - Read percentage (0-100)
 * @param {number} year - Letter year (for tracking)
 * @param {Function} onSeek - Optional callback when clicking on progress bar
 */
export default function ReadingProgressBar({ percentage = 0, year, onSeek }) {
    const clampedPercentage = Math.min(100, Math.max(0, percentage));

    const handleClick = (e) => {
        if (!onSeek) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickPercentage = (clickX / rect.width) * 100;
        onSeek(clickPercentage);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative w-full h-1 bg-slate-200 dark:bg-slate-700 cursor-pointer group"
            onClick={handleClick}
            title={`${clampedPercentage}% complete`}
        >
            {/* Progress fill */}
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${clampedPercentage}%` }}
                transition={{ duration: 0.3 }}
                className="h-full bg-gradient-to-r from-amber-400 to-amber-600 dark:from-amber-500 dark:to-amber-400"
            />

            {/* Hover tooltip */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-navy dark:bg-gold text-white dark:text-navy text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none">
                {clampedPercentage}%
            </div>

            {/* Completed indicator */}
            {clampedPercentage >= 95 && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-900"
                    title="Completed!"
                />
            )}
        </motion.div>
    );
}
