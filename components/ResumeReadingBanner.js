import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, X } from 'lucide-react';

/**
 * Banner prompting user to resume reading from saved position
 * @param {number} percentage - Saved read percentage
 * @param {Function} onResume - Callback to resume from saved position
 * @param {Function} onDismiss - Callback to dismiss the banner
 * @param {boolean} show - Whether to show the banner
 */
export default function ResumeReadingBanner({ percentage = 0, onResume, onDismiss, show = false }) {
    if (!show) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -100, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/90 dark:to-amber-800/90 backdrop-blur-sm border-b border-amber-200 dark:border-amber-700"
            >
                <div className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-500 dark:bg-amber-600 rounded-full flex items-center justify-center text-white">
                            <RotateCcw className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-medium text-amber-900 dark:text-amber-100">
                                Continue reading from {percentage}%?
                            </p>
                            <p className="text-xs text-amber-700 dark:text-amber-300">
                                Pick up where you left off
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={onResume}
                            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Resume
                        </button>
                        <button
                            onClick={onDismiss}
                            className="px-3 py-2 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-700/50 rounded-lg font-medium text-sm transition-colors"
                        >
                            Start Over
                        </button>
                        <button
                            onClick={onDismiss}
                            className="p-1 text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-700/50 rounded-lg transition-colors"
                            aria-label="Dismiss"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
