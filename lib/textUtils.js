// Utility to format PDF text into better paragraphs
export function formatPDFText(rawText) {
    if (!rawText) return '';

    // Split by double line breaks (paragraph indicators)
    let paragraphs = rawText.split(/\n\n+/);

    // Process each paragraph
    paragraphs = paragraphs.map(para => {
        // Remove excessive whitespace
        para = para.trim();

        // Replace single line breaks with spaces (unless it's a list item)
        if (!para.match(/^\s*[-•*]\s/)) {
            para = para.replace(/\n/g, ' ');
        }

        // Clean up multiple spaces
        para = para.replace(/\s+/g, ' ');

        return para;
    });

    // Filter out empty paragraphs
    paragraphs = paragraphs.filter(p => p.length > 0);

    return paragraphs;
}

// Calculate reading time (assumes 200 words per minute)
export function calculateReadingTime(text, wordsPerMinute = 200) {
    if (!text) return 0;

    const wordCount = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);

    return {
        minutes,
        wordCount,
        formatted: minutes === 1 ? '1 min read' : `${minutes} min read`
    };
}

// Check if text looks like a header
export function isHeader(text) {
    // Headers are typically:
    // - Short (< 100 chars)
    // - All caps or Title Case
    // - May end without punctuation
    if (text.length > 100) return false;
    if (text.match(/^[A-Z\s]+$/)) return true; // ALL CAPS
    if (text.match(/^[A-Z][a-z]+(\s[A-Z][a-z]+)*$/)) return true; // Title Case
    return false;
}

// Detect if text is a table row
export function isTableRow(text) {
    // Tables often have multiple numbers or specific patterns
    const numberCount = (text.match(/\d+/g) || []).length;
    const hasMultipleSpaces = text.match(/\s{2,}/);
    return numberCount >= 3 && hasMultipleSpaces;
}
