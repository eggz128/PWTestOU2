import { Page, Locator } from '@playwright/test'

export class LoginPagePOM {
    //Fields for locators and page - init them in constructor
    page: Page;
    private usernameTextBox: Locator; //Locators can be made private to improve encapsulation (an OO design principle)
    #passwordTextBox: Locator; //private is a TS compile time check the field isn't publically available, #name is a JS engine feature.
    readonly submitButton: Locator; //readonly means once locator is set in constructor, it can't be changed anywhere else. i.e. it's a const

    constructor(page: Page){ //Runs when an object is created from this class (using new())
        this.page = page;
        //Set locator fields
        this.usernameTextBox = this.page.getByRole('row', { name: 'User Name?' }).locator('#username');
        this.#passwordTextBox = this.page.locator('#password');
        this.submitButton = this.page.getByRole('link', { name: 'Submit' });
    }

    //Service methods - Provide methods for the test that use the locators
    async setUsername(username: string){ //Don't store test data in the POM. Instead methods should be passed data from the test.
        //await this.usernameTextBox.fill(username);
        //If how the text entry works needs to change it can be changed here once. Any tests using this method get the change.
        await this.usernameTextBox.clear();
        await this.usernameTextBox.pressSequentially(username, {delay: 200})
    }

    async setPassword(password: string){
        await this.#passwordTextBox.fill(password);
    }

    async submitForm(){
        await this.submitButton.click();
        //this.submitButton = this.page.locator('attempt to redefine locator'); //Wont compile because submitButton is readonly
    }

    //Higher level service method
    async doLogin(username: string, password: string){
        await this.setUsername(username);
        await this.setPassword(password);
        await this.submitForm();
    }

    //ToDo: ? doLoginExpectToSucceed() / doLoginExpectToFail() ?
    // Different possible outcomes expected so create different methods
    // For use with Positive vs Negative tests - can make each test easier to read and understand at a glance
    // i.e. resolves questions about "is this passed data valid and expected to work?"

}