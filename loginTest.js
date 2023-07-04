import { chromium } from 'k6/experimental/browser';
import { check } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/2.4.0/dist/bundle.js";

export let options = {
    vus: 3,
    iterations: 4
}
   

export default async function () {
    const capabilities = [
        {
            "browserName": "Chrome",
            "browserVersion": "latest",
            "LT:Options": {
                "platform": "Windows 11",
                "build": "K6 Build",
                "name": "K6 Test",
              "user":`${__ENV.LT_USERNAME}`,
"accessKey"`${__ENV.LT_ACCESS_KEY}`,
                "network": true,
                "video": true,
                "console": true,
                "tunnel": false
            }
        },
        {
            "browserName": "Chrome",
            "browserVersion": "latest",
            "LT:Options": {
                "platform": "MacOS Ventura",
                "build": "K6 Build",
                "name": "K6 Test",
               "user":`${__ENV.LT_USERNAME}`,
"accessKey"`${__ENV.LT_ACCESS_KEY}`,
                "network": true,
                "video": true,
                "console": true,
                "tunnel": false
            }
        }
    ];

    capabilities.forEach(async (value) => {
        console.log(' URL formed is ' + JSON.stringify(value))
        const wsURL = `wss://cdp.lambdatest.com/puppeteer?capabilities=${encodeURIComponent(JSON.stringify(value))}`
        const browser = chromium.connect(wsURL);
        const context = browser.newContext();
        const page = context.newPage();

        await page.goto('https://ecommerce-playground.lambdatest.io/index.php?route=account/login');
        await page.screenshot({ path: 'screenshots/browserTestScreenshot.png' });

        page.locator('#input-email').type('lambdatest.Cypress@disposable.com');
        page.locator('#input-password').type('Cypress123!!');
        const submitButton = page.locator('input[value="Login"]');
        await Promise.all([page.waitForNavigation(), submitButton.click()]);

        check(page, {
            'Verify user is logged In': () =>
                page.locator('.breadcrumb-item.active').textContent() == 'Account'
        });

        check(page, {
            'Verify the text': () =>
                page.locator('.breadcrumb-item.active').textContent() == 'Test'
        });

        await page.close();
        await browser.close();
    });
}

export function handleSummary(data) {
    return {
        'TestReport.html': htmlReport(data, { debug: true })
    };
}
