const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://www.berkshirehathaway.com/letters';

// Missing HTML letters (1997-2012)
// The actual format is YYYY.html (not YYYYltr.html)
const missingLetterUrls = {
    2012: '2012.html',
    2011: '2011.html',
    2010: '2010.html',
    2009: '2009.html',
    2008: '2008.html',
    2007: '2007.html',
    2006: '2006.html',
    2005: '2005.html',
    2004: '2004.html',
    2003: '2003.html',
    2002: '2002.html',
    2001: '2001.html',
    2000: '2000.html',
    1999: '1999.html',
    1998: '1998.html',
    1997: '1997.html',
};

async function fetchLetter(year, filename) {
    const url = `${BASE_URL}/${filename}`;

    console.log(`Fetching ${year}: ${url}`);

    try {
        const response = await axios.get(url, {
            timeout: 15000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        const $ = cheerio.load(response.data);

        // Remove script and style elements
        $('script, style').remove();

        // Get the main content
        let content = $('body').text();

        // Clean up the text - preserve paragraph structure
        content = content
            .replace(/[ \t]+/g, ' ')  // Normalize spaces and tabs
            .replace(/\n{3,}/g, '\n\n')  // Limit consecutive newlines
            .trim();

        // Calculate word count
        const wordCount = content.split(/\s+/).filter(w => w.length > 0).length;

        console.log(`  ✅ Fetched ${year}: ${wordCount} words`);

        return {
            year: parseInt(year),
            title: `${year} Shareholder Letter`,
            content: content,
            wordCount: wordCount,
            url: url,
            fetchedAt: new Date().toISOString()
        };
    } catch (error) {
        console.error(`  ❌ Error fetching ${year}:`, error.message);
        return null;
    }
}

async function fetchMissingLetters() {
    console.log('🚀 Fetching missing HTML letters (1997-2012)...\n');

    // Load existing letters
    const dataPath = path.join(__dirname, '..', 'data', 'letters.json');
    let existingData = { letters: [] };

    if (fs.existsSync(dataPath)) {
        existingData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        const existingYears = existingData.letters.map(l => l.year).sort((a, b) => a - b);
        console.log(`📚 Existing letters: ${existingYears.join(', ')} (${existingYears.length} total)\n`);
    }

    const newLetters = [];

    // Fetch missing letters
    for (const [year, filename] of Object.entries(missingLetterUrls)) {
        const letter = await fetchLetter(year, filename);
        if (letter) {
            newLetters.push(letter);
        }
        // Be respectful to the server
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Combine existing and new letters
    const allLetters = [...existingData.letters, ...newLetters];

    // Sort by year ascending
    allLetters.sort((a, b) => a.year - b.year);

    // Save to JSON file
    const outputPath = path.join(__dirname, '..', 'data', 'letters.json');
    fs.writeFileSync(outputPath, JSON.stringify({ letters: allLetters }, null, 2));

    console.log(`\n✅ Successfully fetched ${newLetters.length} new letters`);
    console.log(`📁 Saved to: ${outputPath}`);
    console.log(`📊 Total letters: ${allLetters.length}`);

    const finalYears = allLetters.map(l => l.year).sort((a, b) => a - b);
    console.log(`📅 Year range: ${finalYears[0]} - ${finalYears[finalYears.length - 1]}`);
}

// Run the script
fetchMissingLetters().catch(console.error);
