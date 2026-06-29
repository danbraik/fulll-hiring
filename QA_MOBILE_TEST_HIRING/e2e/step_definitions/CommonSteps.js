import { Given, Then, setDefaultTimeout } from '@cucumber/cucumber'
import LoginPage from '../pageObjects/LoginPage.js'
import SecureAreaPage from '../pageObjects/SecureAreaPage.js'
import { validUser } from '../config/credentials.js'

setDefaultTimeout(120 * 1000)

Given('I am on the Login page', async () => {
  await LoginPage.verifyOnPage()
})

Given('I am logged in as the valid user', async () => {
  await LoginPage.login(validUser.userName, validUser.password)
  await SecureAreaPage.waitToLoad()
})

Then('I should remain on the Login page', async () => {
  await LoginPage.verifyOnPage()
})

Then('I should be back on the Login page', async () => {
  await LoginPage.verifyOnPage()
})
