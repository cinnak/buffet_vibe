import lettersData from '../data/letters.json';

/**
 * Search for keywords/phrases across all letters
 * @param {string} query - Search query
 * @returns {Array} Array of search results with letter info and snippets
 */
export function searchAllLetters(query) {
    if (!query || query.trim().length < 2) {
        return [];
    }

    const searchTerm = query.trim().toLowerCase();
    const results = [];

    for (const letter of lettersData.letters) {
        const content = letter.content.toLowerCase();
        const title = letter.title.toLowerCase();

        // Find all matches in content
        const matches = [];
        let index = 0;

        while ((index = content.indexOf(searchTerm, index)) !== -1) {
            matches.push(index);
            index += searchTerm.length;
        }

        if (matches.length > 0 || title.includes(searchTerm)) {
            // Get snippet with first match
            const snippet = getSnippetWithHighlight(letter.content, searchTerm);

            results.push({
                year: letter.year,
                title: letter.title,
                matchCount: matches.length,
                snippet: snippet.text,
                highlightedSnippet: snippet.highlighted,
                url: `/letter/${letter.year}`
            });
        }
    }

    // Sort by match count (descending) then by year (descending)
    results.sort((a, b) => {
        if (b.matchCount !== a.matchCount) {
            return b.matchCount - a.matchCount;
        }
        return b.year - a.year;
    });

    return results.slice(0, 50); // Limit to 50 results
}

/**
 * Get a snippet of content around the first match with highlighting
 * @param {string} content - Full content
 * @param {string} searchTerm - Term to search for
 * @param {number} contextChars - Characters of context around match
 * @returns {Object} { text, highlighted }
 */
export function getSnippetWithHighlight(content, searchTerm, contextChars = 80) {
    const lowerContent = content.toLowerCase();
    const index = lowerContent.indexOf(searchTerm.toLowerCase());

    if (index === -1) {
        return {
            text: content.substring(0, 150) + '...',
            highlighted: content.substring(0, 150) + '...'
        };
    }

    // Calculate snippet boundaries
    const start = Math.max(0, index - contextChars);
    const end = Math.min(content.length, index + searchTerm.length + contextChars);

    let snippet = content.substring(start, end);

    // Add ellipsis if truncated
    if (start > 0) snippet = '...' + snippet;
    if (end < content.length) snippet = snippet + '...';

    // Highlight matches in snippet
    const highlighted = highlightMatches(snippet, searchTerm);

    // Clean up newlines for display
    const cleanSnippet = snippet.replace(/\n+/g, ' ').replace(/\s+/g, ' ');

    return {
        text: cleanSnippet,
        highlighted: highlighted.replace(/\n+/g, ' ').replace(/\s+/g, ' ')
    };
}

/**
 * Highlight all occurrences of search term in text
 * @param {string} text - Text to highlight
 * @param {string} searchTerm - Term to highlight (case-insensitive)
 * @returns {string} HTML with <mark> tags around matches
 */
export function highlightMatches(text, searchTerm) {
    if (!searchTerm) return text;

    const regex = new RegExp(`(${escapeRegex(searchTerm)})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800 rounded px-0.5">$1</mark>');
}

/**
 * Escape special regex characters
 * @param {string} string - String to escape
 * @returns {string} Escaped string
 */
function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Group search results by decade
 * @param {Array} results - Search results
 * @returns {Object} Results grouped by decade
 */
export function groupByDecade(results) {
    const groups = {};

    for (const result of results) {
        const decade = Math.floor(result.year / 10) * 10;
        const decadeKey = `${decade}s`;

        if (!groups[decadeKey]) {
            groups[decadeKey] = [];
        }

        groups[decadeKey].push(result);
    }

    return groups;
}
