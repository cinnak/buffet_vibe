const axios = require('axios');
const fs = require('fs');
const path = require('path');
const PDFParser = require('pdf2json');

const BASE_URL = 'https://www.berkshirehathaway.com';

// Annual reports that contain shareholder letters for missing years
const annualReports = [
    { year: 1998, pdf: '1998ar/1998ar.pdf' },
    { year: 1999, pdf: '1999ar/1999ar.pdf' },
    { year: 2000, pdf: '2000ar/2000ar.pdf' },
    { year: 2001, pdf: '2001ar/2001ar.pdf' },
    { year: 2002, pdf: '2002ar/2002ar.pdf' },
];

const lettersDir = path.join(__dirname, '..', 'letters');

async function downloadPDF(year, pdfPath) {
    const url = `${BASE_URL}/${pdfPath}`;
    const filePath = path.join(lettersDir, `${year}ar.pdf`);

    // Check if already downloaded
    if (fs.existsSync(filePath)) {
        return filePath;
    }

    console.log(`  Downloading ${year} annual report...`);

    try {
        const response = await axios({
            method: 'GET',
            url: url,
            responseType: 'arraybuffer',
            timeout: 60000
        });

        fs.writeFileSync(filePath, response.data);
        console.log(`  ✅ Downloaded ${year} annual report`);
        return filePath;
    } catch (error) {
        console.error(`  ❌ Failed to download ${year} annual report:`, error.message);
        return null;
    }
}

function extractTextFromPdfData(pdfData) {
    var fullText = '';

    if (pdfData.Pages) {
        for (const page of pdfData.Pages) {
            if (page.Texts) {
                for (const textItem of page.Texts) {
                    if (textItem.R) {
                        for (const r of textItem.R) {
                            if (r.T) {
                                let decoded = r.T;
                                try {
                                    decoded = decodeURIComponent(r.T);
                                } catch (e) {}
                                fullText += decoded + ' ';
                            }
                        }
                    }
                }
            }
            fullText += '\n';
        }
    }

    return fullText;
}

function extractShareholderLetter(fullText, year) {
    // Try to find the beginning of the shareholder letter
    // Common patterns in Berkshire annual reports
    const patterns = [
        /To the Shareholders of Berkshire Hathaway Inc\:/i,
        /BERKSHIRE HATHAWAY INC\..*\n.*Shareholders/i,
        /CHAIRMAN'S LETTER.*\n.*TO THE SHAREHOLDERS/i,
        /Chairman's Letter.*\n.*Shareholders/i,
        /Shareholder Letter/i,
    ];

    let startIndex = -1;
    for (const pattern of patterns) {
        const match = fullText.match(pattern);
        if (match) {
            startIndex = match.index;
            break;
        }
    }

    if (startIndex === -1) {
        // If no pattern found, look for "Berkshire" and related keywords
        const berkshireMatch = fullText.indexOf('Berkshire');
        if (berkshireMatch > 0 && berkshireMatch < 5000) {
            startIndex = berkshireMatch - 200; // Start a bit before
        }
    }

    // Try to find the end of the letter
    let endIndex = fullText.length;
    const endPatterns = [
        /\n\n.*Financial Statements/,
        /\n\n.*CONSOLIDATED STATEMENTS/,
        /\n\n.*Management's Discussion/,
        /\n\n.*Item 1/,
    ];

    for (const pattern of endPatterns) {
        const match = fullText.substring(startIndex >= 0 ? startIndex : 0).match(pattern);
        if (match && match.index > 5000) {
            endIndex = startIndex + match.index;
            break;
        }
    }

    let letterText = startIndex >= 0 ? fullText.substring(startIndex, endIndex) : fullText;

    // Clean up
    letterText = letterText
        .replace(/[ \t]+/g, ' ')
        .replace(/\n{3,}/g, '\n\n')
        .trim();

    // If text is too long, it might include the whole report - trim it
    if (letterText.length > 200000) {
        letterText = letterText.substring(0, 150000);
    }

    return letterText;
}

