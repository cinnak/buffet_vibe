const fs = require('fs');
let data = JSON.parse(fs.readFileSync('./data/letters.json', 'utf8'));
data.letters = data.letters.filter(l => l.year !== 2004);
fs.writeFileSync('./data/letters.json', JSON.stringify({ letters: data.letters }, null, 2));
console.log('Removed 2004 placeholder, remaining:', data.letters.length);
