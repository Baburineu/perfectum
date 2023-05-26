/**
 * main page object containing all methods, selectors and functionality
 * that is shared across all page objects
 */
import {generateBrowserRunnerTestFiles} from "@wdio/cli/build/utils";

export default class Page {
    private get logOutButton() {
        return $(`.topnav__exit`);
    }

    private popupNotification(massage) {
        return $(`//div[@class="noty_body" and contains(text(),'${massage}')]`);
    }


    /**
     * Opens a sub page of the page
     * @param path path of the sub page (e.g. /path/to/page.html)
     */
    public open(path: string) {
        return browser.url(`${path}`)
    }

    public async openAndVerifyURL(path?: string) {
        const url = `${process.env.BASE_URL}${path || ''}`;
        await this.open(url);
        const currentUrl = await browser.getUrl();
        await expect(currentUrl).toEqual(url);
    }

    public async verifyURL(path?: string) {
        const expectedURL = `${process.env.BASE_URL}${path || ''}`;
        try {
            await browser.waitUntil(async () => {
                const currentURL = await browser.getUrl();
                return currentURL === expectedURL;
            }, {
                timeout: 20000,
                timeoutMsg: `Page don't load. URL: ${expectedURL}`
            });
            const currentURL = await browser.getUrl();
            return expect(currentURL).toEqual(expectedURL);
        } catch (error) {
            const currentURL = await browser.getUrl();
            console.error('Wrong URL:', error);
            return expect(currentURL).toEqual(expectedURL);
        }
    }

    public async logOut() {
        await this.logOutButton.click()
    }

    public async verifyNotification(message) {
         this.popupNotification(message).waitForDisplayed({timeout: 20000})
         expect( this.popupNotification(message)).toBeDisplayed()
         expect( this.popupNotification(message)).toHaveText(message)
         this.popupNotification(message).click()
        if (await browser.isAlertOpen()) {
            await browser.acceptAlert();
        }
    }
}
