const fs = require('fs');
const path = require('path');

// Load existing letters
const dataPath = path.join(__dirname, '..', 'data', 'letters.json');
let data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Remove placeholder entries (low word counts from HTML link pages)
const beforeCount = data.letters.length;
data.letters = data.letters.filter(l => l.wordCount >= 1000);
const removedCount = beforeCount - data.letters.length;

console.log(`Removed ${removedCount} placeholder entries`);

// Sort by year ascending
data.letters.sort((a, b) => a.year - b.year);

// Save cleaned data
fs.writeFileSync(dataPath, JSON.stringify({ letters: data.letters }, null, 2));

console.log(`Final letters: ${data.letters.length}`);

const years = data.letters.map(l => l.year).sort((a,b) => a-b);
console.log(`Year range: ${years[0]} - ${years[years.length-1]}`);

const missing = [];
for (let y = 1977; y <= 2025; y++) {
    if (!years.includes(y)) missing.push(y);
}

console.log(`Missing years (${missing.length}): ${missing.join(', ')}`);
console.log('\nThese years are not available on berkshirehathaway.com');

// Statistics
const totalWords = data.letters.reduce((sum, l) => sum + l.wordCount, 0);
console.log(`\nTotal words: ${totalWords.toLocaleString()}`);
console.log(`Average words per letter: ${Math.round(totalWords / data.letters.length)}`);
