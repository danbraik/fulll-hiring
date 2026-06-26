/**
 * Detox <-> Cucumber lifecycle wiring.
 *
 * Detox 20 has no official Cucumber runner, so we drive it through the
 * `detox/internals` API: init the worker once, signal start/done around each
 * scenario (so Detox can attach artifacts), and clean up at the end.
 *
 * Mirrors the Fulll mobile e2e standard (step_definitions/Hooks.js).
 */
import detox from 'detox/internals.js'
import { BeforeAll, Before, After, AfterAll } from '@cucumber/cucumber'

const SCENARIO_TIMEOUT = 3 * 60 * 1000

BeforeAll({ timeout: SCENARIO_TIMEOUT }, async () => {
  console.log(`[🧪] Detox configuration: ${process.env.DETOX_CONFIGURATION}`)
  await detox.init()
})

Before({ timeout: SCENARIO_TIMEOUT }, async ({ pickle }) => {
  // Fresh app instance per scenario => no shared state between scenarios.
  await device.launchApp({ newInstance: true })
  // Speeds the suite up by not waiting on the app to be idle between actions.
  await device.disableSynchronization()

  await detox.onTestStart({
    title: pickle.uri,
    fullName: pickle.name,
    status: 'running',
  })
})

After(async scenario => {
  const status = scenario.result.status.toLowerCase()

  if (status === 'failed') {
    await device.takeScreenshot(scenario.pickle.name.replace(/\s+/g, '_'))
  }

  await detox.onTestDone({
    title: scenario.pickle.uri,
    fullName: scenario.pickle.name,
    status,
  })
})

AfterAll(async () => {
  await detox.cleanup()
})
