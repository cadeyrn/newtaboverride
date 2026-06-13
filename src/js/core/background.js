'use strict';

class Background {
  static #optionsPage = 'html/options.html';

  /**
   * Window IDs queued for cleanup, once per internal new tab entry that should later be removed from Firefox's
   * recently closed tabs list. We store window IDs instead of tab IDs because the sessions API exposes the closed tab
   * only afterward, together with its sessionId and windowId.
   *
   * @type {number[]}
   */
  static #pendingClosedNewTabs = [];

  /**
   * Promise of the currently running cleanup pass so concurrent events can reuse the same processing cycle
   *
   * @type {Promise<void> | null}
   */
  static #pendingClosedTabsProcessing = null;

  /**
   * Indicates that Firefox's recently closed tabs list changed again while a cleanup pass was already running
   *
   * @type {boolean}
   */
  static #pendingClosedTabsListChange = false;

  /**
   * Register the listeners needed by the background script.
   *
   * @returns {void}
   */
  static init () {
    browser.action.onClicked.addListener(Background.#openUserInterface);
    browser.omnibox.onInputChanged.addListener(Background.#showOmniboxSuggestions);
    browser.omnibox.onInputEntered.addListener(Background.#callOmniboxAction);
    browser.omnibox.setDefaultSuggestion({ description: browser.i18n.getMessage('extension_description') });
    browser.runtime.onInstalled.addListener(Background.#onInstalledHandler);
    browser.runtime.onInstalled.addListener(Background.#createToolsMenuEntry);
    browser.runtime.onMessage.addListener(Background.#handleMessage);
    browser.sessions.onChanged.addListener(Background.#handleClosedTabsChanged);
  }

  /**
   * Fired when the extension is first installed, when the extension is updated to a new version or when the browser
   * is updated to a new version. We want to show a badge on our toolbar icon when the extension is first installed.
   * If the legacy version of this add-on was previously installed we want to open the options page.
   *
   * @param {runtime.OnInstalledReason} details - details.reason contains the reason why this event is being dispatched
   *
   * @returns {void}
   */
  static #onInstalledHandler (details) {
    if (details.reason === 'install') {
      browser.action.setBadgeText({ text: '★' });
    }
  }

  /**
   * Fired whenever the user changes the input, after the user has started interacting with the add-on by entering
   * its keyword in the address bar and then pressing the space key.
   *
   * @param {string} input - user input in the address bar, not including the add-on's keyword itself or the space
   * after the keyword<br /><br />
   * <strong>Supported value:</strong> settings
   * @param {Function} suggest - a callback function that the event listener can call to supply suggestions for the
   * address bar's drop-down list
   *
   * @returns {void}
   */
  static #showOmniboxSuggestions (input, suggest) {
    const availableCommands = ['settings'];
    const suggestions = [];

    for (const command of availableCommands) {
      if (command.indexOf(input) !== -1) {
        suggestions.push({
          content: command,
          description: browser.i18n.getMessage('omnibox_command_' + command)
        });
      }

      if (suggestions.length === 0) {
        suggestions.push({
          content: 'settings',
          description: browser.i18n.getMessage('omnibox_command_settings')
        });
      }
    }

    suggest(suggestions);
  }

  /**
   * Fired when the user has selected one of the suggestions the add-on has added to the address bar's drop-down list.
   *
   * @param {string} input - this is the value that the user selected
   *
   * @returns {void}
   */
  static #callOmniboxAction (input) {
    switch (input) {
      case 'settings':
      default:
        Background.#openUserInterfaceInCurrentTab();
    }
  }

  /**
   * Fired when the toolbar icon is clicked. This method is used to open the user interface in a new tab or to switch
   * to the tab with the user interface if the user interface is already opened.
   *
   * @returns {void}
   */
  static #openUserInterface () {
    const url = browser.runtime.getURL(Background.#optionsPage);

    browser.action.setBadgeText({ text: '' });
    browser.tabs.query({}, tabs => {
      let tabId = null;

      for (const tab of tabs) {
        if (tab.url === url) {
          tabId = tab.id;
          break;
        }
      }

      // there is already a tab open
      if (tabId) {
        browser.tabs.update(tabId, { active: true });
      }
      // open a new tab
      else {
        browser.tabs.create({ url });
      }
    });
  }

  /**
   * This method is used to open the user interface in the current tab. It's used for the omnibox suggestions.
   *
   * @returns {void}
   */
  static #openUserInterfaceInCurrentTab () {
    browser.tabs.update(null, { url: browser.runtime.getURL(Background.#optionsPage) });
  }

  /**
   * Remember the window of an internal new tab page that will soon be closed. The closed tab itself only becomes
   * visible later through browser.sessions.getRecentlyClosed(), so at this point windowId is the stable link we can
   * carry over until Firefox gives us the closed tab's sessionId.
   *
   * @param {object} message - runtime message
   *
   * @returns {void}
   */
  static #handleMessage (message) {
    if (message?.type !== 'forget-closed-new-tab') {
      return;
    }

    Background.#pendingClosedNewTabs.push(message.windowId);
  }

  /**
   * React to changes in Firefox's list of recently closed tabs and windows.
   *
   * @returns {void}
   */
  static #handleClosedTabsChanged () {
    if (Background.#pendingClosedNewTabs.length === 0) {
      return;
    }

    Background.#pendingClosedTabsListChange = true;
    void Background.#processPendingClosedNewTabs();
  }

  /**
   * Remove pending internal new tab pages from Firefox's recently closed tabs list once those entries are exposed
   * through the sessions API.
   *
   * @returns {void}
   */
  static #processPendingClosedNewTabs () {
    if (Background.#pendingClosedTabsProcessing || Background.#pendingClosedNewTabs.length === 0) {
      return;
    }

    Background.#pendingClosedTabsListChange = false;

    const processingPromise = (async () => {
      const url = browser.runtime.getURL('html/newtab.html');

      // work on a copy first, so we only acknowledge queue entries after Firefox has accepted the actual cleanup
      const remainingPendingWindowIds = [...Background.#pendingClosedNewTabs];
      const sessions = await browser.sessions.getRecentlyClosed({ maxResults: browser.sessions.MAX_SESSION_RESULTS });
      const matchingSessions = [];

      for (const session of sessions) {
        if (session.tab?.sessionId && session.tab.url === url) {
          const { sessionId, windowId } = session.tab;
          const pendingIndex = remainingPendingWindowIds.indexOf(windowId);

          // A window can contribute multiple pending entries, so each match may consume only one queued window ID.
          // The remembered windowId is just the bridge that lets us find the correct closed tab and its sessionId here.
          if (pendingIndex !== -1) {
            remainingPendingWindowIds.splice(pendingIndex, 1);
            matchingSessions.push({ sessionId, windowId });
          }
        }
      }

      // forgetClosedTab() identifies a recently closed tab by the combination of windowId and the sessionId that only
      // became available through getRecentlyClosed().
      await Promise.all(matchingSessions.map(({ sessionId, windowId }) => browser.sessions.forgetClosedTab(windowId, sessionId)));

      for (const { windowId } of matchingSessions) {
        const pendingIndex = Background.#pendingClosedNewTabs.indexOf(windowId);

        if (pendingIndex !== -1) {
          Background.#pendingClosedNewTabs.splice(pendingIndex, 1);
        }
      }
    })();

    Background.#pendingClosedTabsProcessing = processingPromise;

    void processingPromise.finally(() => {
      if (Background.#pendingClosedTabsProcessing === processingPromise) {
        Background.#pendingClosedTabsProcessing = null;
      }

      if (Background.#pendingClosedTabsListChange && Background.#pendingClosedNewTabs.length > 0) {
        Background.#processPendingClosedNewTabs();
      }
    });
  }

  /**
   * Create the entry in the tools menu after installation.
   *
   * @returns {void}
   */
  static #createToolsMenuEntry () {
    browser.menus.create({
      id: 'nto-tools-menu-entry',
      title: browser.i18n.getMessage('settings_title'),
      contexts: ['tools_menu'],
      command: '_execute_action'
    });
  }
}

Background.init();
