const axios = require('axios');
const fs = require('fs');
const path = require('path');
const PDFParser = require('pdf2json');

const BASE_URL = 'https://www.berkshirehathaway.com/letters';

// Years that have PDFs available on the website
const availablePDFYears = [
    2003, 2004, 2005, 2006, 2007,
    2008, 2009, 2010, 2011, 2012,
    2013, 2014, 2015, 2016,
    2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025
];

// Years that only have HTML placeholder (no actual content available)
const unavailableYears = [1998, 1999, 2000, 2001, 2002];

// Letters directory for storing PDFs
const lettersDir = path.join(__dirname, '..', 'letters');

async function downloadPDF(year) {
    const url = `${BASE_URL}/${year}ltr.pdf`;
    const filePath = path.join(lettersDir, `${year}ltr.pdf`);

    // Check if already downloaded
    if (fs.existsSync(filePath)) {
        return filePath;
    }

    console.log(`  Downloading ${year} PDF...`);

    try {
        const response = await axios({
            method: 'GET',
            url: url,
            responseType: 'arraybuffer',
            timeout: 30000
        });

        fs.writeFileSync(filePath, response.data);
        console.log(`  ✅ Downloaded ${year} PDF`);
        return filePath;
    } catch (error) {
        console.error(`  ❌ Failed to download ${year} PDF:`, error.message);
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
                                // Decode base64-like text
                                let decoded = r.T;
                                try {
                                    // pdf2json encodes special characters
                                    decoded = decodeURIComponent(r.T);
                                } catch (e) {
                                    // Keep original if decoding fails
                                }
                                fullText += decoded + ' ';
                            }
                        }
                    }
                }
            }
            fullText += '\n'; // Add line break between pages
        }
    }

    return fullText;
}

function parsePDF(filePath, year) {
    return new Promise((resolve, reject) => {
        const pdfParser = new PDFParser();

        pdfParser.on('pdfParser_dataError', errData => {
            reject(new Error(errData.parserError || 'PDF parsing error'));
        });

        pdfParser.on('pdfParser_dataReady', pdfData => {
            let fullText = extractTextFromPdfData(pdfData);

            // Clean up the text
            fullText = fullText
                .replace(/[ \t]+/g, ' ')  // Normalize spaces and tabs
                .replace(/\n{3,}/g, '\n\n')  // Limit consecutive newlines
                .trim();

            const wordCount = fullText.split(/\s+/).filter(w => w.length > 0).length;

            console.log(`  ✅ Parsed ${year}: ${wordCount} words`);

            resolve({
                year: year,
                title: `${year} Shareholder Letter`,
                content: fullText,
                wordCount: wordCount,
                url: `${BASE_URL}/${year}ltr.pdf`,
                fetchedAt: new Date().toISOString()
            });
        });

        pdfParser.loadPDF(filePath);
    });
}

async function fetchPDFLetters() {
    console.log('🚀 Fetching PDF letters...\n');

    // Ensure letters directory exists
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

    // Process each year
    for (const year of availablePDFYears) {
        // Skip if we already have this year
        if (existingData.letters.some(l => l.year === year)) {
            console.log(`⏭️  Skipping ${year} (already exists)`);
            continue;
        }

        const pdfPath = await downloadPDF(year);
        if (pdfPath) {
            try {
                const letter = await parsePDF(pdfPath, year);
                if (letter && letter.content.length > 100) {
                    newLetters.push(letter);
                } else {
                    console.log(`  ⚠️  Skipping ${year} (content too short)`);
                }
            } catch (error) {
                console.error(`  ❌ Failed to parse ${year}:`, error.message);
            }
        }

        // Be respectful to the server
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Combine existing and new letters
    const allLetters = [...existingData.letters, ...newLetters];

    // Sort by year ascending
    allLetters.sort((a, b) => a.year - b.year);

    // Save to JSON file
    const outputPath = path.join(__dirname, '..', 'data', 'letters.json');
    fs.writeFileSync(outputPath, JSON.stringify({ letters: allLetters }, null, 2));

    console.log(`\n✅ Successfully processed ${newLetters.length} new letters`);
    console.log(`📁 Saved to: ${outputPath}`);
    console.log(`📊 Total letters: ${allLetters.length}`);

    const finalYears = allLetters.map(l => l.year).sort((a, b) => a - b);
    console.log(`📅 Year range: ${finalYears[0]} - ${finalYears[finalYears.length - 1]}`);

    // Show missing years
    const allPossibleYears = [];
    for (let y = 1977; y <= 2025; y++) allPossibleYears.push(y);
    const missingYears = allPossibleYears.filter(y => !finalYears.includes(y));
    if (missingYears.length > 0) {
        console.log(`\n⚠️  Missing years: ${missingYears.join(', ')}`);
    }
}

// Run the script
fetchPDFLetters().catch(console.error);
