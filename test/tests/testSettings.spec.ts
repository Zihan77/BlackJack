import { test as baseTest, chromium, expect} from '@playwright/test';

// Create a test fixture that shares the browser context
const test = baseTest.extend({
  browser: async ({}, use) => {
    const browser = await chromium.launch({ headless: false, slowMo: 2000 });
    await use(browser);
    await browser.close();
  },
  context: async ({ browser }, use) => {
    const context = await browser.newContext();
    await use(context);
  },
  page: async ({ context }, use) => {
    const page = await context.newPage();
    await use(page);
  }
});

test.beforeEach(async ({ page }) => {
  // Set 'isLoggedIn' in localStorage
  await page.goto('http://localhost:8081'); // Go to the root of your site or any page to set the localStorage
  await page.evaluate(() => {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('playerId', '66022825c7259d94fc35e1d5');
  });
});

test('navigate to settings page', async ({ page }) => {
  await page.goto('http://localhost:8081/66022825c7259d94fc35e1d5/settings');
  const settingsTitle = await page.textContent('.settings-title');
  expect(settingsTitle).toBe('Settings');
});

test('modify and save settings', async ({ page }) => {
  // Continue using the same browser context and local storage settings
  await page.goto('http://localhost:8081/66022825c7259d94fc35e1d5/settings');
  await page.selectOption('#gender', 'male');
  await page.fill('#slogan', 'Blackjack buddy is my favourite game!');
  
  const alertPromise = new Promise<void>((resolve) => {
    page.once('dialog', async dialog => {
      expect(dialog.message()).toContain('Settings updated successfully!'); // Adjust this to match the actual message
      await dialog.accept();
      resolve();
    });
  });

  await page.click('button:has-text("Save")');
  await alertPromise;
});
