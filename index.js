require('dotenv').config()

const puppeteer = require('puppeteer');

const visa = require('./visa')
const legalization = require('./legalization')

const main = async () => {
    console.log("STARTED")
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    await legalization(browser);
    await visa(browser);
    setTimeout(async () => {
      process.exit()
    }, 2*60*60*1000)
};

main()


