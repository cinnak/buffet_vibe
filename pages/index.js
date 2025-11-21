import Head from 'next/head';
import Link from 'next/link';
import { BookOpen, TrendingUp } from 'lucide-react';
import Header from '@/components/Header';
import { getArchiveStructure, getSortedLettersData } from '@/lib/letters';

export default function Home({ archiveData, latestYear, theme, setTheme }) {
  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Head>
        <title>Buffett's Wisdom - Learn English & Investing</title>
        <meta name="description" content="Unlock Language. Master Markets. Learn from Warren Buffett's shareholder letters." />
      </Head>

      <Header archiveData={archiveData} theme={theme} setTheme={setTheme} />

      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="flex-1 flex items-center px-16 py-20 bg-gradient-to-br from-paper to-slate-50 dark:from-slate-950 dark:to-slate-900">
          <div className="flex-1 pr-16">
            <h1 className="font-display text-6xl text-navy dark:text-gold leading-[1.1] mb-6">
              Unlock Language.<br />Master Markets.
            </h1>
            <p className="text-xl text-slate-500 dark:text-slate-400 mb-10 max-w-lg leading-relaxed">
              Your dual path to IELTS fluency and investment acumen. Learn directly from the Oracle of Omaha.
            </p>

            <Link
              href={`/letter/${latestYear}`}
              className="inline-block bg-navy dark:bg-gold text-gold dark:text-navy px-8 py-4 rounded-full font-semibold text-lg hover:-translate-y-1 hover:shadow-xl transition-all"
            >
              Start Learning Now
            </Link>

            <div className="mt-12 flex gap-8">
              <div>
                <BookOpen className="w-6 h-6 text-gold dark:text-gold mb-2" />
                <p className="font-semibold text-sm text-navy dark:text-slate-200">Deep Reading</p>
              </div>
              <div>
                <TrendingUp className="w-6 h-6 text-gold dark:text-gold mb-2" />
                <p className="font-semibold text-sm text-navy dark:text-slate-200">Market Insight</p>
              </div>
            </div>
          </div>

          <div className="flex-1 h-[600px] bg-slate-200 dark:bg-slate-800 rounded-3xl relative overflow-hidden shadow-2xl flex items-center justify-center text-slate-400 dark:text-slate-600 italic">
            {/* Placeholder for Hero Image */}
            [High-Quality Image: Coffee, iPad with Charts, Open Book]
          </div>
        </section>

        <div className="h-24 bg-navy dark:bg-slate-900 flex items-center justify-center text-gold tracking-widest text-sm uppercase font-semibold border-t border-gold/20">
          Scroll Down for Study Interface Preview
        </div>
      </main>
    </div>
  );
}

export async function getStaticProps() {
  const archiveData = getArchiveStructure();
  const allLetters = getSortedLettersData();
  const latestYear = allLetters.length > 0 ? allLetters[0].year : 2018; // Default fallback

  return {
    props: {
      archiveData,
      latestYear,
    },
  };
}
