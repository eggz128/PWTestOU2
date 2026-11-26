import { test, expect } from '@playwright/test';
//Thee test hooks apply to all tests in this file
test.beforeAll(async () => {
  console.log("For code that runs once (and once only) when PW Test enters this file")
})

test.beforeEach(async ({ page }) => {
  await page.goto('https://www.google.com');
  console.log("Runs before each and every test starts")
})

test.afterEach(() => {
  console.log("Runs after each and every test finishes (i.e. multiple times)")
})

test.afterAll(() => {
  console.log("Runs once all tests() have completed in this file")
})

test.describe('A test suite', () => {
  //These test hooks apply only to tests in this describe()
  test.beforeAll(async () => {
    console.log("For code that runs once (and once only) when PW Test enters this file")
  })

  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.bing.com');
    console.log("Runs before each and every test starts")
  })

  test.afterEach(() => {
    console.log("Runs after each and every test finishes (i.e. multiple times)")
  })

  test.afterAll(() => {
    console.log("Runs once all tests() have completed in this file")
  })
  test('test', async ({ page }) => {
    test.slow(); //Triple the test timeout (default 30s->1m30s)
    const slowExpect = expect.configure({ timeout: 8000 }); //Create a slower failing version of expect

    await page.goto('https://www.edgewordstraining.co.uk/webdriver2/');
    await page.getByRole('link', { name: 'Access Basic Examples Area' }).click({ position: { x: 10, y: 10 } });
    await page.getByRole('link', { name: 'Forms' }).click();
    //We should be on the forms page
    await expect(page).not.toHaveTitle('FormsXXX', { timeout: 7000 }); //Set a custom timeout for expect - normally 5s by default
    await expect(page).toHaveURL(/.*forms\.html$/);

    await expect.soft(page).toHaveTitle('FormsXXX', { timeout: 7000 });

    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h1')).toHaveText('Forms');
    await expect(page.locator('h1')).toContainText('or');
    await expect.soft(page.locator('h1')).toHaveText(/orX/);
    //Does not exist - so commented out
    // await page.locator('NoSUchElement').click({timeout: 5000});
    // await page.locator('NoSUchElement').dblclick({button: 'right'});
    // await page.locator('NoSUchElement').click({clickCount: 3}) //Triple click
    await page.locator('#menu a').nth(0).focus(); //Give keyboard focus to focusable element
    await page.locator('#menu a').nth(0).blur();
    await page.locator('#textInput').scrollIntoViewIfNeeded();
    await page.locator('#textInput').click();
    await page.locator('#textInput').fill('Hello world');

    await slowExpect.soft(page.locator('#textInput'), { message: '<input> does not have inner text' }).toHaveText('Hello world'); //X - <input> has no text
    await slowExpect(page.locator('#textInput')).toHaveValue('Hello world'); //It has a value

    await page.locator('#textInput').fill('Steve');
    //await page.locator('#textInput').clear(); //Fill already does this
    await page.locator('#textInput').press('Control+a'); //Clear the text box as a "real user" might
    await page.locator('#textInput').press('Backspace');
    await page.locator('#textInput').pressSequentially(' Powell', { delay: 200 }); //Sends real keypress events, but does not auto clear like fill()
    await page.locator('#textArea').click();
    await page.locator('#textArea').fill('Steve\nwas\nhere\n');
    await page.locator('#checkbox').click(); //Toggle checkbox state
    await page.locator('#checkbox').check(); //Force on
    await page.locator('#checkbox').uncheck(); //Force off
    const elemmentLocation = await page.locator('#checkbox').boundingBox(); //Find element location
    await page.locator('#select').selectOption('Selection Two');

    //There should be 3 radio buttons
    await expect(page.locator('[type=radio]')).toHaveCount(3);

    await page.locator('#two').check();
    //await page.locator('#two').uncheck();
    await page.locator('#password').click();
    await page.locator('#password').fill('asdsfasfd');


    await page.getByRole('link', { name: 'Submit' }).click();

    //Aria snapshot check
    //await expect(page.locator('#right-column')).toMatchAriaSnapshot({name: './snapshot.aria.yml'}) //Point to a snapshot file rather than have the source here
    // https://playwright.dev/docs/aria-snapshots#snapshots-as-separate-files

    await expect(page.locator('#right-column')).toMatchAriaSnapshot(`
    - heading "Forms" [level=1]
    - paragraph: This form has an id of theForm.
    - table:
      - rowgroup:
        - row "Type id Value":
          - cell "Type"
          - cell "id"
          - cell "Value"
        - row "Text input textInput Hello World":
          - cell "Text input"
          - cell "textInput"
          - cell "Hello World"
        - row "Text area textArea":
          - cell "Text area"
          - cell "textArea"
          - cell
        - row "Select select Selection One":
          - cell "Select"
          - cell "select"
          - cell "Selection One"
        - row "Checkbox checkbox unchecked":
          - cell "Checkbox"
          - cell "checkbox"
          - cell "unchecked"
        - row "Radio buttons textInput One":
          - cell "Radio buttons"
          - cell "textInput"
          - cell "One"
        - row "Password password":
          - cell "Password"
          - cell "password"
          - cell
        - row "File Input file":
          - cell "File Input"
          - cell "file"
          - cell
    - paragraph:
      - link "Back to form":
        - /url: "#"
    `);


    await expect(page.getByRole('rowgroup')).toContainText('Hello world');
  });


  test.describe('An inner suite', () => {
    test.describe.configure({ timeout: 90_000 })
    test('Image validation', async ({ page, browserName }) => {
      if (browserName === 'webkit') {
        test.slow(); //Triple the test timeout - for webkit only (because of if statement)
      }

      //test.skip(browserName === 'webkit', 'Do not run on webkit');
      //test.fail(); //Rverses noromal pass/fail login. A test that fails, is considered a 'pass'
      //test.abort('Demo stop test');
      await page.goto('https://www.edgewordstraining.co.uk/webdriver2/docs/forms.html');
      await page.locator('DOESNOTEXIST').click();
      //Image based validation
      await page.locator('#textInput').fill('Hello world');

      await expect(page.locator('#textInput')).toHaveScreenshot('textbox.png', { //On first run a "golden sample" is captured and written to disc. Following runs cheack against that sample.
        threshold: 0.9, //Allowable colour variance 0-1
        //maxDiffPixelRatio: 0.4, //Allowable different pixels 0-1
        //maxDiffPixels: 100 //Exact number of pixel allowed to differ
      }) //Will still fail regardless if the image sizes don't match

    })

    test('Drag drop', async ({ page }) => {
      await page.goto('/webdriver2/docs/cssXPath.html');
      //Dragging and dropping one element to another is simple:
      //await page.locator('div#one').dragTo(page.locator('div#two'))

      //Dragging and dropping one element is a little trickier:
      await page.dragAndDrop('#slider a', //Source
        '#slider a', //Target (same)
        {
          targetPosition: { x: 100, y: 0 }, //How far to drag
          force: true, //Dont do actionability checks (don't worry that we are dragging the source "outside" of itself)
          steps: 20
        } //Smooth the movement over 20 steps
      )
    });


  })



  test('Simple file chooser', async ({ page }) => {
    await page.goto('https://www.edgewordstraining.co.uk/webdriver2/docs/forms.html');
    const fileChooserPromise = page.waitForEvent('filechooser'); //Set up event wait - NO AWAIT
    await page.getByRole('button', { name: 'Choose File' }).click(); //Do action that triggers file chooser
    const fileChooser = await fileChooserPromise; //Now wait for the file chooser to appear
    await fileChooser.setFiles('./tests/example.spec.ts');
  });

  test('Drag drop files', async ({ page }) => {
    await page.goto('https://codyhouse.co/ds/components/app/drag-drop-file');
    await page.locator('iframe').contentFrame().locator('label').drop({
      //files: { name: 'note.txt', mimeType: 'text/plain', buffer: Buffer.from('hello') }, //tsconfig.json file added to root to fix VS Code being unable to find Buffer type info
      files: './tests/example.spec.ts' //Can use real file or create a file on the fly with a buffer as above
    });
  });


  test('Capturing Text', async ({ page }) => {

    await page.goto("https://www.edgewordstraining.co.uk/webdriver2/docs/forms.html");
    await page.locator('#textInput').fill("Hello World");

    let textPromise = page.locator('#right-column').textContent();
    console.log("Without 'await'ing textContent() you get a 'promise' of the future text, not the actual text");
    console.log(textPromise);

    let rightColText = await page.locator('#right-column').textContent(); //Includes whitespace in HTML file

    console.log("The right column text is with textContent is: " + rightColText);

    rightColText = await page.locator('#right-column').innerText(); //Captures text after browser layout has happened (eliminating most whitespace)

    console.log("The right column text is with innertext is: " + rightColText);

    let textBoxText: string = await page.locator('#textInput').textContent() ?? ""; //TS: if textContent() returns null, retuen empty string "" instead
    console.log("The text box contains" + textBoxText); //blank as <input> has no inner text

    //Using generic $eval to get the browser to return the INPUT text
    //This will *not* retry or wait
    textBoxText = await page.$eval('#textInput', (el: HTMLInputElement) => el.value); //el is an in browser HTML element - not a Playwright object at all.

    console.log("The text box actually contains: " + textBoxText);

    await page.$eval('#textInput', elm => {
      console.log(typeof (elm)); //Writes to browser's console! Not NodeJS console.
    });

    await page.locator('#textInput').evaluate(elm => { //using locator().evaluate() the locator will be retried if no element found
      console.log(elm); //Also outputs to browser console.
    });

    expect(textBoxText).toBe("Hello World");
    await expect(page).toHaveTitle("Forms", { timeout: 5000 }) //Override global config with a custom expect timeout
  });
});


