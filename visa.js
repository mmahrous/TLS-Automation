
const email = process.env.VISA_EMAIL;
const password = process.env.VISA_PASSWORD;
const axios = require('axios');
const time_found = require('./time_found.json')
const no_time = require('./no_time.json')
const visa  = async (browser) => {
    const page = await browser.newPage();
    await page.goto('https://de.tlscontact.com/eg/cai/login.php', {waitUntil: 'networkidle0'});

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
    console.log("Visa logged in");
    setInterval(async () => {
        await page.reload()
        console.log("Check for visa appointment")
        try {
            // Will throw err if element is not present and visible.
            const elements = await page.$x('//*[@id="timeTable"]/div/div/a')
            const appointments = await Promise.all(elements.map(elm => elm.evaluate(el => {
                if (el.getAttribute('href')) {
                    return `${/(2021-[0-9][0-9]-[0-9][0-9])/.exec(el.getAttribute('onclick'))[0]} => ${el.textContent}`
                } else return null
            }, elm)))
            if (appointments.filter(appt => appt).length) {
                console.log("❤️  Visa Appointment");
                appointments.filter(appt => appt).map(apt => console.log(apt))
                time_found.title = "Visa Appoinment Available"
                time_found.potentialAction[0].targets[0].uri = "https://de.tlscontact.com/eg/cai/login.php"
                time_found.sections = appointments.filter(appt => appt).map(apt => ({
                    "title": apt
                }))
                await axios.post(process.env.WEBHOOK, time_found);
            } else {
                no_time.title = "Visa Appoinment"
                console.log("😖 Visa nothing available yet 😢")
                await axios.post(process.env.WEBHOOK, no_time);
            }
          } catch(err) {
            console.log(err);
          }
    }, 15*60*1000)
};

module.exports = visa