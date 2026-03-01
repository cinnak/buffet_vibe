const fs = require('fs');
const path = require('path');

// Load existing letters
const dataPath = path.join(__dirname, '..', 'data', 'letters.json');
let data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Find and remove low word count entries (placeholders from HTML pages)
const beforeCount = data.letters.length;
data.letters = data.letters.filter(l => l.wordCount >= 500 || l.content.length > 500);
const removedCount = beforeCount - data.letters.length;

console.log(`Removed ${removedCount} low word count entries`);

// Save cleaned data
fs.writeFileSync(dataPath, JSON.stringify({ letters: data.letters }, null, 2));

console.log(`Remaining letters: ${data.letters.length}`);

const years = data.letters.map(l => l.year).sort((a,b) => a-b);
const missing = [];
for (let y = 1977; y <= 2025; y++) {
    if (!years.includes(y)) missing.push(y);
}

console.log('Missing years after cleanup:', missing.join(', '));
