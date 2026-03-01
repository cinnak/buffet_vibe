// Vocabulary storage for saving words from AI LanguageLab analysis

const STORAGE_KEY = 'buffett_vocabulary';
const MAX_WORDS = 100;

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

/**
 * Get all saved vocabulary words
 * @returns {Array} Array of vocabulary items
 */
export function getVocabulary() {
    if (!isBrowser) return [];

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];

        const data = JSON.parse(stored);
        return data.words || [];
    } catch (error) {
        console.error('Error reading vocabulary:', error);
        return [];
    }
}

/**
 * Check if a word is already saved
 * @param {string} term - Word term to check
 * @returns {boolean} True if word is saved
 */
export function isWordSaved(term) {
    const words = getVocabulary();
    return words.some(w => w.term.toLowerCase() === term.toLowerCase());
}

/**
 * Add a word to vocabulary
 * @param {Object} wordData - Word data { term, type, definition_cn, example, sourceLetter }
 * @returns {boolean} True if successfully added
 */
export function addWord(wordData) {
    if (!isBrowser) return false;

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const data = stored ? JSON.parse(stored) : { words: [] };

        // Check for duplicates
        if (data.words.some(w => w.term.toLowerCase() === wordData.term.toLowerCase())) {
            return false; // Already exists
        }

        // Enforce max limit (remove oldest if at limit)
        if (data.words.length >= MAX_WORDS) {
            data.words = data.words.slice(1); // Remove oldest
        }

        const newWord = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            term: wordData.term,
            type: wordData.type || 'Expression',
            definition_cn: wordData.definition_cn,
            example: wordData.example || '',
            sourceLetter: wordData.sourceLetter || null,
            createdAt: new Date().toISOString(),
            reviewCount: 0,
            lastReviewed: null
        };

        data.words.push(newWord);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error adding word:', error);
        return false;
    }
}

/**
 * Remove a word from vocabulary
 * @param {string} id - Word ID to remove
 * @returns {boolean} True if successfully removed
 */
export function removeWord(id) {
    if (!isBrowser) return false;

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return false;

        const data = JSON.parse(stored);
        const initialLength = data.words.length;
        data.words = data.words.filter(w => w.id !== id);

        if (data.words.length < initialLength) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error removing word:', error);
        return false;
    }
}

/**
 * Get words grouped by type
 * @returns {Object} Words grouped by type
 */
export function getWordsByType() {
    const words = getVocabulary();
    const grouped = {};

    for (const word of words) {
        const type = word.type || 'Other';
        if (!grouped[type]) {
            grouped[type] = [];
        }
        grouped[type].push(word);
    }

    return grouped;
}

/**
 * Search words by term or definition
 * @param {string} query - Search query
 * @returns {Array} Matching words
 */
export function searchWords(query) {
    const words = getVocabulary();
    const lowerQuery = query.toLowerCase();

    return words.filter(w =>
        w.term.toLowerCase().includes(lowerQuery) ||
        (w.definition_cn && w.definition_cn.includes(query))
    );
}

/**
 * Clear all vocabulary
 */
export function clearVocabulary() {
    if (!isBrowser) return;
    localStorage.removeItem(STORAGE_KEY);
}

/**
 * Get vocabulary count
 * @returns {number} Number of saved words
 */
export function getVocabularyCount() {
    return getVocabulary().length;
}
