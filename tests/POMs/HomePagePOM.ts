import { Page, Locator } from '@playwright/test'

export class HomePagePOM {
    //Fields for locators and page - init them in constructor
    page: Page;
    loginLink: Locator;

    constructor(page: Page){ //Runs when an object is created from this class (using new())
        this.page = page;
        //Set locator fields
        this.loginLink = this.page.getByRole('link', { name: 'Login To Restricted Area' });
    }

    //Service methods - Provide methods for the test that use the locators
    async goToLoginPage(){ 
        await this.loginLink.click();
    }

}