import { test, expect } from '@playwright/test';
import { HomePagePOM } from './POMs/HomePagePOM';
import { LoginPagePOM } from './POMs/LoginPagePOM';
import { AddRecordPagePOM } from './POMs/AddRecordPagePOM';

test('test', async ({ page }) => { //"Traditional" test
  await page.goto('https://www.edgewordstraining.co.uk/webdriver2/');
  await page.getByRole('link', { name: 'Login To Restricted Area' }).click();
  await page.getByRole('row', { name: 'User Name?' }).locator('#username').click();
  await page.getByRole('row', { name: 'User Name?' }).locator('#username').fill('edgewords');
  await page.locator('#password').click();
  await page.locator('#password').fill('edgewords123');
  await page.getByRole('link', { name: 'Submit' }).click();
  await expect(page.locator('h1')).toContainText('Add A Record To the Database');
});

test('POM Login test', async ({ page }) => {
  await page.goto('https://www.edgewordstraining.co.uk/webdriver2/');
  const homePage = new HomePagePOM(page); //Init object from POM class
  await homePage.goToLoginPage(); //Use service method(s) provided by the POM
  const loginPage = new LoginPagePOM(page);
  // await loginPage.setUsername('edgewords');
  // await loginPage.setPassword('edgewords123');
  // await loginPage.submitForm();
  await loginPage.doLogin('edgewords', 'edgewords123');
  //await loginPage.usernameTextBox.locator("xpath=./../../../div").click(); //Public locators can be misued as an 'escape hatch' back to the html of the page

  //Should now be on Add record page (logged in)
  const addRecordPage = new AddRecordPagePOM(page);
  
  //await expect(addRecordPage.heading).toHaveText('Add A Record To the Database');
  //expect(await addRecordPage.getHeading()).toBe('Add A Record To the Database');
  await expect.poll(async ()=>{
    return await addRecordPage.getHeading();
  }).toBe('Add A Record To the Database')
});

test('OR Test', async ({ page }) => {
  await page.goto('https://www.edgewordstraining.co.uk/webdriver2/');
  const homePage = new HomePagePOM(page); //Init object repository
  await homePage.loginLink.click();
  const loginPage = new LoginPagePOM(page);
  //These locators have been made private - comment out to allow code compilation
  // await loginPage.usernameTextBox.fill('edgewords');
  // await loginPage.passwordTextBox.fill('edgewords123');
  await loginPage.submitButton.click();
})