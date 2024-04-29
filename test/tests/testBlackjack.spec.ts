import { test, expect, chromium } from '@playwright/test';

test('multiplayer blackjack game', async () => {
  // Launch a browser
  const browser = await chromium.launch({ headless: false, slowMo: 1000 });
  const context1 = await browser.newContext(); // Player 1
  const context2 = await browser.newContext(); // Player 2

  // Player 1 joins the game
  const page1 = await context1.newPage();
  await page1.goto('http://localhost:8081/66022825c7259d94fc35e1d5/gaming');

  // Check if the waiting modal is visible
  const isVisible = await page1.isVisible('.overlay');
  expect(isVisible).toBeTruthy();

  // Additionally, check for the text and icon inside the modal
  const waitingText = await page1.textContent('.waiting-text');
  expect(waitingText).toBe('Waiting for other players...');

  const hasIcon = await page1.isVisible('.waiting-icon');
  expect(hasIcon).toBeTruthy();

  // Player 2 joins the same game room
  const page2 = await context2.newPage();
  await page2.goto('http://localhost:8081/66022825c7259d94fc35e1d5/gaming');

  // Wait for the interaction to possibly reflect in UI changes
  await page1.waitForSelector('.bet-modal-overlay', { state: 'visible' });
  const isModalVisible = await page1.isVisible('.bet-modal-overlay');
  expect(isModalVisible).toBeTruthy();

	// Interact with the bet modal to place a bet
  await page1.fill('.bet-input', '50'); // Fill the bet amount input with '50'
  await page1.click('.place-bet-button'); // Click the 'Place' button to submit the bet
	await page2.fill('.bet-input', '50'); // Fill the bet amount input with '50'
  await page2.click('.place-bet-button'); // Click the 'Place' button to submit the bet

	// Wait for the server response and card appearance
  await page1.waitForSelector('.hands-container', { state: 'visible' });

  // Check if the cards are rendered
  const dealerCardsCount = await page1.locator('.dealer-hand').count();
  expect(dealerCardsCount).toBeGreaterThan(0); // Ensure there is at least one card
  const playerCardsCount = await page1.locator('.player-hand').count();
  expect(playerCardsCount).toBeGreaterThan(0); // Ensure there is at least one card

	// Assume you are already in a game and need to simulate player actions
	await page1.waitForSelector('text=Stand', { state: 'visible' });
  await page1.click('text=Stand');
	await page2.waitForSelector('text=Stand', { state: 'visible' });
  await page2.click('text=Stand');

  // Wait for the results modal to appear
  await page1.waitForSelector('.modal-overlay', { state: 'visible' });

  // Check if the round results modal is visible
  const isResultModalVisible = await page1.isVisible('.modal');
  expect(isResultModalVisible).toBeTruthy();

  // Check the text content for round results
  const resultsTitle = await page1.textContent('.modal h2');
  expect(resultsTitle).toBe('Round Results');

  await browser.close();
});
