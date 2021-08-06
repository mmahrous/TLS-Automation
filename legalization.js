const puppeteer = require('puppeteer');
const email = process.env.LEG_EMAIL;
const password = process.env.LEG_PASSWORD;

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('https://de-legalization.tlscontact.com/eg/CAI/login.php', {waitUntil: 'networkidle0'});

    await page.waitForSelector('input[name=email]');
    await page.waitForSelector('input[name=pwd]');

    await page.$eval('input[name=email]', (el, email)=> {
        el.value = email
    }, email);
    await page.$eval('input[name=pwd]', (el, password) => {
        el.value = password
    }, password);

    page.click('.submit');
    await page.waitForNavigation({ waitUntil: 'domcontentloaded' })
    setInterval(async () => {
        await page.reload()
        console.log("Check for appointment")
        try {
            // Will throw err if element is not present and visible.
            const elements = await page.$x('//*[@id="timeTable"]/div/div/a')
            const appointments = await Promise.all(elements.map(elm => elm.evaluate(el => {
                if (el.getAttribute('href')) {
                    return `${/(2021-[0-9][0-9]-[0-9][0-9])/.exec(el.getAttribute('onclick'))[0]} => ${el.textContent}`
                } else return null
            }, elm)))
            if (appointments.filter(appt => appt).length) {
                console.log("❤️  Appointment available");
                appointments.filter(appt => appt).map(apt => console.log(apt))
            } else {
                console.log("😖 nothing available yet 😢")
            }
          } catch(err) {
            console.log(err);
          }
    }, 20*1000)
})();