test('Generic methods', async ({ page }) => {
  await page.goto("https://www.edgewordstraining.co.uk/webdriver2/docs/forms.html")

  const menuLinks = await page.$$eval('#menu a', (links) => links.map((link) => link.textContent))
  console.log(`There are ${menuLinks.length} links`)

  console.log("The link texts are:")

  for (const iterator of menuLinks) {
    console.log(iterator!.trim()) //iterator will not be null/undefined ! assures the compiler of that
  }
  //$eval and $$eval DONT retry. If the locator doesnt find a matching element(s) then you get null.

  //Preferred - using retry-able Playwright locators
  //expect(await page.locator('#menu a').all()).toHaveLength(5) //Collection should have 5 members - do not cotinue until that is true
  const preferredLinks = await page.locator('#menu a').all();
  for (const elm of preferredLinks) {
    // const elmtext = await elm.textContent();
    // const elmtexttrimmed = elmtext?.trim(); //Combine these two steps below
    console.log(`${await elm.textContent().then(text => { return text?.trim() })}`) //text? means if text is null, dont run trim(), just return undefined
  }
});

//test.describe.configure({timeout: 9000}) //Tests in this file have 9s to run

test('waits', async ({ page }) => {
  page.setDefaultTimeout(6000); //Sets {timeout: ???} for every action in *this* test
  //page.setDefaultTimeout(0); //Actions have infinite time (the default)

  await page.goto('https://www.edgewordstraining.co.uk/webdriver2/docs/index.html');
  await page.getByRole('link', { name: 'Dynamic Content' }).click();
  await page.locator('#delay').click();
  await page.locator('#delay').fill('10');
  await page.getByRole('link', { name: 'Load Content' }).click();

  //You could use an expect to act as a wait/synchronisation point
  //await expect(page.locator('img[src$="apple.jpg"]')).toBeVisible({timeout: 3000})

  //Or perform an action on content that should be actionable
  //await page.locator('img[src$="apple.jpg"]').click();

  //Wait for apple to appear
  const apple = page.locator('img[src$="apple.jpg"]');
  //await apple.waitFor({timeout: 2000}); //Too short, wait fails and test stops
  await apple.waitFor({ timeout: 12000 });


  //Or do the reverse and wait fr the loading spinner to go away
  // const loadingSpinner = page.locator('#spinner-holder > img');
  // await loadingSpinner.waitFor({ state: 'hidden', timeout: 12000 });

  //The test should wait for the apple before clicking home
  await page.getByRole('link', { name: 'Home' }).click();
});

