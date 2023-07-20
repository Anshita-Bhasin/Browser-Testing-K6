    import { chromium } from 'k6/experimental/browser';
    import { check } from 'k6';
    import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/2.4.0/dist/bundle.js";
   
   
    export let options = {
        vus: 5,
        iterations: 10

    }

    export default async function () {
        //const browser = chromium.launch({ headless: false });

        const browser = chromium.launch({ args: ['no-sandbox'], headless: true, timeout: '60s' });
        const context = browser.newContext();
        const page = context.newPage();

        await page.goto('https://ecommerce-playground.lambdatest.io/index.php?route=account/login');
         page.screenshot({ path: 'screenshots/browserTestScreenshot.png' });

        page.locator('#input-email').type('lambdatest.Cypress@disposable.com');
        page.locator('#input-password').type('Cypress123!!');
        const submitButton = page.locator('input[value="Login"]');
        await Promise.all([page.waitForNavigation(), submitButton.click()]);

        check(page, {
            'Verify user is logged In': () =>
                page.locator('.breadcrumb-item.active').textContent() == 'Account',
        });
        check(page, {
            'Verify the text': () =>
                page.locator('.breadcrumb-item.active').textContent() == 'Test',
        });


         page.close()
         browser.close();
    }

    export function handleSummary(data) {
        return {
            '1Report.html': htmlReport(data, { debug: true })
        };

    }
