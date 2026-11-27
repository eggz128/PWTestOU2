import { test, expect } from '@playwright/test';

test('Exercise 1', {lock: 'cap'}, async ({ page }) => {
  await page.goto('https://www.edgewordstraining.co.uk/demo-site/');
  await page.locator('#menu-item-46').getByRole('link', { name: 'My account' }).click();

  //Dont need to await locator definition - no search in the web app is performed at this time
  //Can store and reuse locator definition
  const username = page.getByRole('textbox', { name: 'Username or email address' }).describe('Username text box'); //Give a "friendly name" for the locator in the HTML report
  await username.click(); //Do need to await action that acts on the locator. This is when the element search (followed by action) takes place.
  await username.fill('exampleuser@example.com');
  await page.locator('#password').click();
  await page.locator('#password').fill('examplepassword!!');
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.locator('#menu-item-43').getByRole('link', { name: 'Shop' }).click();
  await page.getByRole('button', { name: 'Add to cart: “Cap”' }).click();

  await page.getByRole('link', { name: 'View cart ', description: 'View cart' }).click(); //Click View cart button, not nav cart link to work around sync problem
  //await page.locator('#menu-item-44').getByRole('link', { name: 'Cart' }).click(); //If instead you click the nav cart link, this may run too fast and happen before the cap is fully added to the cart
  
  await page.getByRole('button', { name: 'Remove Cap from cart' }).click();
  await page.getByRole('link', { name: 'Return to shop' }).click();
  await page.locator('#menu-item-46').getByRole('link', { name: 'My account' }).click();
  await page.getByRole('link', { name: ' Log out' }).click();
});

test('Aria role', {tag: ['@Smoke', '@Regression']}, async ({ page }) => {
  await page.goto('https://www.edgewordstraining.co.uk/demo-site');
  //await page.getByRole('button', { name: ' Dismiss' }).click(); // is a custom unicode font character for x(close)
  //await page.getByRole('button', { name: 'Dismiss' }).click(); //Name does sub string match, so can drop the unicode character
  //await page.getByRole('button', { name: 'DISMISS', exact: true }).click(); //Exact= Now case sensitive. Will fail when test runs out of time
  //await page.getByRole('button', { name: 'Dismiss', exact: true }).click(); //and also doesnt do substring match
  // await page.getByRole('button', { name: /.*MISS/i }).click(); //RegEx match - any text + MISS + case insensitive flag
  //await page.locator('css=.woocommerce-store-notice__dismiss-link').click(); //"css=" and "xpath=" labels are optional
  await page.locator('xpath=//*[@class="woocommerce-store-notice__dismiss-link"]').click();
})

test('within @Smoke', async ({ page }) => {
  await page.goto('https://www.edgewordstraining.co.uk/demo-site/product/cap/');
  const mainProductSection = page.locator('.summary.entry-summary');
  const addToCartButton = page.getByRole('button'); //Matches multiple on page buttons

  //await addToCartButton.click(); //Strict mode violation. Matches 8 elements.
  await mainProductSection.getByRole('button').click(); //Chaining - go to main, then inside that go to button
  await addToCartButton.within(mainProductSection).click(); //Within - get button inside of main
});

test('within column of table', async ({ page }) => {
  await page.goto('https://www.edgewordstraining.co.uk/webdriver2/docs/basicHtml.html');
  const table = page.locator('#htmlTable');
  const secondColumn = page.getByRole('cell').nth(1) //Not second cells on page, but instead..
    .within(table.getByRole('row')); //2nd cells within the table rows
  await secondColumn.nth(0).click(); //2nd column 1st row cell
  await secondColumn.nth(1).click(); //2nd column 2nd row cell
});

test('all products', async ({ page }) => {
  await page.goto('https://www.edgewordstraining.co.uk/demo-site/');
  const newProducts = page.getByLabel('Recent Products');
  const targetProducts = newProducts.locator('h2:not(.section-title)');
  for (const prod of await targetProducts.all()) { //gathers a collection of all() matching elements
    console.log(await prod.textContent()); //then loops over each individual matches logging the text
  }; //No need to await console, but you do need to await the locator.textContent() . Or you will only get the "promise" of the text, not the actual text.
});

test('Locator Handler', async ({ page }) => { //How to handle unpredicatable modal "pop ups"
  // Setup the handler.
  const cookieConsent = page.getByRole('heading', { name: 'Hej! You are in control of your cookies.' });
  await page.addLocatorHandler(
    cookieConsent, //Locator to watch out for
    async () => { //If spotted, what to do
      //console.log("Spotted cookie consent")
      await page.getByRole('button', { name: 'Accept' }).click();
    }
    , //Optional arguments - can be omitted
    {
      times: 10, //How many times the locator may appear before the handler should stop handling the locator
      //By default Playwright will wait for the locator to no longer be visible before continuing with the test.
      noWaitAfter: false //this can be overridden however
    }
  );

  // Now write the test as usual. If during "actionability checks" the cookie prompt is spotted, it will be handled.
  await page.goto('https://www.ikea.com/');
  await page.getByRole('link', { name: "Fill your home with festive cheer" }).click();
  await expect(page.getByText('Bring the cheer')).toBeVisible();

  //If you're confident the locator will no longer be found you can de-register the handler
  //await page.removeLocatorHandler(cookieConsent);
  //If the cookie consent form appears from here on it may cause issues with the test...
  
  //IF the cookie consent form hasn't been handled yet wait
  await page.waitForTimeout(3000); //Big dumb wait before finishing the test
  //Have an action so the actionability checks include the custom locator handler
  await page.locator('div.picker-container.svelte-sx0c1s div > a > span:nth-child(1)').hover(); //Need an actionability check here to trigger the locator if the cookie consent form appears on page 2 (i.e. didn't already get handled on page 1)
});

