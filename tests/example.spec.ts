import { expect } from '@playwright/test'; //Get test() and expect() methods from PW to use here
import { test } from './globalbeforeafter'


//the test() method takes 2 args 'Test name', test code to run in function(){}
// PW Actions should generally be "await"ed. Await can only be used in "async" functions 
test('has title', async ({ page }) => { //Ask PW Test for the "page" fixture to use in this test
  await page.goto('https://playwright.dev/'); //"Await" the outcome of navigating to playwright.dev before continuing execution

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async function ({ page }) { //"Full function syntax". Arrow functions are fine and shorter to write. 
  await page.goto('https://playwright.dev/');
  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});

test('First Test', async ({ page }) => {
  await page.goto('http://www.edgewordstraining.co.uk/webdriver2/');

  //Most test automation tools follow the pattern:
  // tool ---> find something ---> do something with found object:
  await page.getByRole('link', { name: 'Login To Restricted Area' }).click();
  await page.getByText('Login To Restricted Area').click();
  //WebDriverJS equivalent:
  // await driver.findElement(By.linkText('Login To Restricted Area')).click();
  //Cypress equivalent:
  // cy.contains('Login To Restricted Area').click();

  //OLD Playwright style code doesn't follow the pattern. Still works, but highly DISCOURAGED
  // await page.click('a:has-text("Login To Restricted Area")'); //PW action with locator called directly on page. Avoid.
  //(Old)Code and/or tutorials online may have code like this. AI tools often generates code like this because of old training data.

  await page.getByRole('row', { name: 'User Name?' }).locator('#username').click();
  await page.getByRole('row', { name: 'User Name?' }).locator('#username').fill('edgewords');
  await page.locator('#password').click();
  await page.locator('#password').fill('edgewords123');
  await page.getByRole('link', { name: 'Submit' }).click();
})

//WARNING: It is easy to break a test file by recording (at cursor) code in to an invalid place in a test file
// e.g. like here, outside of a test function body.
//await page.getByRole('link', { name: 'Submit' }).click(); //Uncomment and save (ctrl+s) to break test file

//Tests in broken test files can't be discovered or run.

