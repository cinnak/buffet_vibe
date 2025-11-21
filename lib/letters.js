import lettersData from '../data/letters.json';

// Get all letter IDs for static generation
export function getAllLetterIds() {
  return lettersData.letters.map(letter => ({
    params: {
      year: letter.year.toString()
    }
  }));
}

// Get sorted letters (newest first)
export function getSortedLettersData() {
  return lettersData.letters.sort((a, b) => b.year - a.year);
}

// Get archive structure (grouped by decade)
export function getArchiveStructure() {
  const structure = {};

  lettersData.letters.forEach(letter => {
    const decade = `${Math.floor(letter.year / 10) * 10}s`;
    if (!structure[decade]) {
      structure[decade] = [];
    }
    structure[decade].push(letter.year);
  });

  // Sort years within each decade
  Object.keys(structure).forEach(decade => {
    structure[decade].sort((a, b) => b - a);
  });

  return structure;
}

// Get specific letter data
export async function getLetterData(year) {
  const yearNum = parseInt(year);
  const letter = lettersData.letters.find(l => l.year === yearNum);

  if (!letter) {
    return {
      year: yearNum,
      content: `Letter for ${year} not found. This letter may not be available yet or the year may be incorrect.`
    };
  }

  return {
    year: letter.year,
    content: letter.content,
    wordCount: letter.wordCount,
    title: letter.title
  };
}
