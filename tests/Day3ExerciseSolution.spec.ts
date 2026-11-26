import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  test.slow(); //Test takes longer than 30s to run, so triple the timeout
  await page.goto('https://www.edgewordstraining.co.uk/demo-site/');
  await page.locator('#menu-item-46').getByRole('link', { name: 'My account' }).click();
  await page.getByRole('textbox', { name: 'Username or email address' }).click();
  await page.getByRole('textbox', { name: 'Username or email address' }).fill('exampleuser@example.com');
  await page.locator('#password').click();
  await page.locator('#password').fill('examplepassword!!');
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.locator('#menu-item-43').getByRole('link', { name: 'Shop' }).click();
  await page.locator('#woocommerce-product-search-field-0').click();
  await page.locator('#woocommerce-product-search-field-0').fill('cap');
  await page.locator('#woocommerce-product-search-field-0').press('Enter');
  await page.getByRole('button', { name: 'Add to cart', exact: true }).click();
  await page.locator('#content').getByRole('link', { name: 'View cart ' }).click();
  await page.getByRole('link', { name: 'Proceed to checkout ' }).click();
  await page.getByRole('button', { name: 'Place order' }).click();
  
  //Capture order number
  let orderNumber = await page.locator('.order > strong').innerText();
  //orderNumber = orderNumber + 1; //Break the test to check it does fail
  console.log("The captured order number is " + orderNumber); //Log to the report. Appears in std out at bottom.

  await page.locator('#menu-item-46').getByRole('link', { name: 'My account' }).click();
  await page.getByRole('link', { name: ' Orders' }).click();

  await page.screenshot({path: './manualscreenshots/orderspage.png', fullPage: true});
  await expect(page.locator('table.woocommerce-orders-table > tbody > tr:nth-child(1)')).toContainText(orderNumber);

  //ToDo: Add logout steps

});