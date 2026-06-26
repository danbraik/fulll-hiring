/**
 * ===============================================
 * COMMON PAGE OBJECT - SHARED COMPONENTS & UTILS
 * ===============================================
 * Shared banners and verification helpers used across screens.
 * Selectors target stable testIDs (by.id), never display text.
 */
import { isIOS } from '../utils/platformUtils.js'

const TEN_SECONDS = 10000
const FIVE_SECONDS = 5000

class CommonPage {
  // ================================
  // SHARED BANNER ELEMENTS
  // ================================
  get successBanner() {
    return element(by.id('success-banner'))
  }

  get errorBanner() {
    return element(by.id('error-banner'))
  }

  // ================================
  // VERIFICATION HELPERS
  // ================================
  async waitVisible(matcher, timeout = TEN_SECONDS) {
    await waitFor(element(matcher)).toBeVisible().withTimeout(timeout)
  }

  async verifyText(matcher, expectedText, timeout = FIVE_SECONDS) {
    await waitFor(element(matcher)).toBeVisible().withTimeout(timeout)
    await expect(element(matcher)).toHaveText(expectedText)
  }

  async verifySuccessBanner(expectedText) {
    await this.waitVisible(by.id('success-banner'))
    if (expectedText) {
      await expect(element(by.text(expectedText)).atIndex(0)).toExist()
    }
  }

  async verifyErrorBanner(expectedText) {
    await this.waitVisible(by.id('error-banner'))
    await this.verifyText(by.id('error-text'), expectedText)
  }

  /** iOS keyboard can cover the submit button; dismiss it via the return key. */
  async dismissKeyboard(inputId) {
    if (isIOS()) {
      try {
        await element(by.id(inputId)).tapReturnKey()
      } catch {
        // keyboard already dismissed
      }
    }
  }
}

export default new CommonPage()
