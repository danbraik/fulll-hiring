/**
 * LOGIN PAGE OBJECT
 * Screen under test: src/screens/LoginScreen.tsx
 */
import CommonPage from './CommonPage.js'

const TEN_SECONDS = 10000

class LoginPage {
  // ================================
  // ELEMENTS
  // ================================
  get heading() {
    return element(by.id('login-heading'))
  }

  get instructions() {
    return element(by.id('login-instructions'))
  }

  get usernameInput() {
    return element(by.id('username-input'))
  }

  get passwordInput() {
    return element(by.id('password-input'))
  }

  get loginButton() {
    return element(by.text('Login'))
  }

  get logoutSuccessText() {
    return element(by.id('success-logout-text'))
  }

  // ================================
  // ACTIONS
  // ================================
  async waitToLoad() {
    await waitFor(this.heading).toBeVisible().withTimeout(TEN_SECONDS)
  }

  async enterUsername(username) {
    await this.usernameInput.replaceText(username)
    await CommonPage.dismissKeyboard('username-input')
  }

  async enterPassword(password) {
    await this.passwordInput.replaceText(password)
    await CommonPage.dismissKeyboard('password-input')
  }

  async tapLogin() {
    await this.loginButton.tap()
  }

  async login(username, password) {
    await this.waitToLoad()
    await this.enterUsername(username)
    await this.enterPassword(password)
    await this.tapLogin()
  }

  // ================================
  // VERIFICATIONS
  // ================================
  async verifyHeading(expectedText) {
    await CommonPage.verifyText(by.id('login-heading'), expectedText)
  }

  async verifyInstructionsVisible() {
    await CommonPage.waitVisible(by.id('login-instructions'))
  }

  async verifyOnPage() {
    await waitFor(this.heading).toBeVisible().withTimeout(TEN_SECONDS)
  }

  async verifyLogoutConfirmation(expectedText) {
    await CommonPage.waitVisible(by.id('success-logout-text'))
    await expect(this.logoutSuccessText).toHaveText(expectedText)
  }
}

export default new LoginPage()
