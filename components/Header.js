import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Archive, ChevronDown, Bookmark } from 'lucide-react';
import ArchivePopover from './ArchivePopover';
import ThemeToggle from './ThemeToggle';
import SavedAnalysesModal from './SavedAnalysesModal';

export default function Header({ archiveData, theme, setTheme }) {
    const [isArchiveOpen, setIsArchiveOpen] = useState(false);
    const [isSavedOpen, setIsSavedOpen] = useState(false);

    return (
        <>
            <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-8 relative z-50">
                <Link href="/" className="flex items-center gap-2 font-display font-bold text-xl text-navy dark:text-gold">
                    <BookOpen className="w-5 h-5 text-navy dark:text-gold" />
                    <span>Buffett's Wisdom</span>
                </Link>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <button
                            onClick={() => setIsArchiveOpen(!isArchiveOpen)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${isArchiveOpen
                                    ? 'bg-navy text-gold border-navy'
                                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                                }`}
                        >
                            <Archive className="w-4 h-4" />
                            <span>Letter Archive</span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${isArchiveOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <ArchivePopover
                            isOpen={isArchiveOpen}
                            onClose={() => setIsArchiveOpen(false)}
                            archiveData={archiveData}
                        />
                    </div>

                    <button
                        onClick={() => setIsSavedOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                    >
                        <Bookmark className="w-4 h-4" />
                        <span>Saved</span>
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    <ThemeToggle theme={theme} setTheme={setTheme} />
                    <span className="text-sm text-slate-500 dark:text-slate-400">Lesley</span>
                    <div className="w-8 h-8 bg-navy dark:bg-gold rounded-full flex items-center justify-center text-gold dark:text-navy font-semibold text-sm">
                        L
                    </div>
                </div>
            </header>

            <SavedAnalysesModal isOpen={isSavedOpen} onClose={() => setIsSavedOpen(false)} />
        </>
    );
}
