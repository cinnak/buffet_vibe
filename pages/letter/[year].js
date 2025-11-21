import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Clock } from 'lucide-react';
import Header from '@/components/Header';
import LetterViewer from '@/components/LetterViewer';
import AnalysisPanel from '@/components/AnalysisPanel';
import ReadingControls from '@/components/ReadingControls';
import ReadingAnalytics from '@/components/ReadingAnalytics';
import { getAllLetterIds, getLetterData, getArchiveStructure } from '@/lib/letters';
import { calculateReadingTime } from '@/lib/textUtils';

export default function LetterPage({ letterData, archiveData, theme, setTheme }) {
    const [analysis, setAnalysis] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fontSize, setFontSize] = useState('text-lg');
    const [lineHeight, setLineHeight] = useState('leading-loose');
    const [readingMode, setReadingMode] = useState('normal');

    // Load preferences from localStorage
    useEffect(() => {
        const savedFontSize = localStorage.getItem('fontSize');
        const savedLineHeight = localStorage.getItem('lineHeight');
        const savedReadingMode = localStorage.getItem('readingMode');
        if (savedFontSize) setFontSize(savedFontSize);
        if (savedLineHeight) setLineHeight(savedLineHeight);
        if (savedReadingMode) setReadingMode(savedReadingMode);
    }, []);

    // Save preferences to localStorage
    useEffect(() => {
        localStorage.setItem('fontSize', fontSize);
        localStorage.setItem('lineHeight', lineHeight);
        localStorage.setItem('readingMode', readingMode);
    }, [fontSize, lineHeight, readingMode]);

    const readingTime = calculateReadingTime(letterData.content);

    const handleAnalyze = async (text) => {
        setIsLoading(true);
        setAnalysis(null);
        setError(null);
        try {
            const res = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ selectedText: text })
            });
            if (!res.ok) {
                throw new Error(`Failed to analyze text (${res.status})`);
            }
            const data = await res.json();
            if (data.message) {
                throw new Error(data.message);
            }
            setAnalysis(data);
        } catch (err) {
            console.error('Analysis error:', err);
            setError(err.message || 'Failed to analyze text. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleExportPDF = () => {
        const printContent = `
      <html>
        <head>
          <title>${letterData.year} Berkshire Hathaway Shareholder Letter</title>
          <style>
            body { font-family: Georgia, serif; max-width: 800px; margin: 40px auto; line-height: 1.8; }
            h1 { color: #0F172A; border-bottom: 2px solid #D4AF37; padding-bottom: 10px; }
            p { margin-bottom: 1em; text-align: justify; }
            @media print { body { margin: 20px; } }
          </style>
        </head>
        <body>
          <h1>${letterData.year} Shareholder Letter</h1>
          <p><strong>Berkshire Hathaway Inc.</strong></p>
          <p>${letterData.content.replace(/\n\n/g, '</p><p>')}</p>
        </body>
      </html>
    `;
        const blob = new Blob([printContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `berkshire-${letterData.year}-letter.html`;
        a.click();
        URL.revokeObjectURL(url);
        alert('Letter exported! You can open the HTML file and use your browser\'s "Print to PDF" feature.');
    };

    const handlePrint = () => {
        window.print();
    };

    const getReadingModeClass = () => {
        switch (readingMode) {
            case 'sepia':
                return 'bg-amber-50 dark:bg-amber-950';
            case 'night':
                return 'bg-slate-900';
            default:
                return 'bg-paper';
        }
    };

    const getReadingModeTextClass = () => (readingMode === 'night' ? 'text-slate-300' : '');

    return (
        <div className="h-screen flex flex-col overflow-hidden">
            <Head>
                <title>{letterData.year} Shareholder Letter - Buffett's Wisdom</title>
            </Head>

            <Header archiveData={archiveData} theme={theme} setTheme={setTheme} />

            <main className="flex-1 flex overflow-hidden">
                {/* Left: Letter */}
                <div className={`flex-[6] overflow-y-auto p-12 scroll-smooth ${getReadingModeClass()} transition-colors duration-300`}>
                    <div className="max-w-3xl mx-auto">
                        {/* Letter Header */}
                        <div className="mb-8 print:mb-4">
                            <div className="text-gold font-bold text-sm uppercase tracking-widest mb-2 print:text-black">
                                Berkshire Hathaway Inc.
                            </div>
                            <h1 className={`font-display text-4xl text-navy dark:text-gold mb-3 print:text-3xl print:text-black ${getReadingModeTextClass()}`}>
                                {letterData.year} Shareholder Letter
                            </h1>
                            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 print:hidden">
                                <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{readingTime.formatted}</span>
                                </div>
                                <span>•</span>
                                <span>{readingTime.wordCount.toLocaleString()} words</span>
                            </div>
                        </div>

                        {/* Reading Analytics */}
                        <div className="print:hidden mb-6">
                            <ReadingAnalytics year={letterData.year} wordCount={readingTime.wordCount} />
                        </div>

                        {/* Reading Controls */}
                        <div className="print:hidden">
                            <ReadingControls
                                fontSize={fontSize}
                                setFontSize={setFontSize}
                                lineHeight={lineHeight}
                                setLineHeight={setLineHeight}
                                readingMode={readingMode}
                                setReadingMode={setReadingMode}
                                onExportPDF={handleExportPDF}
                                onPrint={handlePrint}
                            />
                        </div>

                        {/* Letter Content */}
                        <LetterViewer
                            content={letterData.content}
                            onAnalyze={handleAnalyze}
                            fontSize={fontSize}
                            lineHeight={lineHeight}
                            readingMode={readingMode}
                        />
                    </div>
                </div>

                {/* Right: Analysis */}
                <div className="flex-[4] h-full print:hidden">
                    <AnalysisPanel
                        analysis={analysis}
                        isLoading={isLoading}
                        error={error}
                    />
                </div>
            </main>
        </div>
    );
}

export async function getStaticPaths() {
    const paths = getAllLetterIds();
    return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
    const letterData = await getLetterData(params.year);
    const archiveData = getArchiveStructure();
    return { props: { letterData, archiveData } };
}
