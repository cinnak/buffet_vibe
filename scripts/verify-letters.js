const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./data/letters.json', 'utf8'));
const years = data.letters.map(l => l.year).sort((a,b) => a-b);
const missing = [];

for (let y = 1977; y <= 2025; y++) {
    if (!years.includes(y)) missing.push(y);
}

console.log('Total letters:', years.length);
console.log('Year range:', years[0], '-', years[years.length-1]);
console.log('Missing years:', missing.length > 0 ? missing.join(', ') : 'None - Complete!');
console.log('\nSample word counts:');
data.letters.slice(0, 10).forEach(l => console.log('  ' + l.year + ': ' + l.wordCount + ' words'));
