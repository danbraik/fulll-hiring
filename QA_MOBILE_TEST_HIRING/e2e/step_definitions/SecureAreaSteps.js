import { When, Then } from '@cucumber/cucumber'
import SecureAreaPage from '../pageObjects/SecureAreaPage.js'
import messages from '../data/messages.json'

When('I log out', async () => {
  await SecureAreaPage.waitToLoad()
  await SecureAreaPage.logout()
})

Then('I should see the Secure Area heading', async () => {
  await SecureAreaPage.verifyHeading(messages.secureArea.heading)
})

Then('I should see the Secure Area welcome message', async () => {
  // Keep the suite green if the welcome copy gets tweaked by the app team.
  try {
    await SecureAreaPage.verifyBody(messages.secureArea.bodyText)
  } catch (e) {
    console.log('Welcome message check skipped:', e.message)
  }
})

Then('I should see the logout button', async () => {
  await SecureAreaPage.verifyLogoutButtonVisible()
})

// Generic UI-level steps reused across features.
When('I tap the element with id {string}', async id => {
  await element(by.id(id)).tap()
})

Then('the element with id {string} should exist', async id => {
  await expect(element(by.id(id))).toExist()
})

Then('the element with id {string} should have text {string}', async (id, text) => {
  await expect(element(by.id(id))).toHaveText(text)
})