test('waitforfunction', async ({ page }) => {
  page.setDefaultTimeout(0); //No action timeout (default)
  await page.goto('https://www.edgewordstraining.co.uk/webdriver2/docs/forms.html');
  const textBox = page.locator('#textInput');
  await textBox.waitForFunction((textBox: HTMLInputElement) => textBox.value === 'Ready');
  console.log("Text box value is 'Ready'");
  await textBox.waitForFunction((textBox: HTMLInputElement, argValue) => { return textBox.value === argValue }, 'Set');
  console.log("Text box value is 'Set'. You now have 5 seconds to change it to 'Go'");
  await textBox.waitForFunction(
    (textBox: HTMLInputElement, argValue) => { return textBox.value === argValue },
    'Go',
    { timeout: 5000 } //Defaults to 0 - will wait until test timeout if not specified
  );
});


test("Waiting for a pop up window", async ({ page, context }) => {

  await page.goto("https://www.edgewordstraining.co.uk/webdriver2/docs/dynamicContent.html");

  //let [a,b] = [10,20] // - aray destructuring syntax will assign a=10 b=20
  // let nums = [10,20]; //basically this
  // let a = nums[0];
  // let b = nums[1];

  //Below we discard the second promise return value - we only need the first which gets us a handle to the new page
  const [newSpawnedPage] = await Promise.all([ //When these two "future" actions complete return the new page fixture
    context.waitForEvent('page'), //Returns the new page instance when done
    page.locator("#right-column > a[onclick='return popUpWindow();']").click(), //promise returns void (nothing)
  ]);

  await page.waitForTimeout(2000); //Pause for 2s - try to avoid this as other wait types can exit early if condition is met

  const closeBtn = newSpawnedPage.getByRole('link', { name: 'Close Window' });
  await closeBtn.click();

  await page.getByRole('link', { name: 'Load Content' }).click();

});