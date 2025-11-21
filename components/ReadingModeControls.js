import { Eye, FileDown, Printer } from 'lucide-react';

export default function ReadingModeControls({ readingMode, setReadingMode, onExportPDF, onPrint }) {
    const modes = [
        { value: 'normal', label: 'Normal', bg: 'bg-white dark:bg-slate-900' },
        { value: 'sepia', label: 'Sepia', bg: 'bg-amber-50 dark:bg-amber-950' },
        { value: 'night', label: 'Night', bg: 'bg-slate-900' }
    ];

    return (
        <div className="flex items-center gap-3">
            {/* Reading Mode Toggle */}
            <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400 min-w-[40px]">Mode</span>
                <div className="flex gap-1">
                    {modes.map((mode) => (
                        <button
                            key={mode.value}
                            onClick={() => setReadingMode(mode.value)}
                            className={`px-3 h-8 rounded-lg text-xs font-medium transition-all ${readingMode === mode.value
                                    ? 'bg-navy dark:bg-gold text-white dark:text-navy shadow-sm'
                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                }`}
                        >
                            {mode.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Divider */}
            <div className="h-6 w-px bg-slate-300 dark:bg-slate-600"></div>

            {/* Export & Print */}
            <div className="flex gap-2">
                <button
                    onClick={onExportPDF}
                    className="flex items-center gap-1 px-3 h-8 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg text-xs font-medium transition-all"
                    title="Export as PDF"
                >
                    <FileDown className="w-4 h-4" />
                    <span>PDF</span>
                </button>
                <button
                    onClick={onPrint}
                    className="flex items-center gap-1 px-3 h-8 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg text-xs font-medium transition-all"
                    title="Print letter"
                >
                    <Printer className="w-4 h-4" />
                    <span>Print</span>
                </button>
            </div>
        </div>
    );
}