function parsePDF(filePath, year) {
    return new Promise((resolve, reject) => {
        const pdfParser = new PDFParser();

        pdfParser.on('pdfParser_dataError', errData => {
            reject(new Error(errData.parserError || 'PDF parsing error'));
        });

        pdfParser.on('pdfParser_dataReady', pdfData => {
            const fullText = extractTextFromPdfData(pdfData);
            const letterText = extractShareholderLetter(fullText, year);

            let cleanText = letterText
                .replace(/[ \t]+/g, ' ')
                .replace(/\n{3,}/g, '\n\n')
                .trim();

            const wordCount = cleanText.split(/\s+/).filter(w => w.length > 0).length;

            console.log(`  ✅ Parsed ${year}: ${wordCount} words`);

            resolve({
                year: year,
                title: `${year} Shareholder Letter`,
                content: cleanText,
                wordCount: wordCount,
                url: `${BASE_URL}/${year}ar/${year}ar.pdf`,
                source: 'annual_report',
                fetchedAt: new Date().toISOString()
            });
        });

        pdfParser.loadPDF(filePath);
    });
}

async function fetchAnnualReportLetters() {
    console.log('🚀 Fetching letters from annual reports...\n');

    if (!fs.existsSync(lettersDir)) {
        fs.mkdirSync(lettersDir, { recursive: true });
    }

    // Load existing letters
    const dataPath = path.join(__dirname, '..', 'data', 'letters.json');
    let existingData = { letters: [] };

    if (fs.existsSync(dataPath)) {
        existingData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        const existingYears = existingData.letters.map(l => l.year).sort((a, b) => a - b);
        console.log(`📚 Existing letters: ${existingYears.join(', ')} (${existingYears.length} total)\n`);
    }

    const newLetters = [];

    for (const report of annualReports) {
        // Skip if we already have this year with substantial content
        const existing = existingData.letters.find(l => l.year === report.year);
        if (existing && existing.wordCount >= 5000) {
            console.log(`⏭️  Skipping ${report.year} (already have good content)`);
            continue;
        }

        const pdfPath = await downloadPDF(report.year, report.pdf);
        if (pdfPath) {
            try {
                const letter = await parsePDF(pdfPath, report.year);
                if (letter && letter.content.length > 1000) {
                    newLetters.push(letter);
                } else {
                    console.log(`  ⚠️  Skipping ${report.year} (content too short)`);
                }
            } catch (error) {
                console.error(`  ❌ Failed to parse ${report.year}:`, error.message);
            }
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Remove old placeholder entries for these years
    const newYears = newLetters.map(l => l.year);
    existingData.letters = existingData.letters.filter(l => !newYears.includes(l.year));

    // Combine and save
    const allLetters = [...existingData.letters, ...newLetters];
    allLetters.sort((a, b) => a.year - b.year);

    const outputPath = path.join(__dirname, '..', 'data', 'letters.json');
    fs.writeFileSync(outputPath, JSON.stringify({ letters: allLetters }, null, 2));

    console.log(`\n✅ Successfully processed ${newLetters.length} new letters`);
    console.log(`📁 Saved to: ${outputPath}`);
    console.log(`📊 Total letters: ${allLetters.length}`);

    const finalYears = allLetters.map(l => l.year).sort((a, b) => a - b);
    console.log(`📅 Year range: ${finalYears[0]} - ${finalYears[finalYears.length - 1]}`);

    const allPossibleYears = [];
    for (let y = 1977; y <= 2025; y++) allPossibleYears.push(y);
    const missingYears = allPossibleYears.filter(y => !finalYears.includes(y));
    if (missingYears.length > 0) {
        console.log(`\n⚠️  Missing years: ${missingYears.join(', ')}`);
    } else {
        console.log(`\n🎉 Complete! All years 1977-2025 available!`);
    }
}

fetchAnnualReportLetters().catch(console.error);
