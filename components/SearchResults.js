import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FileText, Calendar } from 'lucide-react';
import { groupByDecade } from '@/lib/searchUtils';

/**
 * Display search results grouped by decade
 * @param {Array} results - Search results from searchAllLetters
 * @param {string} query - Search query for highlighting
 * @param {Function} onClose - Callback when result is clicked
 */
export default function SearchResults({ results = [], query = '', onClose }) {
    const router = useRouter();

    if (results.length === 0) {
        return query ? (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No results found for "{query}"</p>
                <p className="text-sm mt-1">Try different keywords</p>
            </div>
        ) : (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Search across all 49 letters</p>
                <p className="text-sm mt-1">Type at least 2 characters</p>
            </div>
        );
    }

    const groupedResults = groupByDecade(results);
    const decades = Object.keys(groupedResults).sort().reverse();

    const handleResultClick = (year, highlightTerm) => {
        onClose();
        router.push(`/letter/${year}?highlight=${encodeURIComponent(highlightTerm)}`);
    };

    return (
        <div className="max-h-96 overflow-y-auto">
            {decades.map((decade) => (
                <div key={decade} className="mb-6 last:mb-0">
                    <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 px-1">
                        {decade}
                    </h3>
                    <div className="space-y-2">
                        {groupedResults[decade].map((result, idx) => (
                            <motion.div
                                key={result.year}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                onClick={() => handleResultClick(result.year, query)}
                                className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors border border-transparent hover:border-amber-300 dark:hover:border-amber-700"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold text-navy dark:text-gold">
                                                {result.year}
                                            </span>
                                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                                {result.matchCount} {result.matchCount === 1 ? 'match' : 'matches'}
                                            </span>
                                        </div>
                                        <p
                                            className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2"
                                            dangerouslySetInnerHTML={{ __html: result.highlightedSnippet }}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

// Need to import Search icon for empty state
import { Search } from 'lucide-react';
