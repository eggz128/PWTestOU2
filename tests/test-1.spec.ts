//File created using "Record New" in Testing(side bar)>Playwright>Record new
import { test, expect } from '@playwright/test';

test('Login test', async ({ page }) => { //Typical tests follow the pattern Arrange->Act->Assert
  /*
  * Arrange
  */
  //Get the Application Under Test (AUT) in to a state ready to check "the thing being tested". i.e. get to the login page
  await page.goto('/webdriver2/'); //baseurl in config file is set
  await page.getByRole('link', { name: 'Login To Restricted Area' }).click();
  
  /*
  * Act
  */
  //Do "the thing" i.e. login
  //Scoping
  const usernameRow = page.getByRole('row', { name: 'User Name?' });
  await usernameRow.locator('#username').click();
  //await page.locator('#username').nth(0).fill('edgewords');
  await page.locator('#username').filter({visible: true}).filter({}).fill('edgewords');
  await page.locator('#password').click();
  await page.locator('#password').fill('edgewords123');
  await page.getByRole('link', { name: 'Submit' }).click();
  
  /*
  * Assert
  */
  //Assert(expect) to check "the thing" done had the desired outcome i.e. here, are we logged in? Yes if on "add a record page"
  await expect(page.locator('h1')).toContainText('Add A Record To the Database');
});