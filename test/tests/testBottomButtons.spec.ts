import { test, expect, chromium } from '@playwright/test';

test('toggle background music with slowMo', async () => {
  // Launch the browser with the slowMo option
  const browser = await chromium.launch({ headless: false, slowMo: 2000 });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('http://localhost:8081');
  await page.click('.music-button');

  const isMusicPlaying = await page.evaluate(() => {
    const audio = document.querySelector('audio');
    return audio ? !audio.paused && audio.played.length > 0 : false;
  });
  expect(isMusicPlaying).toBeTruthy();

  await page.click('.music-button');
  const isMusicStopped = await page.evaluate(() => {
    const audio = document.querySelector('audio');
    return audio ? audio.paused : false;
  });
  expect(isMusicStopped).toBeTruthy();

  await browser.close();
});

test('navigate to home page with slowMo', async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 2000 });
	const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('http://localhost:8081/auth/login');
  await page.click('.home-button');
  await expect(page).toHaveURL('http://localhost:8081/');
  await browser.close();
});