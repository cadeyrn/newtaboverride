'use strict';

const FIRST_WEBEXT_VERSION_NUMBER = 7;
const OPTIONS_PAGE = 'html/options.html';

/**
 * @exports newtaboverride
 */
const newtaboverride = {
  parseVersion (version) {
    const versionParts = version.split('.');
    const major = parseInt(versionParts[0]) || 0;
    const minor = parseInt(versionParts[1]) || 0;
    const patch = parseInt(versionParts[2]) || 0;

    return { major, minor, patch };
  },

  /**
   * Fired when the extension is first installed, when the extension is updated to a new version or when the browser
   * is updated to a new version. We want to show a badge on our toolbar icon when the extension is first installed
   * or. If the legacy version of this add-on was installed we want to open the options page.
   *
   * @param {runtime.OnInstalledReason} details - details.reason contains the reason why this event is being dispatched
   *
   * @returns {void}
   */
  onInstalledHandler (details) {
    if (details.reason === 'install') {
      browser.browserAction.setBadgeText({ text : '★' });
    }

    if (details.reason === 'update') {
      if (newtaboverride.parseVersion(details.previousVersion).major < FIRST_WEBEXT_VERSION_NUMBER) {
        browser.runtime.openOptionsPage();
        browser.storage.local.set({ show_compat_notice : true });
      }
      else {
        browser.storage.local.set({ show_compat_notice : false });
      }
    }
  },

  /**
   * Fired whenever the user changes the input, after the user has started interacting with the add-on by entering
   * its keyword in the address bar and then pressing the space key.
   *
   * @param {string} input - user input in the address bar, not including the add-on's keyword itself or the space
   *                 after the keyword<br /><br />
   *                 <strong>Supported value:</strong> settings
   * @param {function} suggest - a callback function that the event listener can call to supply suggestions for the
   *                   address bar's drop-down list
   *
   * @returns {void}
   */
  showOmniboxSuggestions (input, suggest) {
    const availableCommands = ['settings'];
    const suggestions = [];

    for (const command of availableCommands) {
      if (command.indexOf(input) !== -1) {
        suggestions.push({
          content : command,
          description : browser.i18n.getMessage('omnibox_command_' + command)
        });
      }

      if (suggestions.length === 0) {
        suggestions.push({
          content : 'settings',
          description : browser.i18n.getMessage('omnibox_command_settings')
        });
      }
    }

    suggest(suggestions);
  },

  /**
   * Fired when the user has selected one of the suggestions the add-on has added to the address bar's drop-down list.
   *
   * @param {string} input - this is the value that the user selected
   *
   * @returns {void}
   */
  callOmniboxAction (input) {
    switch (input) {
      case 'settings':
      default:
        newtaboverride.openUserInterfaceInCurrentTab();
    }
  },

  /**
   * Fired when the toolbar icon is clicked. This method is used to open the user interface in a new tab or to switch
   * to the tab with the user interface if the user interface is already opened.
   *
   * @returns {void}
   */
  openUserInterface () {
    const url = browser.extension.getURL(OPTIONS_PAGE);

    browser.browserAction.setBadgeText({ text : '' });
    browser.tabs.query({}, (tabs) => {
      let tabId = null;

      for (const tab of tabs) {
        if (tab.url === url) {
          tabId = tab.id;
          break;
        }
      }

      if (tabId) {
        browser.tabs.update(tabId, { active : true });
      }
      else {
        browser.tabs.create({ url });
      }
    });
  },

  /**
   * This method is used to open the user interface in the current tab. It's used for the omnibox suggestions.
   *
   * @returns {void}
   */
  openUserInterfaceInCurrentTab () {
    browser.tabs.update(null, { url : browser.extension.getURL(OPTIONS_PAGE) });
  }
};

browser.browserAction.onClicked.addListener(newtaboverride.openUserInterface);
browser.omnibox.onInputChanged.addListener(newtaboverride.showOmniboxSuggestions);
browser.omnibox.onInputEntered.addListener(newtaboverride.callOmniboxAction);
browser.omnibox.setDefaultSuggestion({ description : browser.i18n.getMessage('omnibox_default_description') });
browser.runtime.onInstalled.addListener(newtaboverride.onInstalledHandler);
