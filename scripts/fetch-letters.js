const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://www.berkshirehathaway.com/letters';

// Map of years to their HTML files (based on berkshirehathaway.com/letters/letters.html)
const letterUrls = {
    2024: '2024ltr.pdf', // Note: 2024 might still be PDF, we'll handle this
    2023: '2023ltr.pdf',
    2022: '2022ltr.pdf',
    2021: '2021ltr.pdf',
    2020: '2020ltr.pdf',
    2019: '2019ltr.pdf',
    2018: '2018ltr.pdf',
    2017: '2017ltr.pdf',
    2016: '2016ltr.pdf',
    2015: '2015ltr.pdf',
    2014: '2014ltr.pdf',
    2013: '2013ltr.pdf',
    2012: '2012ltr.pdf',
    // For earlier years, they often have HTML versions
    2011: '2011ltr.html',
    2010: '2010ltr.html',
    2009: '2009ltr.html',
    2008: '2008ltr.html',
    2007: '2007ltr.html',
    2006: '2006ltr.html',
    2005: '2005ltr.html',
    2004: '2004ltr.html',
    2003: '2003ltr.html',
    2002: '2002ltr.html',
    2001: '2001ltr.html',
    2000: '2000ltr.html',
    1999: '1999ltr.html',
    1998: '1998ltr.html',
    1997: '1997letter.html',
    1996: '1996.html',
    1995: '1995.html',
    1994: '1994.html',
    1993: '1993.html',
    1992: '1992.html',
    1991: '1991.html',
    1990: '1990.html',
    1989: '1989.html',
    1988: '1988.html',
    1987: '1987.html',
    1986: '1986.html',
    1985: '1985.html',
    1984: '1984.html',
    1983: '1983.html',
    1982: '1982.html',
    1981: '1981.html',
    1980: '1980.html',
    1979: '1979.html',
    1978: '1978.html',
    1977: '1977.html',
};

async function fetchLetter(year, filename) {
    const url = `${BASE_URL}/${filename}`;

    console.log(`Fetching ${year}: ${url}`);

    try {
        // Skip PDFs for now (we'll use local PDFs or implement PDF parsing later)
        if (filename.endsWith('.pdf')) {
            console.log(`  ⏭️  Skipping PDF for ${year} (will use local file)`);
            return null;
        }

        const response = await axios.get(url, { timeout: 10000 });
        const $ = cheerio.load(response.data);

        // Extract text from HTML
        // Remove script and style elements
        $('script, style').remove();

        // Get the main content (usually in body or a main container)
        let content = $('body').text();

        // Clean up the text
        content = content
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .replace(/\n+/g, '\n\n') // Normalize line breaks
            .trim();

        // Calculate word count
        const wordCount = content.split(/\s+/).length;

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

async function fetchAllLetters() {
    console.log('🚀 Starting to fetch Berkshire Hathaway letters...\n');

    const letters = [];

    // Fetch letters sequentially to avoid overwhelming the server
    for (const [year, filename] of Object.entries(letterUrls)) {
        const letter = await fetchLetter(year, filename);
        if (letter) {
            letters.push(letter);
        }
        // Small delay to be respectful to the server
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Sort by year descending
    letters.sort((a, b) => b.year - a.year);

    // Save to JSON file
    const dataDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    const outputPath = path.join(dataDir, 'letters.json');
    fs.writeFileSync(outputPath, JSON.stringify({ letters }, null, 2));

    console.log(`\n✅ Successfully fetched ${letters.length} letters`);
    console.log(`📁 Saved to: ${outputPath}`);
    console.log(`📊 Total words: ${letters.reduce((sum, l) => sum + l.wordCount, 0).toLocaleString()}`);
}

// Run the scraper
fetchAllLetters().catch(console.error);
