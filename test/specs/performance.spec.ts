import StockPage from "../pageobjects/stock.page.ts";
import LoginPage from '../pageobjects/login.page.ts'


describe('Performance', () => {
    const userEmail = process.env.TEST_USER
    const userPassword = process.env.PASSWORD

    before(async () => {
        //Login
        await StockPage.open(process.env.BASE_URL)
        await LoginPage.login(userEmail, userPassword);
    })

    it('Get document load time and all console loge message [TC-1]', async () => {
        let errorsArray = []
        let requestDocumentMetrics = {
            requestID: '',
            requestURL: '',
            loadingStart: 0,
            receiveHeadersEnd: 0,
            documentLoadTime: 0,
        }
        let performanceMetrics = {
            data: '',
            URL: '',
            NetworkTimeTypeDocument: 0,
            DOMContentLoadedTime: 0,
            LoadTime: 0,
            NotificationLogs: errorsArray,
        }


        //Enable Network log
        await browser.cdp('Network', 'enable');
        //Added Network.responseReceived listener
        await browser.on('Network.responseReceived', (params) => {
            if (params.type == 'Document') {
                requestDocumentMetrics.requestURL = params.response.url;
                requestDocumentMetrics.requestID = params.requestId;
                requestDocumentMetrics.loadingStart = params.response.timing.requestTime;
                requestDocumentMetrics.receiveHeadersEnd = params.response.timing.receiveHeadersEnd;
                console.log(`TIMINGS: ${params.response.timing.receiveHeadersEnd}`);
            }
        });
        //Added request loading finished listener
        await browser.on('Network.loadingFinished', (params) => {
            if (requestDocumentMetrics.requestID == params.requestId) {
                performanceMetrics.NetworkTimeTypeDocument = requestDocumentMetrics.documentLoadTime = Math.round((params.timestamp - requestDocumentMetrics.loadingStart) * 1000)
                console.log(performanceMetrics.NetworkTimeTypeDocument)
            }
        });

        //Get browser console logs
        await browser.cdp('Log', 'enable');
        // Listen for Log.entryAdded event and add to array
        await browser.on('Log.entryAdded', (params) => {
            console.log(`Console message:============================== ${params.entry.text}`);
            errorsArray.push(params.entry)
        });


        await browser.url('https://perfectum.ua/ua/documentation');
        // await browser.url('https://itc.ua/ua/');

        await browser.pause(1000)
        await console.log('ERORRS=============================:', errorsArray)
        await console.log('PERFORMANCE=============================:', performanceMetrics)

    });

    it.only('should measure page load time using performance.timing', async () => {
        // let urlList = ['https://perfectum.ua/ua/documentation', 'https://example.com/', 'https://itc.ua/ua/']
        let urlList = ['/tasks', '/leads', '/tasks', '/leads', '/spreadsheet_online', '/tasks', '/leads', '/tasks', '/leads', '/spreadsheet_online']
        let perfArray = []

        //Enable Chrome Driver Protocol
        await browser.cdp('Network', 'enable');
        await browser.cdp('Performance', 'enable');
        await browser.cdp('Page', 'enable');
        await browser.cdp('Runtime', 'enable');

        //enable event listener
        browser.on('Performance.metrics', (params) => {
            console.log(`METRICS: ${params}`);
        });


        async function measurePageLoadTime(url) {
            //Get performance page
            let metrics = await browser.cdp('Performance', 'getMetrics');
            console.log(metrics)
            // Find the DOMContentLoaded metric
            const domContentLoadedMetric = metrics.metrics.find(metric => metric.name === 'DomContentLoaded');
            const navigationStart = metrics.metrics.find(metric => metric.name === 'NavigationStart');
            const threadTime = metrics.metrics.find(metric => metric.name === 'ThreadTime');
            // Extract the DOMContentLoaded time
            const domContentLoadedTime = Math.round((domContentLoadedMetric.value - navigationStart.value) * 1000 + threadTime.value); // Convert to milliseconds
            console.log(`DOMContentLoadedTime: ${domContentLoadedTime}`);

            return domContentLoadedTime;
        }


        for (const url of urlList) {
            let errorsArray = []
            let requestDocumentMetrics = {
                requestID: '',
                requestURL: '',
                loadingStart: 0,
                receiveHeadersEnd: 0,
                documentLoadTime: 0,
            }
            let performanceMetrics = {
                data: '',
                URL: '',
                NetworkTimeTypeDocument: 0,
                DOMContentLoadedTime: 0,
                LoadTime: 0,
                NotificationLogs: [],
            }

            await browser.url(process.env.BASE_URL + url);

            //Added Network.responseReceived listener
            await browser.on('Network.responseReceived', (params) => {
                if (params.type == 'Document') {
                    requestDocumentMetrics.requestURL = params.response.url;
                    requestDocumentMetrics.requestID = params.requestId;
                    requestDocumentMetrics.loadingStart = params.response.timing.requestTime;
                    requestDocumentMetrics.receiveHeadersEnd = params.response.timing.receiveHeadersEnd;
                    console.log(`DocumentTime: ${params.response.timing.receiveHeadersEnd}`);
                }
            });
            //Added request loading finished listener
            await browser.on('Network.loadingFinished', (params) => {
                if (requestDocumentMetrics.requestID == params.requestId) {
                    requestDocumentMetrics.documentLoadTime = requestDocumentMetrics.documentLoadTime = Math.round((params.timestamp - requestDocumentMetrics.loadingStart) * 1000)
                    console.log(`DocumentLoadTime: ${requestDocumentMetrics.documentLoadTime}`);
                }
            });

            //Get browser console logs
            await browser.cdp('Log', 'enable');
            // Listen for Log.entryAdded event and add to array
            await browser.on('Log.entryAdded', (params) => {
                console.log(`Console message: ${params.entry.text}`);
                errorsArray.push(params.entry)
            });

            //wait page loaded
            await browser.waitUntil(async () => {
                const readyState = await browser.execute(() => document.readyState);
                return readyState === 'complete';
            }, {timeout: 30000, timeoutMsg: 'Page don\'t load'});

            performanceMetrics.URL = url;
            performanceMetrics.NotificationLogs = errorsArray;
            performanceMetrics.NetworkTimeTypeDocument = requestDocumentMetrics.documentLoadTime
            performanceMetrics.DOMContentLoadedTime = await measurePageLoadTime(url);
            await perfArray.push(performanceMetrics);
        }


        //Maybe need disable cache for for more consistent results?
        console.log(perfArray)

    });

    afterEach('Refresh page', async () => {
        await browser.deleteAllCookies();
        // await browser.refresh();
    });
})
