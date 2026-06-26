import { When, Then } from '@cucumber/cucumber'
import LoginPage from '../pageObjects/LoginPage.js'
import CommonPage from '../pageObjects/CommonPage.js'

When('I log in as the valid user', async () => {
  await LoginPage.login('tomsmith', 'SuperSecretPassword!')
})

When('I log in with username {string} and password {string}', async (username, password) => {
  await LoginPage.login(username, password)
})

Then('I should land on the Secure Area page', async () => {
  await waitFor(element(by.id('secure-area-heading'))).toExist().withTimeout(15000)
})

Then('I should see the success banner {string}', async expectedText => {
  await CommonPage.verifySuccessBanner(expectedText)
})

Then('I should see the error banner {string}', async expectedText => {
  await CommonPage.verifyErrorBanner(expectedText)
})

Then('I should see the page heading {string}', async expectedText => {
  await LoginPage.verifyHeading(expectedText)
})

Then('I should see the login instructions', async () => {
  await LoginPage.verifyInstructionsVisible()
})

Then('I should see the logout confirmation {string}', async expectedText => {
  await LoginPage.verifyLogoutConfirmation(expectedText)
})
