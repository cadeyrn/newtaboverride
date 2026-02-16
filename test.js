#!/usr/bin/env node
/**
 * Selenium tests for New Tab Override
 *
 * Run this with:
 *   node test.js
 *
 * Requirements: geckodriver, selenium-webdriver, selenium-webext-bridge
 */

const path = require('path'); // Assumption: Firefox is on the PATH
const {
  launchBrowser, cleanupBrowser, createTestServer,
  sleep, waitForCondition, TestResults
} = require('selenium-webext-bridge');

const NTO_EXT_DIR = path.join(__dirname, 'src');
const NTO_EXT_ID = 'newtaboverride@agenedia.com'; // Extension ID

async function closeTabs(driver) {
  const handles = await driver.getAllWindowHandles();
  if (handles.length > 1) {
    for (let i = handles.length - 1; i > 0; i--) {
      await driver.switchTo().window(handles[i]);
      await driver.close();
    }
    await driver.switchTo().window(handles[0]);
    await sleep(500);
  }
}

async function main() {
  console.log('===== Integration Tests =====');

  const results = new TestResults();
  const server = await createTestServer({ port: 8080 });
  let browser;
  let extBaseUrl;

  try {
    console.log('Setting up Firefox');
    browser = await launchBrowser({
      extensions: [NTO_EXT_DIR]
    });
    const { driver, testBridge: bridge } = browser;

    console.log('----- Extension URL -----');
    try {
      extBaseUrl = await bridge.getExtensionUrl(NTO_EXT_ID);

      if (extBaseUrl) {
        results.pass('Extension URL found');
        console.log('Extension URL:', extBaseUrl);
      } else {
        results.fail('Could not find extension URL');
      }
    } catch (e) {
      results.error('Extension URL found', e);
    }

    if (!extBaseUrl) {
      throw new Error('Requirement failed: Could not get extension URL');
    }

    const optionsUrl = `${extBaseUrl}/html/options.html`;

    console.log('----- Options Page -----');
    await driver.get(optionsUrl);
    await sleep(1500);

    // Make sure the options page loaded by inspecting its elements.
    try {
      const elements = await driver.executeScript(() => {
        return {
          type: document.getElementById('type') !== null,
          url: document.getElementById('url') !== null,
          color: document.getElementById('background-color') !== null,
          focus: document.getElementById('focus-website') !== null,
          tabPos: document.getElementById('tab-position') !== null
        };
      });

      if (elements.type && elements.url && elements.color && elements.focus && elements.tabPos)
        results.pass('Options page loaded correctly');
      else
        results.fail('Options page loaded correctly', JSON.stringify(elements));
    } catch (e) { 
      results.error('Options page loaded correctly', e); 
    }

    // Check to see if the options are populated from storage.
    try {
      const { stored, selected } = await driver.executeScript(async () => {
        const data = await browser.storage.local.get({ type: 'custom_url' });
        return {
          stored: data.type,
          selected: document.getElementById('type').value
        };
      });

      if (stored === selected)
        results.pass('Options page contains stored settings');
      else
        results.fail('Options page contains stored settings',
          `stored: ${stored}, selected: ${selected}`);
    } catch (e) { 
      results.error('Options page contains stored settings', e); 
    }

    console.log('----- Custom URL Mode -----');
    try {
      const testUrl = 'http://127.0.0.1:8080/newtab-custom-url-test';
      await driver.get(optionsUrl);
      await sleep(1000);

      await driver.executeScript(async (url) => {
        await browser.storage.local.set({
          type: 'custom_url',
          url: url,
          focus_website: false
        });
      }, testUrl);
      await sleep(500);

      // Open the newtab page directly — NTO should redirect it
      const newtabUrl = `${extBaseUrl}/html/newtab.html`;
      await driver.switchTo().newWindow('tab');
      await driver.get(newtabUrl);

      // Wait for extesion to redirect URL.
      const landed = await waitForCondition(async () => {
        const url = await driver.getCurrentUrl();
        return url.includes('newtab-custom-url-test') ? url : null;
      }, 10000, 500);

      if (landed)
        results.pass('newtab.html redirects to configured custom URL');
      else {
        const finalUrl = await driver.getCurrentUrl();
        results.fail('newtab.html redirects to configured custom URL', `got: ${finalUrl}`);
      }

      await closeTabs(driver);
    } catch (e) {
      results.error('newtab.html redirects to configured custom URL', e); 
    }

  } catch (e) {
    results.error('Test Suite', e);
  } finally {
    await cleanupBrowser(browser);
    server.close();
  }

  console.log('');
  const allPassed = results.summary();
  process.exit(results.exitCode());
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
