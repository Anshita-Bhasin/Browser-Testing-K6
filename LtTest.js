import { chromium } from 'k6/experimental/browser';
import { expect } from 'https://jslib.k6.io/k6chaijs/4.3.4.3/index.js';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";


export default async function () {
    const capabilities = {
        "browserName": "Chrome",
        "browserVersion": "latest",
        "LT:Options": {
            "platform": "MacOS Ventura",
            "build": "K6 Build",
            "name": "K6 Test",
            "user": 'anshita.bhasin',
            "accessKey": 'Ky8ACLBDr0M5JNKKWEPvWO6hmtGNL7OFcTHa4tWMA3gugWwO4s',
            "network": true,
            "video": true,
            "console": true,
            'tunnel': false,
        },
    };



    const wsURL = `wss://cdp.lambdatest.com/puppeteer?capabilities=${encodeURIComponent(JSON.stringify(capabilities))}`
    const browser = chromium.connect(wsURL);

    const page = browser.newPage();


    try {
        await page.goto("https://duckduckgo.com");
        await page.screenshot({ path: 'screenshots/k6Screenshot.png' });

        let element = await page.$("[name=\"q\"]");
        await element.click();
        await element.type("Playwright");
        await element.press("Enter");
        let title = await page.title();

        try {
            expect(title).to.equal("Playwright at DuckDuckGo");
            await page.evaluate(_ => { }, `lambdatest_action: ${JSON.stringify(
                { action: "setTestStatus", arguments: { status: "passed", remark: "Assertions passed" }, })}`);
        } catch (e) {
            await page.evaluate(_ => { }, `lambdatest_action: ${JSON.stringify(
                { action: "setTestStatus", arguments: { status: "failed", remark: e.stack } })}`);
            console.log("Error:: ", e.stack);
        }
    } finally {
        page.close();
        browser.close();
    }
}



export function handleSummary(data) {
    const customTitle = 'LT Sample Test';
    const reportTitle = `${customTitle} - ${new Date().toLocaleDateString()}`;

    return {
        'LTSummaryReport.html': htmlReport(data, { title: reportTitle }),
    };
}
