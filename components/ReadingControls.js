import { Type, Minus, Plus } from 'lucide-react';
import ReadingModeControls from './ReadingModeControls';

export default function ReadingControls({
    fontSize,
    setFontSize,
    lineHeight,
    setLineHeight,
    readingMode,
    setReadingMode,
    onExportPDF,
    onPrint
}) {
    const fontSizes = [
        { label: 'S', value: 'text-base', name: 'Small' },
        { label: 'M', value: 'text-lg', name: 'Medium' },
        { label: 'L', value: 'text-xl', name: 'Large' },
        { label: 'XL', value: 'text-2xl', name: 'X-Large' }
    ];

    const lineHeights = [
        { label: 'Compact', value: 'leading-relaxed' },
        { label: 'Normal', value: 'leading-loose' },
        { label: 'Spacious', value: 'leading-[2]' }
    ];

    return (
        <div className="sticky top-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-lg mb-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
                {/* Font Size */}
                <div className="flex items-center gap-2">
                    <Type className="w-4 h-4 text-slate-500" />
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400 min-w-[60px]">Text Size</span>
                    <div className="flex gap-1">
                        {fontSizes.map((size) => (
                            <button
                                key={size.value}
                                onClick={() => setFontSize(size.value)}
                                className={`w-8 h-8 rounded-lg font-semibold text-xs transition-all ${fontSize === size.value
                                        ? 'bg-navy dark:bg-gold text-white dark:text-navy shadow-sm'
                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                    }`}
                                title={size.name}
                            >
                                {size.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Divider */}
                <div className="h-6 w-px bg-slate-300 dark:bg-slate-600"></div>

                {/* Line Height */}
                <div className="flex items-center gap-2">
                    <div className="flex flex-col gap-0.5">
                        <div className="w-4 h-px bg-slate-400"></div>
                        <div className="w-4 h-px bg-slate-400"></div>
                        <div className="w-4 h-px bg-slate-400"></div>
                    </div>
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400 min-w-[60px]">Spacing</span>
                    <div className="flex gap-1">
                        {lineHeights.map((lh) => (
                            <button
                                key={lh.value}
                                onClick={() => setLineHeight(lh.value)}
                                className={`px-3 h-8 rounded-lg text-xs font-medium transition-all ${lineHeight === lh.value
                                        ? 'bg-navy dark:bg-gold text-white dark:text-navy shadow-sm'
                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                    }`}
                            >
                                {lh.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Divider */}
                <div className="h-6 w-px bg-slate-300 dark:bg-slate-600"></div>

                {/* Reading Mode & Export */}
                <ReadingModeControls
                    readingMode={readingMode}
                    setReadingMode={setReadingMode}
                    onExportPDF={onExportPDF}
                    onPrint={onPrint}
                />
            </div>
        </div>
    );
}
