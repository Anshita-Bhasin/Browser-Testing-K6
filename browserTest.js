import { chromium } from 'k6/experimental/browser';
import { check } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";


export default async function () {
    const browser = chromium.launch({ headless: false });
    const context = browser.newContext();
    const page = context.newPage();

    await page.goto('https://ecommerce-playground.lambdatest.io/index.php?route=account/login');
    page.fill('[id="input-email"]', 'lambdatest.Cypress@disposable.com');
    page.fill('[id="input-password"]', 'Cypress123!!');
    page.locator('input[value="Login"]').click();

    check(page, {
        'Verify user is logged In': () =>
            page.textContent('.list-group-item.active') === 'My Account',
    });
    await page.close()
    await browser.close();
}

export function handleSummary(data) {
    return {
        "browserTestSummaryReport.html": htmlReport(data),
    };
}