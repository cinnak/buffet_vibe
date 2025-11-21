import { useState, useEffect, useRef } from 'react';
import { Sparkles, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPDFText, isHeader, isTableRow } from '@/lib/textUtils';

export default function LetterViewer({ content, onAnalyze, fontSize = 'text-lg', lineHeight = 'leading-loose', readingMode = 'normal' }) {
    const [selection, setSelection] = useState(null);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const containerRef = useRef(null);

    // Format content into paragraphs
    const paragraphs = formatPDFText(content);

    useEffect(() => {
        const handleSelection = () => {
            const selectionObj = window.getSelection();
            if (!selectionObj || selectionObj.isCollapsed) {
                setSelection(null);
                return;
            }

            const text = selectionObj.toString().trim();
            if (text.length < 5) return;

            const range = selectionObj.getRangeAt(0);
            const rect = range.getBoundingClientRect();

            setSelection({
                text,
                top: rect.top + window.scrollY - 50,
                left: rect.left + rect.width / 2,
            });
        };

        document.addEventListener('selectionchange', handleSelection);
        return () => document.removeEventListener('selectionchange', handleSelection);
    }, []);

    // Scroll to top button visibility
    useEffect(() => {
        const handleScroll = () => {
            const scrolled = containerRef.current?.scrollTop || 0;
            setShowScrollTop(scrolled > 500);
        };

        const container = containerRef.current?.closest('.overflow-y-auto');
        container?.addEventListener('scroll', handleScroll);
        return () => container?.removeEventListener('scroll', handleScroll);
    }, []);

    const handleAnalyzeClick = (e) => {
        e.stopPropagation();
        if (selection) {
            onAnalyze(selection.text);
            setSelection(null);
            window.getSelection().removeAllRanges();
        }
    };

    const scrollToTop = () => {
        containerRef.current?.closest('.overflow-y-auto')?.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Get text color based on reading mode
    const getTextColor = () => {
        if (readingMode === 'night') return 'text-slate-300';
        if (readingMode === 'sepia') return 'text-amber-900 dark:text-amber-200';
        return 'text-slate-700 dark:text-slate-300';
    };

    const getHeaderColor = () => {
        if (readingMode === 'night') return 'text-slate-100';
        if (readingMode === 'sepia') return 'text-amber-950 dark:text-amber-100';
        return 'text-navy dark:text-gold';
    };

    return (
        <div className="relative print:text-base" ref={containerRef}>
            <div className={`font-serif ${fontSize} ${lineHeight} ${getTextColor()} print:text-black print:text-base print:leading-loose`}>
                {paragraphs.map((para, idx) => {
                    // Detect headers
                    if (isHeader(para)) {
                        return (
                            <h2 key={idx} className={`font-display text-2xl font-bold ${getHeaderColor()} mt-8 mb-4 print:text-xl print:text-black print:mt-6 print:mb-3`}>
                                {para}
                            </h2>
                        );
                    }

                    // Detect table rows
                    if (isTableRow(para)) {
                        return (
                            <div key={idx} className={`font-mono text-sm ${readingMode === 'sepia' ? 'bg-amber-100 dark:bg-amber-900' : 'bg-slate-50 dark:bg-slate-800'} p-2 rounded my-2 overflow-x-auto print:bg-gray-100 print:text-xs`}>
                                {para}
                            </div>
                        );
                    }

                    // Regular paragraphs
                    return (
                        <p key={idx} className="mb-6 text-justify print:mb-4">
                            {para}
                        </p>
                    );
                })}
            </div>

            {/* Analyze Button */}
            <AnimatePresence>
                {selection && (
                    <motion.button
                        initial={{ opacity: 0, y: 10, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, y: 10, x: "-50%" }}
                        className="fixed z-50 bg-navy dark:bg-gold text-white dark:text-navy px-4 py-2 rounded-lg shadow-xl flex items-center gap-2 font-medium text-sm hover:bg-slate-800 dark:hover:bg-yellow-400 transition-colors print:hidden"
                        style={{
                            top: selection.top,
                            left: selection.left
                        }}
                        onClick={handleAnalyzeClick}
                    >
                        <Sparkles className="w-4 h-4 text-gold dark:text-navy" />
                        Analyze Selection
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Scroll to Top Button */}
            <AnimatePresence>
                {showScrollTop && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={scrollToTop}
                        className="fixed bottom-8 right-8 w-12 h-12 bg-navy dark:bg-gold text-white dark:text-navy rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform z-40 print:hidden"
                    >
                        <ArrowUp className="w-5 h-5" />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}
