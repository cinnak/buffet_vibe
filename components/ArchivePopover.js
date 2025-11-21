import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function ArchivePopover({ isOpen, onClose, archiveData }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40 bg-black/5 dark:bg-black/20"
                        onClick={onClose}
                    />

                    {/* Popover */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[800px] max-h-[80vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl p-8 z-50 grid grid-cols-4 gap-8"
                    >
                        {Object.entries(archiveData).sort((a, b) => b[0].localeCompare(a[0])).map(([decade, years]) => (
                            <div key={decade} className="decade-group">
                                <div className="text-xs font-bold text-gold uppercase mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">
                                    {decade}
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    {years.map(year => (
                                        <Link
                                            key={year}
                                            href={`/letter/${year}`}
                                            className="text-sm text-slate-500 dark:text-slate-400 hover:text-navy dark:hover:text-gold hover:bg-slate-50 dark:hover:bg-slate-800 px-2 py-1 rounded transition-colors"
                                            onClick={onClose}
                                        >
                                            {year}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
