import puppeteer from 'puppeteer';


describe('Login page', () => {
    const userEmail = process.env.TEST_USER
    const userPassword = process.env.PASSWORD

    it('Puppeteer', async () => {
        const browser = await puppeteer.launch({headless: true});
        const page = await browser.newPage()
        await page.setViewport({width: 1600, height: 1024});
        await page.setDefaultNavigationTimeout(0)
        await page.setDefaultTimeout(0)
        await page.goto('https://itc.ua');
        await page.goto('https://perfectum.ua');
        await page.goto('https://perfectum.ua/ua/documentation/version-selection/box-crm');

        //Get a console message
        page.on('console', (message) => {
            if (message.type() === 'log') {
                console.log(`Console log: ${message.text()}`);
            } else if (message.type() === 'error') {
                console.error(`Console error: ${message.text()}`);
            } else if (message.type() === 'warning') {
                console.warn(`Console warning: ${message.text()}`);
            } else {
                console.log(`Console message of type '${message.type()}': ${message.text()}`);
            }
        });


        // Enable required CDP domains
        // const client = await page.target().createCDPSession();
        // await client.send('Performance.enable');
        //
        // // Navigate to the web page
        // await page.goto('https://example.com');
        // // Get the metrics array
        // const { metrics } = await client.send('Performance.getMetrics');
        //
        // // Find the loadEventEnd metric
        // const loadEventEndMetric = metrics.find(metric => metric.name === 'loadEventEnd');
        // const loadEventStarMetric = metrics.find(metric => metric.name === 'loadEventStart');
        //
        // // Extract the total load time
        // const totalLoadTime = loadEventEndMetric.value - loadEventStarMetric.value;
        //
        // console.log(`Total load time: ${totalLoadTime} ms`);



        //Get duration = loadEventEnd = load (ms)
        //domContentLoadedEventEnd(ms)
        //domComplete
        let navigationTiming = await page.evaluate(() => JSON.stringify(window.performance.getEntriesByType('navigation')))
        console.log('TIMING:', navigationTiming);

        //Get first-paint and first-contentful-paint
        let paint = await page.evaluate(() => JSON.stringify(window.performance.getEntriesByType('paint')))

        let performance = await page.evaluate(() => JSON.stringify(window.performance))
        console.log('TIMING:', performance);

        let metrics = await page.metrics()
        console.log('METRICS:', metrics);

        await browser.close();
    })
})