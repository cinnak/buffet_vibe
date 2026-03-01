const axios = require('axios');

async function checkPDFs() {
    for (let y = 1997; y <= 2025; y++) {
        try {
            await axios.head(`https://www.berkshirehathaway.com/letters/${y}ltr.pdf`, { timeout: 5000 });
            console.log(`${y}ltr.pdf: EXISTS`);
        } catch {
            console.log(`${y}ltr.pdf: NOT FOUND`);
        }
    }
}

checkPDFs();
