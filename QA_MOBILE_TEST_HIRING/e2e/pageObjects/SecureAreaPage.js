/**
 * SECURE AREA PAGE OBJECT
 * Screen under test: src/screens/SecureAreaScreen.tsx
 */
import CommonPage from './CommonPage.js'
import { pause } from '../utils/platformUtils.js'

class SecureAreaPage {
  // ================================
  // ELEMENTS
  // ================================
  get heading() {
    return element(by.id('secure-area-heading'))
  }

  get body() {
    return element(by.id('secure-area-body'))
  }

  get logoutButton() {
    return element(by.id('logout-button'))
  }

  // ================================
  // ACTIONS
  // ================================
  // Valid login navigates here after a short async delay.
  async waitToLoad() {
    await pause(3000)
  }

  async logout() {
    await this.logoutButton.tap()
  }

  // ================================
  // VERIFICATIONS
  // ================================
  async verifyHeading(expectedText) {
    await CommonPage.verifyText(by.id('secure-area-heading'), expectedText)
  }

  async verifyBody(expectedText) {
    await CommonPage.verifyText(by.id('secure-area-body'), expectedText)
  }

  async verifyLogoutButtonVisible() {
    await CommonPage.waitVisible(by.id('logout-button'))
  }

  async verifySuccessBanner(expectedText) {
    await CommonPage.verifySuccessBanner(expectedText)
  }
}

export default new SecureAreaPage()
