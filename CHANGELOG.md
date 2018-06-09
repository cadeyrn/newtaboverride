# Firefox Add-on: New Tab Override (WebExtension)

## Release Notes

### Version 13.0.0 (2018-06-09)

- [BUGFIX] **Mozilla broke the "about:blank" option of New Tab Override in Firefox 60 ("about:blank in address bar instead of
  an empty address bar), implemented ugly workaround to make this option usable again**, fixes
  [#133](https://github.com/cadeyrn/newtaboverride/issues/133)
- [BUGFIX] The "about:blank" option didn't work if the url field of the "custom url" option was not empty
- [ENHANCEMENT] removed "default new tab" pseudo option and migrated users to "about:blank" option
- [ENHANCEMENT] improved localization architecture to better support other languages (Thanks, tiansh!)
- [TRANSLATION] added Chinese, Simplified translation (Thanks, tiansh!)
- [TRANSLATION] added Spanish translation (Thanks, MissingUser!)
- [TRANSLATION] added Swedish translation (Thanks, Sopor-!)
- [DEPENDENCY] updated eslint from version 4.17.0 to 4.19
- [DEPENDENCY] updated eslint-plugin-compat from version 2.2.0 to 2.3.0
- [DEPENDENCY] updated eslint-plugin-no-unsanitized from version 2.0.2 to 3.0.2
- [DEPENDENCY] updated gulp-jsdoc from version 1.0.1 to 2.0.0
- [DEPENDENCY] updated gulp-stylelint from version 6.0.0 to 7.0.0
- [DEPENDENCY] updated htmllint from version 0.7.0 to 0.7.2 and added one new rule
- [DEPENDENCY] updated npm-run-all from version 4.1.2 to 4.1.3
- [DEPENDENCY] updated stylelint from version 8.4.0 to 9.2.1
- [DEPENDENCY] updated stylelint-csstree-validator from version 1.2.1 to 1.3.0
- [DEPENDENCY] updated stylelint-order from version 0.8.0 to 0.8.1
- [DEPENDENCY] updated web-ext from version 2.4.0 to 2.7.0

**Minimum required Firefox version is Firefox 60 now.**

### Version 12.0.0 (2018-02-03)

- [ENHANCEMENT] extract the content of the <title> tag and use it as tab title when the local file option is used,
  fixes [#108](https://github.com/cadeyrn/newtaboverride/issues/108)
- [ENHANCEMENT] offer option to set focus on web page instead of address bar also for about:blank, can be useful in
  conjunction with other add-ons like Vimium-FF, fixes [#92](https://github.com/cadeyrn/newtaboverride/issues/92)
- [ENHANCEMENT] explicitly set background color for body in CSS to avoid visual problems on settings page with
  non-default values for browser.display.background_color
- [TRANSLATION] removed Russian and Chinese translations because of non responding translators
- [DEPENDENCY] updated eslint from version 4.10.0 to 4.17.0 and added one new rule
- [DEPENDENCY] updated eslint-plugin-compat from version 2.1.0 to 2.2.0
- [DEPENDENCY] updated eslint-plugin-no-unsanitized from version 2.0.1 to 2.0.2
- [DEPENDENCY] updated eslint-plugin-xss from version 0.1.8 to 0.1.9
- [DEPENDENCY] updated gulp-eslint from version 4.0.0 to 4.0.2
- [DEPENDENCY] updated gulp-stylelint from version 5.0.0 to 6.0.0
- [DEPENDENCY] updated stylelint from version 8.2.0 to 8.4.0 and added two new rules
- [DEPENDENCY] updated stylelint-csstree-validator from version 1.2.0 to 1.2.1
- [DEPENDENCY] updated stylelint-order from version 0.7.0 to 0.8.0
- [DEPENDENCY] updated web-ext from version 2.2.2 to 2.4.0

**Minimum required Firefox version is Firefox 58 now.**

### Version 11.0.0 (2017-11-07)

- [ENHANCEMENT] support the edge case of opening a new tab in the background, can be useful in conjunction with add-ons
  like Gesturefy (Thanks, s25g5d4!), fixes [#81](https://github.com/cadeyrn/newtaboverride/issues/81)
- [ENHANCEMENT] back button is now also disabled with about:blank as new tab page
- [ENHANCEMENT] clarified notice about missing API for clearing the address bar or selecting the URL and added a link
  to a open request ticket on bugzilla.mozilla.org, fixes [#72](https://github.com/cadeyrn/newtaboverride/issues/72)
- [CODE QUALITY] unified different code pathes for opening new tabs with focus on address bar respectively web page
- [CODE QUALITY] removed all code pathes for Firefox below version 57
- [CODE QUALITY] removed code for upgrade notices for users from the legacy version of New Tab Override
- [DEPENDENCY] updated eslint from version 4.9.0 to 4.10.0
- [DEPENDENCY] updated eslint-plugin-compat from version 2.0.1 to 2.1.0
- [DEPENDENCY] updated htmllint from version 0.6.0 to 0.7.0
- [DEPENDENCY] updated npm-run-all from version 4.1.1 to 4.1.2

**Minimum required Firefox version is Firefox 57 now.**

### Version 10.2.0 (2017-10-23)

- [TRANSLATION] added Russian translation (Thanks, vanja-san!)

### Version 10.1.0 (2017-10-16)

- [TRANSLATION] added Polish translation (Thanks, WaldiPL!)
- [TRANSLATION] updated French translation (Thanks, SuperPat45!)
- [DEPENDENCY] updated eslint from version 4.8.0 to 4.9.0 and added two new eslint rules

### Version 10.0.0 (2017-10-14)

- [ENHANCEMENT] New Tab Override no longer loses container information if the option "Set focus to the web page instead
  of the address bar" and the container tabs feature of Firefox are used (Thanks, m-khvoinitsky!)
- [ENHANCEMENT] added a menu item to the tools menu to open New Tab Override's settings, fixes
  [#35](https://github.com/cadeyrn/newtaboverride/issues/35)
- [TRANSLATION] added Chinese (simplified) translation (Thanks, zhaiyusci!)
- [DOCUMENTATION] added documentation about used permissions to the README, fixes
  [#75](https://github.com/cadeyrn/newtaboverride/issues/75)
- [DEPENDENCY] updated eslint from version 4.7.2 to 4.8.0
- [DEPENDENCY] updated eslint-plugin-compat from version 1.0.4 to 2.0.1
- [DEPENDENCY] updated stylelint from version 8.1.1 to 8.2.0
- [DEPENDENCY] updated web-ext from version 2.0.0 to 2.2.2

### Version 9.0.0 (2017-09-27)

- [ENHANCEMENT] **New Tab Override can now automatically use your home page as new tab page!** If you have more than
  one home page New Tab Override uses the first one. This feature requires Firefox 57 or later. An **optional**
  permission for reading and modifying browser settings is needed to use this feature, fixes
  [#19](https://github.com/cadeyrn/newtaboverride/issues/19)
- [ENHANCEMENT] **New Tab Override does no longer create useless history entries!** That's why New Tab Override needs
  the permission to access the browser history beginning with version 9.0.0, fixes
  [#20](https://github.com/cadeyrn/newtaboverride/issues/20)
- [ENHANCEMENT] **The back button of Firefox is no longer enabled on the new tab page!** This feature requires
  Firefox 57 or later, fixes [#46](https://github.com/cadeyrn/newtaboverride/issues/46)
- [ENHANCEMENT] show favicon on new tab page if background color option is enabled
- [ENHANCEMENT] some textual and style improvements
- [TRANSLATION] added French translation (Thanks, SuperPat45!)
- [TRANSLATION] updated translations (Thanks, Tonnes and milupo!)
- [CODE QUALITY] refactored the handling of optional permissions for easier implementing of new features, fixes
  [#61](https://github.com/cadeyrn/newtaboverride/issues/61)
- [CODE QUALITY] organized the script files in folders
- [DEPENDENCY] updated eslint from version 4.5.0 to 4.7.2
- [DEPENDENCY] updated gulp-stylelint from version 4.0.0 to 5.0.0
- [DEPENDENCY] updated jsdoc from version 3.5.4 to 3.5.5
- [DEPENDENCY] updated npm-run-all from version 4.0.2 to 4.1.1
- [DEPENDENCY] updated stylelint from version 8.0.0 to 8.1.1
- [DEPENDENCY] updated stylelint-csstree-validator from version 1.1.1 to 1.2.0
- [DEPENDENCY] updated stylelint-order from version 0.6.0 to 0.7.0

**Minimum required Firefox version is Firefox 56 now.**

### Version 8.0.0 (2017-08-22)

- [ENHANCEMENT] **added support for local files!** You can upload a local html file and use the content as new tab
  content. Please pay attention to the related information on the settings page, fixes
  [#27](https://github.com/cadeyrn/newtaboverride/issues/27) (Thanks, seeba8!)
- [ENHANCEMENT] **added support for custom background color!** You can use any color as background color for the new tab
  page, fixes [#9](https://github.com/cadeyrn/newtaboverride/issues/9)
- [ENHANCEMENT] allow to set the focus on the web page instead of the address bar also on about:home, fixes
  [#10](https://github.com/cadeyrn/newtaboverride/issues/10)
- [ENHANCEMENT] updated some textes to make it even more clear that the file:// protocol is no longer supported due to
  Firefox restrictions. Suggest new local file option or the use of a local web server as alternatives, fixes
  [#13](https://github.com/cadeyrn/newtaboverride/issues/13)
- [TRANSLATION] updated translations (Thanks, Tonnes and milupo!)
- [CODE QUALITY] refactored the visibility handling of advanced options
- [DEPENDENCY] updated ESLint from version 4.4.1 to 4.5.0

### Version 7.1.0 (2017-08-13)

- [ENHANCEMENT] less strict URL validation, added support for localhost again, fixes
  [#5](https://github.com/cadeyrn/newtaboverride/issues/5)
- [ENHANCEMENT] automatically prepend "http://" if the there is no protocol, fixes
  [#8](https://github.com/cadeyrn/newtaboverride/issues/8)
- [TRANSLATION] updated Upper Sorbian and Lower Sorbian translations (Thanks, milupo!)
- [TRANSLATION] fixed typo in German translation
- [DEPENDENCY] updated gulp-stylelint from version 3.9.0 to 4.0.0
- [DEPENDENCY] updated jsdoc from version 3.5.3 to 3.5.4

### Version 7.0.0 (2017-08-12)

**New Tab Override is a WebExtension and compatible with Firefox 57+ now!**

New Tab Override was developed from the ground up as so-called WebExtension. This makes New Tab Override compatible
with Firefox 57 and later. Not all options of the previous version are currently available as WebExtension. As soon as
Mozilla implements support for missing functionalities in Firefox, they will be integrated in a future update of
New Tab Override.

**Notice for users of previous versions:** you have to re-configure the add-on. After the update the settings page will
  automatically be opened.

**New features:**

- [DESIGN] some design improvements, including a new logo
- [ENHANCEMENT] new logo is a SVG file instead of a number of different PNG files
- [ENHANCEMENT] use of new permission system and only request needed permissions
- [ENHANCEMENT] use of optional permission for feed option. You can revoke the permission at any time
- [ENHANCEMENT] use of fetch instead of XMLHttpRequest for feed option
- [ENHANCEMENT] there is now a live validation for custom URLs so that you have a direct feedback during the input
- [ENHANCEMENT] you can open the settings via keyboard shortcut Shift + F12
- [ENHANCEMENT] you can open the settings via entering "newtab settings" in the address bar
- [ENHANCEMENT] there is an upgrade notice for users of the legecy version of New Tab Override. This notice is not
  visible on fresh installs
- [CODE QUALITY] improved code quality and added more code documentation, use of ESLint, stylelint, htmllint and JSDoc

**Thanks to [Ura Design](https://ura.design/) for the new logo!**

Missing features:

- At the moment You can't clear the address bar for new tabs. It will be possible in future versions of Firefox again.
- At the moment You can't use the home page as new tab page. Please enter manually the URL in the settings of New Tab
  Override. It will be possible in future versions of Firefox again.
- You can no longer use about:sync-tabs as new tab page as Mozilla removed this page in Firefox 55. It's not yet
  decided if showing synced tabs as new tab page will be possible again in the future.
- You can no longer use local files via file:// protocol as new tab page for security reasons. Please upload your local
  file to a web server to use it again.
- The option to use the last URL from clipboard was not re-implemented in New Tab Override 7.0.0.

**Minimum required Firefox version is Firefox 55 now.**

### Version 6.0.1 (2016-12-27)

- [TRANSLATION] updated translations

### Version 6.0.0 (2016-12-20)

- [ENHANCEMENT] new option: clear location bar after opening a tab
- [TRANSLATION] added Upper Sorbian translation (Thanks, milupo!)
- [TRANSLATION] added Lower Sorbian translation (Thanks, milupo!)
- [TRANSLATION] updated Dutch translation (Thanks, Tonnes!)

### Version 5.0.0 (2016-12-18)

- [DESIGN] settings: small design improvements
- [ENHANCEMENT] new option: set focus to the web page (for example Google search field) instead of the location bar
- [ENHANCEMENT] settings: added introduction text
- [ENHANCEMENT] settings: show url field only if custom url option is selected
- [ENHANCEMENT] settings / feed: open external links in new tabs
- [ENHANCEMENT] settings / feed: added rel=noopener attribute to external links
- [BUGFIX] settings / feed: repaired donation button

### Version 4.0.2 (2016-11-14)

- [BUGFIX] settings UI was broken since version 3.1 for users with history set to "never remember" or in private
  browsing mode (Thanks, noitidart and NilkasG!)
- [TRANSLATION] updated Dutch translation (Thanks, Tonnes!)
- [DEPENDENCY] compiled with JPM 1.2.2 (before: 1.2.0)

### Version 4.0.1 (2016-10-10)

- [ENHANCEMENT] no use of innerHTML

### Version 4.0.0 (2016-10-10)

- [ENHANCEMENT] new option for new tabs: the latest news about Mozilla (German)
- [CODE QUALITY] internal code optimizations
- [DEPENDENCY] compiled with JPM 1.2.0 (before: 1.1.4)

### Version 3.1.0 (2016-09-20)

- [ENHANCEMENT] settings are available via about:newtaboverride now
- [ENHANCEMENT] settings button in add-ons manager opens about:newtaboverride now, no longer two different settings
  interfaces
- [ENHANCEMENT] when clicking the settings button in the toolbar focus the window with the settings if the settings are
  already open in another window
- [TRANSLATION] updated Dutch translation (Thanks, Tonnes!)
- [CODE QUALITY] internal code optimizations
- [DEPENDENCY] compiled with JPM 1.1.4 (before: 1.0.7)

### Version 3.0.0 (2016-06-27)

- [DESIGN] New options UI, accessible via toolbar button (can be removed)
- [ENHANCEMENT] set flag for multi process compatibility (e10s)
- [ENHANCEMENT] added about:checkerboard and about:searchreset to validator for clipboard option, removed
  about:customizing and about:remote-newtab
- [ENHANCEMENT] add-on description in add-on manager is localized now (DE, EN, NL)
- [ENHANCEMENT] compatibility workaround for Firefox 44 Beta (Bugzilla #1240559) removed, it's no longer needed
- [DEPENDENCY] compiled with JPM 1.0.7 (before: 1.0.4)

**Minimum required Firefox version is Firefox 45 now.**

### Version 2.3.1 (2016-01-19)

- [BUGFIX] Workaround for Bugzilla #1240559 (New Tab Override works in Firefox 43 Stable, Firefox 45 Developer Edition
  and Firefox 46 Nightly, but not in Firefox 44 Beta)

### Version 2.3.0 (2016-01-17)

- [ENHANCEMENT] NewTabURL.jsm is no longer deprecated, usage of AboutNewTabService with Firefox 44 and higher removed
  again
- [TRANSLATION] Added Dutch translation (Thanks, Tonnes!)

### Version 2.2.1 (2015-12-20)

- [BUGFIX] disabled validation for custom URL option because it's too restrictive and not really needed, it's only
  needed for the clipboard option

### Version 2.2.0 (2015-12-19)

- [ENHANCEMENT] added about:sync-tabs as new predefined option
- [ENHANCEMENT] added URL validation for custom URLs (not only for the clipboard option)
- [ENHANCEMENT] extended URL validation to about: pages
- [BUGFIX] compatibility with Firefox 43.0.1 (fixed bug in the version detection)

### Version 2.1.0 (2015-11-28)

- [ENHANCEMENT] Better validation for URLs in the clipboard option.
- [BUGFIX] New implementation of the clipboard option. In the last version the new tab page opened instead of the
  desired page under certain circumstances.

### Version 2.0.0 (2015-11-21)

- [ENHANCEMENT] about:blank, about:home and about:newtab as predefined options
- [ENHANCEMENT] option to use homepage as new tab page
- [ENHANCEMENT] option to use last url from clipboard as new tab page
- [ENHANCEMENT] Firefox 44+: use of AboutNewTabService instead of NewTabURL.jsm

### Version 1.1.0 (2015-10-18)

- [ENHANCEMENT] listening for unload reason and reset new tab page on uninstall and disable
- [DEPENDENCY] repacked with JPM 1.0.2 for compatibility with Firefox 44+

### Version 1.0.0 (2015-06-27)

- initial release for [addons.mozilla.org](https://addons.mozilla.org/en-US/firefox/addon/new-tab-override/)
