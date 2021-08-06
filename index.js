const puppeteer = require('puppeteer');

const visa = require('./visa')
const legalization = require('./legalization')

const main = async () => {
    const browser = await puppeteer.launch({ headless: true });
    await legalization(browser);
    await visa(browser);
    setInterval(async () => {
      await browser.close()
      main()
    }, 8*60*60*1000)
};

main()


