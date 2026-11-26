import { Page, Locator } from '@playwright/test'

export class AddRecordPagePOM {
    //Fields for locators and page - init them in constructor
    page: Page;
    heading: Locator;

    constructor(page: Page){ //Runs when an object is created from this class (using new())
        this.page = page;
        //Set locator fields
        this.heading = page.locator('h1')
    }

    //Service methods - Provide methods for the test that use the locators
    //POM principles say "do not assert in the POM", so I just return a (promise of a) value
    async getHeading(): Promise<string>{
        return await this.heading.innerText();
    }

}