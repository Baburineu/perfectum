import Page from './page.ts';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class LoginPage extends Page {
    /**
     * define selectors using getter methods
     */
    public get inputUsername () {
        return $('#emailaddress');
    }

    public get inputPassword () {
        return $('#password');
    }

    public get btnSubmit () {
        return $('button[data-callback="onSubmit"]');
    }

    public get alertTooltip () {
        return $(`.alert-danger`);
    }


    /**
     * a method to encapsule automation code to interact with the page
     * e.g. to login using username and password
     */
    public async login (username: string, password: string) {
        await this.inputUsername.setValue(username);
        await this.inputPassword.setValue(password);
        await this.btnSubmit.click();
    }

    public async verifyTooltipText(expectedMessage: string) {
        await expect(this.alertTooltip).toHaveText(expectedMessage);
        return this;
    }


    /**
     * overwrite specific options to adapt it to page object
     */
    public open () {
        return super.open('/authentication');
    }
}

export default new LoginPage();
