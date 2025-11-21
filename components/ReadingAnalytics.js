import { useState, useEffect } from 'react';
import { BookOpen, Clock, TrendingUp, Flame, Award, Calendar } from 'lucide-react';

export default function ReadingAnalytics({ year, wordCount, onClose }) {
    const [stats, setStats] = useState({
        todayTime: 0,
        todayWords: 0,
        streak: 0,
        weeklyData: [],
        totalLettersRead: 0,
        vocabularyLearned: 0,
        achievements: []
    });

    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        // Load reading stats from localStorage
        const loadedStats = loadReadingStats();
        setStats(loadedStats);

        // Track page reading time
        const startTime = Date.now();

        return () => {
            const timeSpent = Math.floor((Date.now() - startTime) / 1000 / 60); // minutes
            saveReadingSession(year, timeSpent, wordCount);
        };
    }, [year, wordCount]);

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            {/* Compact Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            Your Reading Insights
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            {stats.todayTime} min today • {stats.streak} day streak
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {stats.streak >= 3 && <Flame className="w-5 h-5 text-orange-500" />}
                    <svg
                        className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="px-6 pb-6 border-t border-slate-200 dark:border-slate-700">
                    {/* Today's Stats */}
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <StatCard
                            icon={<Clock className="w-5 h-5" />}
                            label="Time Today"
                            value={`${stats.todayTime} min`}
                            color="blue"
                        />
                        <StatCard
                            icon={<BookOpen className="w-5 h-5" />}
                            label="Words Read"
                            value={stats.todayWords.toLocaleString()}
                            color="green"
                        />
                    </div>

                    {/* Streak */}
                    <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                        <div className="flex items-center gap-3">
                            <Flame className="w-6 h-6 text-orange-500" />
                            <div>
                                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                    {stats.streak} Days
                                </div>
                                <div className="text-xs text-orange-700 dark:text-orange-300">
                                    Current reading streak
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Weekly Chart */}
                    <div className="mt-4">
                        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            This Week
                        </h4>
                        <WeeklyChart data={stats.weeklyData} />
                    </div>

                    {/* Achievements */}
                    {stats.achievements.length > 0 && (
                        <div className="mt-4">
                            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                                <Award className="w-4 h-4" />
                                Recent Achievements
                            </h4>
                            <div className="space-y-2">
                                {stats.achievements.slice(0, 3).map((achievement, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800"
                                    >
                                        <div className="text-2xl">{achievement.emoji}</div>
                                        <div className="flex-1">
                                            <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                                {achievement.title}
                                            </div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400">
                                                {achievement.description}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function StatCard({ icon, label, value, color }) {
    const colorClasses = {
        blue: 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
        green: 'bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800',
        purple: 'bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800'
    };

    return (
        <div className={`p-4 rounded-lg border ${colorClasses[color]}`}>
            <div className="mb-2">{icon}</div>
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-xs mt-1 opacity-80">{label}</div>
        </div>
    );
}

function WeeklyChart({ data }) {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const maxMinutes = Math.max(...data.map(d => d.minutes), 60);

    return (
        <div className="flex items-end justify-between gap-2 h-32">
            {days.map((day, idx) => {
                const dayData = data[idx] || { minutes: 0 };
                const height = (dayData.minutes / maxMinutes) * 100;
                const isToday = idx === new Date().getDay() - 1;

                return (
                    <div key={day} className="flex-1 flex flex-col items-center gap-2">
                        <div className="flex-1 flex items-end w-full">
                            <div
                                className={`w-full rounded-t transition-all ${isToday
                                        ? 'bg-gradient-to-t from-blue-500 to-purple-500'
                                        : 'bg-slate-300 dark:bg-slate-600'
                                    }`}
                                style={{ height: `${height}%` }}
                            />
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            {day}
                        </div>
                        {dayData.minutes > 0 && (
                            <div className="text-xs text-slate-600 dark:text-slate-300 font-semibold">
                                {dayData.minutes}m
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// Utility functions
function loadReadingStats() {
    if (typeof window === 'undefined') return getDefaultStats();

    const stored = localStorage.getItem('buffett_reading_stats');
    if (!stored) return getDefaultStats();

    try {
        const stats = JSON.parse(stored);
        return {
            ...stats,
            todayTime: getTodayTime(stats.sessions),
            todayWords: getTodayWords(stats.sessions),
            streak: calculateStreak(stats.sessions),
            weeklyData: getWeeklyData(stats.sessions)
        };
    } catch {
        return getDefaultStats();
    }
}

function saveReadingSession(year, minutes, words) {
    if (typeof window === 'undefined' || minutes < 1) return;

    const stored = localStorage.getItem('buffett_reading_stats');
    const stats = stored ? JSON.parse(stored) : { sessions: [], achievements: [] };

    const today = new Date().toISOString().split('T')[0];
    const session = {
        year,
        date: today,
        minutes,
        words,
        timestamp: Date.now()
    };

    stats.sessions.push(session);

    // Check for new achievements
    const newAchievements = checkAchievements(stats);
    stats.achievements = [...stats.achievements, ...newAchievements];

    localStorage.setItem('buffett_reading_stats', JSON.stringify(stats));
}

function getTodayTime(sessions = []) {
    const today = new Date().toISOString().split('T')[0];
    return sessions
        .filter(s => s.date === today)
        .reduce((sum, s) => sum + s.minutes, 0);
}

function getTodayWords(sessions = []) {
    const today = new Date().toISOString().split('T')[0];
    return sessions
        .filter(s => s.date === today)
        .reduce((sum, s) => sum + s.words, 0);
}

function calculateStreak(sessions = []) {
    if (sessions.length === 0) return 0;

    const uniqueDates = [...new Set(sessions.map(s => s.date))].sort().reverse();
    let streak = 0;
    let checkDate = new Date();

    for (const dateStr of uniqueDates) {
        const sessionDate = new Date(dateStr);
        const diffDays = Math.floor((checkDate - sessionDate) / (1000 * 60 * 60 * 24));

        if (diffDays <= streak) {
            streak++;
            checkDate = sessionDate;
        } else {
            break;
        }
    }

    return streak;
}

function getWeeklyData(sessions = []) {
    const weekData = Array(7).fill(null).map(() => ({ minutes: 0 }));
    const today = new Date();

    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - (6 - i));
        const dateStr = date.toISOString().split('T')[0];

        weekData[i].minutes = sessions
            .filter(s => s.date === dateStr)
            .reduce((sum, s) => sum + s.minutes, 0);
    }

    return weekData;
}

function checkAchievements(stats) {
    const achievements = [];
    const totalSessions = stats.sessions.length;

    if (totalSessions === 1) {
        achievements.push({
            emoji: '🎯',
            title: 'First Steps!',
            description: 'Started your reading journey',
            date: Date.now()
        });
    }

    if (totalSessions === 5) {
        achievements.push({
            emoji: '📚',
            title: 'Dedicated Reader',
            description: 'Completed 5 reading sessions',
            date: Date.now()
        });
    }

    const streak = calculateStreak(stats.sessions);
    if (streak === 7) {
        achievements.push({
            emoji: '🔥',
            title: 'Week Warrior!',
            description: '7 day reading streak',
            date: Date.now()
        });
    }

    return achievements;
}

function getDefaultStats() {
    return {
        todayTime: 0,
        todayWords: 0,
        streak: 0,
        weeklyData: Array(7).fill({ minutes: 0 }),
        totalLettersRead: 0,
        vocabularyLearned: 0,
        achievements: []
    };
}
