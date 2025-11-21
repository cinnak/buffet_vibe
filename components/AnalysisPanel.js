import { useState } from 'react';
import { Languages, Feather, Lightbulb, ThumbsUp, ThumbsDown, Cpu, Bookmark, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AnalysisPanel({ analysis, isLoading, proficiency, setProficiency, error }) {
    const [isSaved, setIsSaved] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const handleSave = () => {
        if (!analysis) return;

        const savedAnalyses = JSON.parse(localStorage.getItem('savedAnalyses') || '[]');
        const newAnalysis = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            analysis,
            proficiency
        };

        savedAnalyses.unshift(newAnalysis);
        localStorage.setItem('savedAnalyses', JSON.stringify(savedAnalyses.slice(0, 50))); // Keep last 50

        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    const handleCopy = () => {
        if (!analysis) return;

        const textContent = `
LANGUAGE LAB:
${analysis.LanguageLab?.map(item => `- ${item.term} (${item.type}): ${item.definition_cn}`).join('\n')}

RHETORIC & TONE:
Technique: ${analysis.Rhetoric?.technique}
Analysis: ${analysis.Rhetoric?.analysis_cn}

INVESTMENT WISDOM:
Concept: ${analysis.Wisdom?.concept}
${analysis.Wisdom?.explanation_cn}
    `.trim();

        navigator.clipboard.writeText(textContent);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="h-full flex flex-col p-8 bg-navy dark:bg-slate-900 text-slate-100 border-l border-white/10 shadow-[-10px_0_30px_rgba(0,0,0,0.2)] overflow-y-auto">

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2 text-gold text-sm font-bold uppercase tracking-wider">
                    <Cpu className="w-5 h-5" />
                    <span>AI Analysis</span>
                </div>

                {/* Proficiency Selector */}
                <div className="flex bg-white/10 rounded-full p-1">
                    {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                        <button
                            key={level}
                            onClick={() => setProficiency(level)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${proficiency === level
                                    ? 'bg-gold text-navy shadow-sm'
                                    : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            {level}
                        </button>
                    ))}
                </div>
            </div>

            {/* Loading State with Skeleton */}
            {isLoading && (
                <div className="flex-1 space-y-6 animate-pulse">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <div className="h-4 bg-white/10 rounded w-32 mb-4"></div>
                        <div className="space-y-3">
                            <div className="h-3 bg-white/10 rounded w-full"></div>
                            <div className="h-3 bg-white/10 rounded w-5/6"></div>
                            <div className="h-3 bg-white/10 rounded w-4/6"></div>
                        </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <div className="h-4 bg-white/10 rounded w-40 mb-4"></div>
                        <div className="space-y-3">
                            <div className="h-3 bg-white/10 rounded w-full"></div>
                            <div className="h-3 bg-white/10 rounded w-3/4"></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                        <span className="text-3xl">⚠️</span>
                    </div>
                    <h3 className="text-lg font-semibold text-red-400 mb-2">Analysis Failed</h3>
                    <p className="text-sm text-slate-400 max-w-xs">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-gold text-navy rounded-lg hover:bg-yellow-400 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* Empty State */}
            {!analysis && !isLoading && !error && (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-center">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                        <Cpu className="w-8 h-8 text-gold" />
                    </div>
                    <p className="mb-2 font-medium">Select text to begin analysis</p>
                    <p className="text-xs text-slate-600">Highlight a word, sentence, or paragraph from the letter.</p>
                </div>
            )}

            {/* Content */}
            {analysis && !isLoading && !error && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    {/* Action Buttons */}
                    <div className="flex gap-2 pb-4 border-b border-white/10">
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm"
                        >
                            {isSaved ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                            {isSaved ? 'Saved!' : 'Save'}
                        </button>
                        <button
                            onClick={handleCopy}
                            className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm"
                        >
                            {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            {isCopied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>

                    {/* Language Lab */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-2 text-gold font-bold text-sm mb-4 pb-2 border-b border-white/5">
                            <Languages className="w-4 h-4" />
                            <span>Language Lab</span>
                        </div>
                        <div className="space-y-4">
                            {analysis.LanguageLab?.map((item, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <span className="text-lg font-bold text-white">{item.term}</span>
                                        <span className="text-xs bg-gold/20 text-gold px-2 py-0.5 rounded uppercase">{item.type}</span>
                                    </div>
                                    <p className="text-slate-300 text-sm mb-2">{item.definition_cn}</p>
                                    {item.example && (
                                        <p className="text-xs text-slate-500 italic border-l-2 border-white/10 pl-2">
                                            "{item.example}"
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Rhetoric */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-2 text-gold font-bold text-sm mb-4 pb-2 border-b border-white/5">
                            <Feather className="w-4 h-4" />
                            <span>Rhetoric & Tone</span>
                        </div>

                        {analysis.Rhetoric && (
                            <>
                                <div className="bg-black/20 rounded-lg p-4 border-l-2 border-gold mb-4">
                                    <div className="text-xs text-slate-400 uppercase font-bold mb-1">Technique: {analysis.Rhetoric.technique}</div>
                                    <p className="text-slate-200 text-sm leading-relaxed">{analysis.Rhetoric.analysis_cn}</p>
                                </div>
                                {analysis.Rhetoric.tone && (
                                    <div className="bg-black/20 rounded-lg p-4 border-l-2 border-slate-600">
                                        <div className="text-xs text-slate-400 uppercase font-bold mb-1">Tone: {analysis.Rhetoric.tone}</div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Wisdom */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-2 text-gold font-bold text-sm mb-4 pb-2 border-b border-white/5">
                            <Lightbulb className="w-4 h-4" />
                            <span>Investment Wisdom</span>
                        </div>
                        {analysis.Wisdom && (
                            <div>
                                <h4 className="font-display text-white text-lg mb-2">{analysis.Wisdom.concept}</h4>
                                <p className="text-slate-300 text-sm leading-relaxed">
                                    {analysis.Wisdom.explanation_cn}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Feedback */}
                    <div className="flex justify-center gap-4 pt-4 text-slate-500 text-xs">
                        <span>Was this helpful?</span>
                        <button className="hover:text-white transition-colors"><ThumbsUp className="w-4 h-4" /></button>
                        <button className="hover:text-white transition-colors"><ThumbsDown className="w-4 h-4" /></button>
                    </div>

                </motion.div>
            )}
        </div>
    );
}
