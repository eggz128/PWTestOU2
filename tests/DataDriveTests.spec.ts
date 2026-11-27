import { expect } from '@playwright/test';
import { test } from './my-test';
import { HomePagePOM } from './POMs/HomePagePOM';
import { LoginPagePOM } from './POMs/LoginPagePOM';
import { AddRecordPagePOM } from './POMs/AddRecordPagePOM';
import credentials from './Data/logins.json'


for (const user of credentials) {
    test(`Data drive test with ${user.username}`, async ({ page }) => {
        await page.goto('https://www.edgewordstraining.co.uk/webdriver2/');
        const homePage = new HomePagePOM(page); //Init object from POM class
        await homePage.goToLoginPage(); //Use service method(s) provided by the POM
        const loginPage = new LoginPagePOM(page);
        await loginPage.doLogin(user.username, user.password);
        //Should now be on Add record page (logged in)
        const addRecordPage = new AddRecordPagePOM(page);
        await expect(addRecordPage.heading).toHaveText('Add A Record To the Database'); //Web-first assertion using public locator
    });
}


test(`Environment Variable use`, async ({ page }) => {
    await page.goto('https://www.edgewordstraining.co.uk/webdriver2/');
    const homePage = new HomePagePOM(page); //Init object from POM class
    await homePage.goToLoginPage(); //Use service method(s) provided by the POM
    const loginPage = new LoginPagePOM(page);
    await loginPage.doLogin(process.env.PWUSERNAME ?? "", process.env.PWPASSWORD ?? "");
    //Should now be on Add record page (logged in)
    const addRecordPage = new AddRecordPagePOM(page);
    await expect(addRecordPage.heading).toHaveText('Add A Record To the Database'); //Web-first assertion using public locator
});

test(`Paramiterised project`, async ({ page, person }) => {
    await page.goto('https://www.edgewordstraining.co.uk/webdriver2/');
    const homePage = new HomePagePOM(page); //Init object from POM class
    await homePage.goToLoginPage(); //Use service method(s) provided by the POM
    const loginPage = new LoginPagePOM(page);
    await loginPage.doLogin(person, "edgewords123");
    //Should now be on Add record page (logged in)
    const addRecordPage = new AddRecordPagePOM(page);
    await expect(addRecordPage.heading).toHaveText('Add A Record To the Database'); //Web-first assertion using public locator
});
