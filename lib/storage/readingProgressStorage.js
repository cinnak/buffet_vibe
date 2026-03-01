// Reading progress storage for tracking scroll position in letters

const STORAGE_KEY = 'buffett_reading_progress';

/**
 * Get progress data for a specific letter
 * @param {number} year - Letter year
 * @returns {Object|null} Progress data or null if not found
 */
export function getProgress(year) {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return null;

        const data = JSON.parse(stored);
        return data.progress?.[year] || null;
    } catch (error) {
        console.error('Error reading progress:', error);
        return null;
    }
}

/**
 * Save progress for a letter
 * @param {number} year - Letter year
 * @param {number} scrollTop - Scroll position in pixels
 * @param {number} scrollHeight - Total scroll height
 * @param {number} percentage - Read percentage (0-100)
 */
export function saveProgress(year, scrollTop, scrollHeight, percentage) {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const data = stored ? JSON.parse(stored) : { progress: {} };

        data.progress[year] = {
            scrollTop,
            scrollHeight,
            percentage: Math.round(percentage),
            lastRead: new Date().toISOString(),
            isCompleted: percentage >= 95
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error('Error saving progress:', error);
    }
}

/**
 * Mark a letter as completed
 * @param {number} year - Letter year
 */
export function markComplete(year) {
    saveProgress(year, 0, 0, 100);
}

/**
 * Get all progress data
 * @returns {Object} All progress data
 */
export function getAllProgress() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : { progress: {} };
    } catch (error) {
        console.error('Error reading all progress:', error);
        return { progress: {} };
    }
}

/**
 * Check if a letter is completed
 * @param {number} year - Letter year
 * @returns {boolean} True if completed
 */
export function isCompleted(year) {
    const progress = getProgress(year);
    return progress?.isCompleted || false;
}

/**
 * Clear progress for a specific letter
 * @param {number} year - Letter year
 */
export function clearProgress(year) {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const data = stored ? JSON.parse(stored) : { progress: {} };

        delete data.progress[year];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error('Error clearing progress:', error);
    }
}
