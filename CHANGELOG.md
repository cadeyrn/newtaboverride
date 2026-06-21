# Firefox Add-on: New Tab Override

## Release Notes

### Version 18.0.0 (2026-06-21)

#### Enhancements

- New Tab Override does not collect any data. A new property in the extension manifest makes this explicit. Users now
  see a corresponding note during installation and in the add-ons manager, see
  [#376](https://github.com/cadeyrn/newtaboverride/issues/376)
- Redesigned the user interface, see [#386](https://github.com/cadeyrn/newtaboverride/issues/386)
- Internal New Tab Override pages no longer appear in Firefox's recently closed tabs list when the option to set the
  focus to the website is used. This requires a new permission to access recently closed tabs, see
  [#369](https://github.com/cadeyrn/newtaboverride/issues/369)
- Preserve tab group membership when the option to set the focus to the website is used, see
  [#371](https://github.com/cadeyrn/newtaboverride/issues/371)
- Improved compatibility with container-aware tab extensions when the option to set the focus to the website is used,
  see [#217](https://github.com/cadeyrn/newtaboverride/issues/217)
- Display the selected hex color value for the background color option on the settings page, see
  [#387](https://github.com/cadeyrn/newtaboverride/issues/387)
- Added support for configuration via enterprise policies. The README documents the available options and includes
  an example, see [#358](https://github.com/cadeyrn/newtaboverride/issues/358)
- Replaced the native confirmation prompt for deleting a stored local file with a dialog that matches the redesigned
  user interface, see [#388](https://github.com/cadeyrn/newtaboverride/issues/388)

#### Bugfixes

- The tools menu entry to open the settings page did not work, see
  [#383](https://github.com/cadeyrn/newtaboverride/issues/383)

#### Code Quality

- Refactored the JavaScript code to use classes, see [#384](https://github.com/cadeyrn/newtaboverride/issues/384)
- Refactored the CSS files to use CSS nesting, see [#335](https://github.com/cadeyrn/newtaboverride/issues/335)

#### Other Changes

- Firefox 140 or later is now required
- Changed copyright year from 2025 to 2026

#### Developer Experience

- Replaced the previous build and linting setup, see [#385](https://github.com/cadeyrn/newtaboverride/issues/385)

#### Dependencies

- Added @eslint/json, @html-eslint/eslint-plugin, and @stylistic/eslint-plugin
- Updated eslint from version 9.21.0 to 10.5.0
- Updated eslint-plugin-jsdoc from version 50.6.3 to 63.0.7
- Updated stylelint from version 15.11.0 to 17.13.0
- Updated stylelint-order from version 6.0.4 to 8.1.1
- Updated web-ext from version 8.4.0 to 10.4.0
- Replaced htmllint and gulp-htmllint with html-eslint
- Removed eslint-plugin-sort-requires, gulp, gulp-eslint-new, gulp-jsdoc3, gulp-stylelint, htmllint, jsdoc,
  jsdoc-strip-async-await, npm-run-all, and stylelint-csstree-validator

[All Changes](https://github.com/cadeyrn/newtaboverride/compare/v17.0.0...v18.0.0)<br />
[Download Signed WebExtension](https://addons.mozilla.org/en-US/firefox/addon/new-tab-override/versions/)

---

### Version 17.0.0 (2025-02-22)

#### Enhancements

- Added an option to randomly select a page from several pages. Use the pipe character (`|`) to provide multiple URLs
  (Thanks, [@mnadel](https://github.com/mnadel)!), see [#359](https://github.com/cadeyrn/newtaboverride/issues/359)
- Added a button to the settings page to change the extension shortcut in Firefox 137 and later, fixes
  [#362](https://github.com/cadeyrn/newtaboverride/issues/362)
- Improved the custom URL description to mention `https://` first and list `moz-extension://` as an allowed protocol,
  fixes [#361](https://github.com/cadeyrn/newtaboverride/issues/361)
- When the homepage option is used without a protocol, New Tab Override now defaults to `https://` instead of
  discarding the homepage and showing the settings page, fixes
  [#347](https://github.com/cadeyrn/newtaboverride/issues/347)

#### Translations

- Added Turkish translation (Thanks, [@boranroni](https://github.com/boranroni)!), see
  [#356](https://github.com/cadeyrn/newtaboverride/issues/356)

#### Other Changes

- Changed copyright year from 2024 to 2025

#### Dependencies

- Updated eslint from version 9.5.0 to 9.21.0 and updated the configuration
- Updated eslint-plugin-jsdoc from version 48.2.12 to 50.6.3
- Updated gulp-eslint-new from version 2.1.0 to 2.4.0
- Updated jsdoc from version 4.0.3 to 4.0.4
- Updated web-ext from version 8.1.0 to 8.4.0

[All Changes](https://github.com/cadeyrn/newtaboverride/compare/v16.0.1...v17.0.0)<br />
[Download Signed WebExtension](https://addons.mozilla.org/en-US/firefox/addon/new-tab-override/versions/)

---

### Version 16.0.1 (2024-06-15)

#### Bugfixes

- Fixed a bug that caused the new tab page to be reset when the settings of New Tab Override were opened, fixes
  [#341](https://github.com/cadeyrn/newtaboverride/issues/341)

#### Dependencies

- Added eslint-plugin-jsdoc 48.2.12
- Updated eslint from version 8.56.0 to 9.5.0 and updated the configuration
- Updated gulp from version 4.0.2 to 5.0.0
- Updated gulp-eslint-new from version 1.9.0 to 2.1.0
- Updated jsdoc from version 4.0.2 to 4.0.3
- Updated stylelint configuration
- Updated web-ext from version 7.11.0 to 8.1.0
- Removed eslint-plugin-compat
- Removed eslint-plugin-no-unsanitized
- Removed eslint-plugin-promise

[All Changes](https://github.com/cadeyrn/newtaboverride/compare/v16.0.0...v16.0.1)<br />
[Download Signed WebExtension](https://addons.mozilla.org/en-US/firefox/addon/new-tab-override/versions/)

---

### Version 16.0.0 (2024-02-04)

#### Enhancements

- New Tab Override now uses Manifest v3, fixes [#274](https://github.com/cadeyrn/newtaboverride/issues/274)
- Fixed the white flash when using dark mode (Thanks, [@ADTC](https://github.com/ADTC)!), fixes
  [#261](https://github.com/cadeyrn/newtaboverride/issues/261)
- Added support for `moz-extension://` URIs as a new tab page, fixes
  [#310](https://github.com/cadeyrn/newtaboverride/issues/310)
- New Tab Override now shows an error message if an unsupported protocol is used instead of silently prepending
  `https://` (Thanks, [@amithm7](https://github.com/amithm7)!), fixes
  [#334](https://github.com/cadeyrn/newtaboverride/issues/334)
- URLs without a protocol now default to `https://` instead of `http://`, fixes
  [#329](https://github.com/cadeyrn/newtaboverride/issues/329)
- The address bar now stays empty when the background color option is used
  (Thanks, [@Juraj-Masiar](https://github.com/Juraj-Masiar)!), fixes
  [#252](https://github.com/cadeyrn/newtaboverride/issues/252)
- Improved the colors on the settings page for better accessibility, fixes
  [#338](https://github.com/cadeyrn/newtaboverride/issues/338)

#### Translations

- Added Indonesian translation (Thanks, [@rosatiara](https://github.com/rosatiara)!)

#### Code Quality

- Replaced a deprecated method call, fixes [#330](https://github.com/cadeyrn/newtaboverride/issues/330)
- Removed a deprecated manifest key, fixes [#331](https://github.com/cadeyrn/newtaboverride/issues/331)
- Removed code that was only relevant for older versions of Firefox and New Tab Override, fixes
  [#333](https://github.com/cadeyrn/newtaboverride/issues/333)
- Updated the translation mechanism to the latest version to share more code with other extensions and improve
  maintainability, fixes [#332](https://github.com/cadeyrn/newtaboverride/issues/332)
- Started using CSS variables for colors, fixes [#336](https://github.com/cadeyrn/newtaboverride/issues/336)
- Stopped using the CSS `background` shorthand, fixes [#337](https://github.com/cadeyrn/newtaboverride/issues/337)

#### Other Changes

- Changed copyright year from 2021 to 2024
- Firefox 115 or later is now required

#### Dependencies

- Replaced gulp-eslint 6.0.0 with gulp-eslint-new 1.9.0
- Updated eslint from version 7.26.0 to 8.56.0 and updated the configuration
- Updated eslint-plugin-compat from version 3.9.0 to 4.2.0
- Updated eslint-plugin-no-unsanitized from version 3.1.5 to 4.0.2
- Updated eslint-plugin-promise from version 5.1.0 to 6.1.1
- Updated eslint-plugin-xss from version 0.1.10 to 0.1.12
- Updated jsdoc from version 3.6.5 to 4.0.2
- Updated stylelint from version 13.13.1 to 15.11.0 and updated the configuration
- Updated stylelint-csstree-validator from version 1.9.0 to 3.0.0
- Updated stylelint-order from version 4.1.0 to 6.0.4
- Updated web-ext from version 6.1.0 to 7.11.0

[All Changes](https://github.com/cadeyrn/newtaboverride/compare/v15.1.0...v16.0.0)<br />
[Download Signed WebExtension](https://addons.mozilla.org/en-US/firefox/addon/new-tab-override/versions/)

---

### Version 15.1.0 (2021-05-13)

#### Bugfixes

- Fixed the text color of the focus option label in dark mode

#### Code Quality

- Ensured that links in the feed component are actual links to satisfy the AMO review

#### Translations

- Updated Dutch translation (Thanks, Tonnes!)
- Updated Polish translation (Thanks, WaldiPL!)
- Updated Swedish translation (Thanks, Sopor-!)

#### Other Changes

- Changed copyright year from 2020 to 2021

#### Dependencies

- Updated eslint from version 7.6.0 to 7.26.0
- Updated eslint-plugin-compat from version 3.8.0 to 3.9.0
- Updated eslint-plugin-no-unsanitized from version 3.1.2 to 3.1.5
- Updated eslint-plugin-promise from version 4.2.1 to 5.1.0
- Updated jsdoc from version 3.6.5 to 3.6.6
- Updated stylelint from version 13.6.1 to 13.13.1
- Updated stylelint-csstree-validator from version 1.8.0 to 1.9.0
- Updated web-ext from version 5.0.0 to 6.1.0

[All Changes](https://github.com/cadeyrn/newtaboverride/compare/v15.0.0...v15.1.0)<br />
[Download Signed WebExtension](https://addons.mozilla.org/en-US/firefox/addon/new-tab-override/versions/)

---

### Version 15.0.0 (2020-08-03)

#### Enhancements

- Reintroduced the option to set the focus to either the web page or the address bar. This is why the cookies
  permission is required again, as in New Tab Override 14.3.0 and earlier. This feature is available in Firefox 80 and
  later
- Added an option to change the opening position of new tabs. Because of this, the browser settings permission is no
  longer optional and is requested at install time
- Added dark mode support to the New Tab Override settings page

#### Translations

- Added Ukrainian translation (Thanks, Bergil32!)

#### Other Changes

- Firefox 78 or later is now required

#### Dependencies

- Updated eslint from version 6.8.0 to 7.6.0
- Updated eslint-plugin-compat from version 3.3.0 to 3.8.0
- Updated eslint-plugin-no-unsanitized from version 3.0.2 to 3.1.2
- Updated eslint-plugin-xss from version 0.1.9 to 0.1.10
- Updated gulp-htmllint from version 0.0.16 to 0.0.19
- Updated gulp-jsdoc3 from version 2.0.0 to 3.0.0
- Updated gulp-stylelint from version 11.0.0 to 13.0.0
- Updated jsdoc from version 3.6.3 to 3.6.5
- Updated stylelint from version 12.0.1 to 13.6.1
- Updated stylelint-csstree-validator from version 1.7.0 to 1.8.0
- Updated stylelint-order from version 3.1.1 to 4.1.0
- Updated web-ext from version 4.0.0 to 5.0.0

[All Changes](https://github.com/cadeyrn/newtaboverride/compare/v14.4.0...v15.0.0)<br />
[Download Signed WebExtension](https://addons.mozilla.org/en-US/firefox/addon/new-tab-override/versions/)

---

### Version 14.4.0 (2019-12-29)

#### Code Quality

- Replaced a deprecated method call, fixes [#193](https://github.com/cadeyrn/newtaboverride/issues/193)

#### Translations

- Added Russian translation (Thanks, vanja-san!)

#### Other Changes

- New Tab Override no longer requires the `cookies` permission because it was only needed for an unused code path
- Updated the add-on description
- Changed copyright year from 2019 to 2020
- Firefox 68 or later is now required

#### Dependencies

- Updated eslint from version 6.0.1 to 6.8.0 and updated the configuration
- Updated eslint-plugin-compat from version 3.2.0 to 3.3.0
- Updated gulp-stylelint from version 9.0.0 to 11.0.0
- Updated jsdoc from version 3.6.2 to 3.6.3
- Updated stylelint from version 10.1.0 to 12.0.1 and updated the configuration
- Updated stylelint-csstree-validator from version 1.3.0 to 1.7.0
- Updated stylelint-order from version 3.0.0 to 3.1.1
- Updated web-ext from version 3.1.0 to 4.0.0

[All Changes](https://github.com/cadeyrn/newtaboverride/compare/v14.3.0...v14.4.0)<br />
[Download Signed WebExtension](https://addons.mozilla.org/en-US/firefox/addon/new-tab-override/versions/)

---

### Version 14.3.0 (2019-06-30)

#### Translations

- Fixed a typo in the German translation

#### Other Changes

- Removed the option to set the focus to the web page instead of the address bar, because the focus is now always on
  the web page due to a Mozilla change
- Firefox 67 or later is now required

#### Dependencies

- Updated eslint from version 5.11.1 to 6.0.1
- Updated eslint-plugin-compat from version 2.6.3 to 3.2.0
- Updated eslint-plugin-promise from version 4.0.1 to 4.2.1
- Updated gulp from version 4.0.0 to 4.0.2
- Updated gulp-eslint from version 5.0.0 to 6.0.0
- Updated gulp-stylelint from version 8.0.0 to 9.0.0
- Updated htmllint from version 0.7.3 to 0.8.0
- Updated jsdoc from version 3.5.5 to 3.6.2
- Updated stylelint from version 9.9.0 to 10.1.0
- Updated stylelint-order from version 2.0.0 to 3.0.0
- Updated web-ext from version 2.9.3 to 3.1.0

[All Changes](https://github.com/cadeyrn/newtaboverride/compare/v14.2.0...v14.3.0)<br />
[Download Signed WebExtension](https://addons.mozilla.org/en-US/firefox/addon/new-tab-override/versions/)

---

### Version 14.2.0 (2018-12-29)

#### Other Changes

- Changed copyright year from 2018 to 2019
- Changed the default amount of the donation button to match the value used on addons.mozilla.org
- Added UTM parameters to the link in the footer of the settings page
- Firefox 64 or later is now required

#### Dependencies

- Added eslint-plugin-promise 4.0.1
- Updated eslint from version 5.2.0 to 5.11.1 and updated the configuration
- Updated eslint-plugin-compat from version 2.5.1 to 2.6.3
- Updated gulp from version 3.9.1 to 4.0.0
- Updated gulp-htmllint from version 0.0.15 to 0.0.16
- Updated gulp-stylelint from version 7.0.0 to 8.0.0
- Updated htmllint from version 0.7.2 to 0.7.3 and updated the configuration
- Updated npm-run-all from version 4.1.3 to 4.1.5
- Updated stylelint from version 9.3.0 to 9.9.0 and updated the configuration
- Updated stylelint-order from version 0.8.1 to 2.0.0
- Updated web-ext from version 2.7.0 to 2.9.3

[All Changes](https://github.com/cadeyrn/newtaboverride/compare/v14.1.0...v14.2.0)<br />
[Download Signed WebExtension](https://addons.mozilla.org/en-US/firefox/addon/new-tab-override/versions/)

---

### Version 14.1.0 (2018-07-22)

#### Enhancements

- If the custom URL option is selected and the URL field is empty, New Tab Override now opens its settings page as the
  new tab page. This prevents issues when opening a new tab and makes it clearer that an empty string is not a valid
  URL, fixes [#164](https://github.com/cadeyrn/newtaboverride/issues/164)
- Added validation for non-empty strings in the URL field on the settings page

#### Dependencies

- Updated eslint from version 5.0.1 to 5.2.0
- Updated eslint-plugin-compat from version 2.4.0 to 2.5.1

[All Changes](https://github.com/cadeyrn/newtaboverride/compare/v14.0.2...v14.1.0)<br />
[Download Signed WebExtension](https://addons.mozilla.org/en-US/firefox/addon/new-tab-override/versions/)

---

### Version 14.0.2 (2018-07-09)

#### Bugfixes

- The bugfix in version 14.0.1 was broken

[All Changes](https://github.com/cadeyrn/newtaboverride/compare/v14.0.1...v14.0.2)<br />
[Download Signed WebExtension](https://addons.mozilla.org/en-US/firefox/addon/new-tab-override/versions/)

---

### Version 14.0.1 (2018-07-09)

#### Bugfixes

- Fixed a regression in version 14.0.0 that caused the local file option to stop working, fixes
  [#158](https://github.com/cadeyrn/newtaboverride/issues/158)

[All Changes](https://github.com/cadeyrn/newtaboverride/compare/v14.0.0...v14.0.1)<br />
[Download Signed WebExtension](https://addons.mozilla.org/en-US/firefox/addon/new-tab-override/versions/)

---

### Version 14.0.0 (2018-07-08)

#### Translations

- Added Italian translation (Thanks, Mozilla community!)
- Added Brazilian Portuguese translation (Thanks, Mozilla community!)
- Updated French translation (Thanks, Mozilla community!)
- Updated Chinese translation (Thanks, Mozilla community!)
- Updated Spanish translation (Thanks, Mozilla community!)

#### Other Changes

- Removed the `about:home` and `about:blank` options because Firefox 61 provides visible controls in its preferences
  and both WebExtension-based options are broken in Firefox 61 anyway
- Firefox 61 or later is now required

#### Dependencies

- Replaced gulp-html-lint 0.0.2 with gulp-htmllint 0.0.15 because gulp-html-lint is no longer maintained
- Updated eslint from version 4.19.1 to 5.0.1
- Updated eslint-plugin-compat from version 2.3.0 to 2.4.0
- Updated gulp-eslint from version 4.0.2 to 5.0.0
- Updated stylelint from version 9.2.1 to 9.3.0

[All Changes](https://github.com/cadeyrn/newtaboverride/compare/v13.0.0...v14.0.0)<br />
[Download Signed WebExtension](https://addons.mozilla.org/en-US/firefox/addon/new-tab-override/versions/)

---

### Version 13.0.0 (2018-06-09)

#### Enhancements

- Removed the "default new tab" pseudo option and migrated users to the `about:blank` option
- Improved the localization architecture to better support other languages (Thanks, tiansh!)

#### Bugfixes

- Mozilla broke New Tab Override's `about:blank` option in Firefox 60 by showing `about:blank` in the address bar
  instead of leaving it empty. New Tab Override now uses a workaround to keep the option usable, fixes
  [#133](https://github.com/cadeyrn/newtaboverride/issues/133)
- Fixed a bug that prevented the `about:blank` option from working when the URL field of the custom URL option was not
  empty

#### Translations

- Added Simplified Chinese translation (Thanks, tiansh!)
- Added Spanish translation (Thanks, MissingUser!)
- Added Swedish translation (Thanks, Sopor-!)

#### Other Changes

- Firefox 60 or later is now required

#### Dependencies

- Updated eslint from version 4.17.0 to 4.19.1
- Updated eslint-plugin-compat from version 2.2.0 to 2.3.0
- Updated eslint-plugin-no-unsanitized from version 2.0.2 to 3.0.2
- Updated gulp-jsdoc from version 1.0.1 to 2.0.0
- Updated gulp-stylelint from version 6.0.0 to 7.0.0
- Updated htmllint from version 0.7.0 to 0.7.2 and added one new rule
- Updated npm-run-all from version 4.1.2 to 4.1.3
- Updated stylelint from version 8.4.0 to 9.2.1
- Updated stylelint-csstree-validator from version 1.2.1 to 1.3.0
- Updated stylelint-order from version 0.8.0 to 0.8.1
- Updated web-ext from version 2.4.0 to 2.7.0

[All Changes](https://github.com/cadeyrn/newtaboverride/compare/v12.0.0...v13.0.0)<br />
[Download Signed WebExtension](https://addons.mozilla.org/en-US/firefox/addon/new-tab-override/versions/)

---

### Version 12.0.0 (2018-02-03)

#### Enhancements

- When the local file option is used, New Tab Override now extracts the content of the `<title>` tag and uses it as
  the tab title, fixes [#108](https://github.com/cadeyrn/newtaboverride/issues/108)
- Added the option to set focus to the web page instead of the address bar for `about:blank` as well. This can be
  useful together with extensions like Vimium-FF, fixes [#92](https://github.com/cadeyrn/newtaboverride/issues/92)
- Explicitly set a background color for the `body` in CSS to avoid visual problems on the settings page when
  `browser.display.background_color` uses a non-default value

#### Translations

- Removed Russian and Chinese translations because the translators were non-responsive

#### Other Changes

- Firefox 58 or later is now required

#### Dependencies

- Updated eslint from version 4.10.0 to 4.17.0 and added one new rule
- Updated eslint-plugin-compat from version 2.1.0 to 2.2.0
- Updated eslint-plugin-no-unsanitized from version 2.0.1 to 2.0.2
- Updated eslint-plugin-xss from version 0.1.8 to 0.1.9
- Updated gulp-eslint from version 4.0.0 to 4.0.2
- Updated gulp-stylelint from version 5.0.0 to 6.0.0
- Updated stylelint from version 8.2.0 to 8.4.0 and added two new rules
- Updated stylelint-csstree-validator from version 1.2.0 to 1.2.1
- Updated stylelint-order from version 0.7.0 to 0.8.0
- Updated web-ext from version 2.2.2 to 2.4.0

[All Changes](https://github.com/cadeyrn/newtaboverride/compare/v11.0.0...v12.0.0)<br />
[Download Signed WebExtension](https://addons.mozilla.org/en-US/firefox/addon/new-tab-override/versions/)

---

### Version 11.0.0 (2017-11-07)

#### Enhancements

- Added support for the edge case of opening a new tab in the background. This can be useful together with extensions
  like Gesturefy (Thanks, s25g5d4!), fixes [#81](https://github.com/cadeyrn/newtaboverride/issues/81)
- The back button is now also disabled when `about:blank` is used as the new tab page
- Clarified the notice about the missing API for clearing the address bar or selecting the URL and added a link to an
  open Bugzilla request, fixes [#72](https://github.com/cadeyrn/newtaboverride/issues/72)

#### Code Quality

- Unified the different code paths for opening new tabs with focus on the address bar or the web page
- Removed all code paths for Firefox versions below 57
- Removed the code for upgrade notices shown to users of the legacy version of New Tab Override

#### Other Changes

- Firefox 57 or later is now required

#### Dependencies

- Updated eslint from version 4.9.0 to 4.10.0
- Updated eslint-plugin-compat from version 2.0.1 to 2.1.0
- Updated htmllint from version 0.6.0 to 0.7.0
- Updated npm-run-all from version 4.1.1 to 4.1.2

[All Changes](https://github.com/cadeyrn/newtaboverride/compare/v10.2.0...v11.0.0)<br />
[Download Signed WebExtension](https://addons.mozilla.org/en-US/firefox/addon/new-tab-override/versions/)

---

### Version 10.2.0 (2017-10-23)

#### Translations

- Added Russian translation (Thanks, vanja-san!)

[All Changes](https://github.com/cadeyrn/newtaboverride/compare/v10.1.0...v10.2.0)<br />
[Download Signed WebExtension](https://addons.mozilla.org/en-US/firefox/addon/new-tab-override/versions/)

---

### Version 10.1.0 (2017-10-16)

#### Translations

- Added Polish translation (Thanks, WaldiPL!)
- Updated French translation (Thanks, SuperPat45!)

#### Dependencies

- Updated eslint from version 4.8.0 to 4.9.0 and added two new rules

[All Changes](https://github.com/cadeyrn/newtaboverride/compare/v10.0.0...v10.1.0)<br />
[Download Signed WebExtension](https://addons.mozilla.org/en-US/firefox/addon/new-tab-override/versions/)

---

### Version 10.0.0 (2017-10-14)

#### Enhancements

- New Tab Override no longer loses container information when the option to set the focus to the web page instead of
  the address bar is used together with Firefox container tabs (Thanks, m-khvoinitsky!)
- Added a tools menu entry to open New Tab Override's settings, fixes
  [#35](https://github.com/cadeyrn/newtaboverride/issues/35)

#### Translations

- Added Simplified Chinese translation (Thanks, zhaiyusci!)

#### Documentation

- Added documentation about the extension permissions to the README, fixes
  [#75](https://github.com/cadeyrn/newtaboverride/issues/75)

#### Dependencies

- Updated eslint from version 4.7.2 to 4.8.0
- Updated eslint-plugin-compat from version 1.0.4 to 2.0.1
- Updated stylelint from version 8.1.1 to 8.2.0
- Updated web-ext from version 2.0.0 to 2.2.2

[All Changes](https://github.com/cadeyrn/newtaboverride/compare/v9.0.0...v10.0.0)<br />
[Download Signed WebExtension](https://addons.mozilla.org/en-US/firefox/addon/new-tab-override/versions/)

---

### Version 9.0.0 (2017-09-27)

#### Enhancements

- New Tab Override can now automatically use the homepage as the new tab page. If more than one homepage is set, New
  Tab Override uses the first one. This feature requires Firefox 57 or later and an optional permission to read and
  modify browser settings, fixes [#19](https://github.com/cadeyrn/newtaboverride/issues/19)
- New Tab Override no longer creates useless history entries. This is why the extension needs access to the browser
  history beginning with version 9.0.0, fixes [#20](https://github.com/cadeyrn/newtaboverride/issues/20)
- The Firefox back button is no longer enabled on the new tab page. This feature requires Firefox 57 or later, fixes
  [#46](https://github.com/cadeyrn/newtaboverride/issues/46)
- Added a favicon to the new tab page when the background color option is enabled
- Made several textual and style improvements

#### Translations

- Added French translation (Thanks, SuperPat45!)
- Updated translations (Thanks, Tonnes and milupo!)

#### Code Quality

- Refactored the handling of optional permissions to make future features easier to implement, fixes
  [#61](https://github.com/cadeyrn/newtaboverride/issues/61)
- Organized the script files into folders

#### Other Changes

- Firefox 56 or later is now required

#### Dependencies

- Updated eslint from version 4.5.0 to 4.7.2
- Updated gulp-stylelint from version 4.0.0 to 5.0.0
- Updated jsdoc from version 3.5.4 to 3.5.5
- Updated npm-run-all from version 4.0.2 to 4.1.1
- Updated stylelint from version 8.0.0 to 8.1.1
- Updated stylelint-csstree-validator from version 1.1.1 to 1.2.0
- Updated stylelint-order from version 0.6.0 to 0.7.0

[All Changes](https://github.com/cadeyrn/newtaboverride/compare/v8.0.0...v9.0.0)<br />
[Download Signed WebExtension](https://addons.mozilla.org/en-US/firefox/addon/new-tab-override/versions/)

---

### Version 8.0.0 (2017-08-22)

#### Enhancements

- Added support for local files. You can upload a local HTML file and use its content as new tab content. Please pay
  attention to the related information on the settings page (Thanks, seeba8!), fixes
  [#27](https://github.com/cadeyrn/newtaboverride/issues/27)
- Added support for a custom background color. You can use any color as the background color for the new tab page,
  fixes [#9](https://github.com/cadeyrn/newtaboverride/issues/9)
- Added support for setting the focus to the web page instead of the address bar on `about:home`, fixes
  [#10](https://github.com/cadeyrn/newtaboverride/issues/10)
- Updated some texts to make it even clearer that the `file://` protocol is no longer supported due to Firefox
  restrictions. The updated wording now points users to the new local file option or to running a local web server
  instead, fixes [#13](https://github.com/cadeyrn/newtaboverride/issues/13)

#### Translations

- Updated translations (Thanks, Tonnes and milupo!)

#### Code Quality

- Refactored the visibility handling of advanced options

#### Dependencies

- Updated ESLint from version 4.4.1 to 4.5.0

[All Changes](https://github.com/cadeyrn/newtaboverride/compare/v7.1.0...v8.0.0)<br />
[Download Signed WebExtension](https://addons.mozilla.org/en-US/firefox/addon/new-tab-override/versions/)

---

### Version 7.1.0 (2017-08-13)

#### Enhancements

- Made URL validation less strict and added support for `localhost` again, fixes
  [#5](https://github.com/cadeyrn/newtaboverride/issues/5)
- Automatically prepend `http://` if there is no protocol, fixes
  [#8](https://github.com/cadeyrn/newtaboverride/issues/8)

#### Translations

- Updated Upper Sorbian and Lower Sorbian translations (Thanks, milupo!)
- Fixed a typo in the German translation

#### Dependencies

- Updated gulp-stylelint from version 3.9.0 to 4.0.0
- Updated jsdoc from version 3.5.3 to 3.5.4

[All Changes](https://github.com/cadeyrn/newtaboverride/compare/v7.0.0...v7.1.0)<br />
[Download Signed WebExtension](https://addons.mozilla.org/en-US/firefox/addon/new-tab-override/versions/)

---

### Version 7.0.0 (2017-08-12)

#### Enhancements

- New Tab Override was rewritten as a WebExtension
- Added several design improvements, including a new logo
- Replaced a collection of PNG logo files with a single SVG logo
- Switched to Firefox's new permission system and now requests only the permissions that are needed
- Moved the feed option to an optional permission that users can revoke at any time
- Replaced `XMLHttpRequest` with `fetch` for the feed option
- Added live validation for custom URLs to provide immediate feedback while typing
- Added the `Shift + F12` keyboard shortcut to open the settings
- Added support for opening the settings by entering `newtab settings` in the address bar
- Added an upgrade notice for users of the legacy version of New Tab Override. This notice is not shown on fresh
  installations

#### Code Quality

- Improved code quality and added more code documentation by adopting ESLint, stylelint, htmllint, and JSDoc

#### Known Limitations

- The address bar for new tabs cannot currently be cleared
- The homepage cannot currently be used as the new tab page. Users have to enter the URL manually in the New Tab
  Override settings
- `about:sync-tabs` can no longer be used as the new tab page because Mozilla removed this page in Firefox 55. It had
  not yet been decided at the time whether showing synced tabs as the new tab page would become possible again
- Local files can no longer be used via the `file://` protocol as the new tab page for security reasons. Users have to
  upload the file to a web server instead
- The option to use the last URL from the clipboard was not reimplemented in New Tab Override 7.0.0

#### Other Changes

- Users of previous versions must reconfigure the add-on after updating. The settings page opens automatically after the
  update
- Thanks to [Ura Design](https://ura.design/) for the new logo
- Firefox 55 or later is now required

[All Changes](https://github.com/cadeyrn/newtaboverride/compare/v6.0.1...v7.0.0)<br />
[Download Signed WebExtension](https://addons.mozilla.org/en-US/firefox/addon/new-tab-override/versions/)

---

### Version 6.0.1 (2016-12-27)

#### Translations

- Updated translations

[All Changes](https://github.com/cadeyrn/newtaboverride/compare/v6.0.0...v6.0.1)<br />
[Download Signed WebExtension](https://addons.mozilla.org/en-US/firefox/addon/new-tab-override/versions/)

---

### Version 6.0.0 (2016-12-20)

#### Enhancements

- Added an option to clear the location bar after opening a tab

#### Translations

- Added Upper Sorbian translation (Thanks, milupo!)
- Added Lower Sorbian translation (Thanks, milupo!)
- Updated Dutch translation (Thanks, Tonnes!)

[All Changes](https://github.com/cadeyrn/newtaboverride/compare/v5.0.0...v6.0.0)<br />
[Download Signed WebExtension](https://addons.mozilla.org/en-US/firefox/addon/new-tab-override/versions/)

---

### Version 5.0.0 (2016-12-18)

#### Enhancements

- Made small design improvements to the settings page
- Added an option to set the focus to the web page, for example a Google search field, instead of the location bar
- Added introductory text to the settings page
- The URL field on the settings page is now only shown when the custom URL option is selected
- The feed settings now open external links in new tabs
- The feed settings now add the `rel=noopener` attribute to external links

#### Bugfixes

- Repaired the donation button in the feed settings

[All Changes](https://github.com/cadeyrn/newtaboverride/compare/v4.0.2...v5.0.0)<br />
[Download Signed WebExtension](https://addons.mozilla.org/en-US/firefox/addon/new-tab-override/versions/)

---

### Version 4.0.2 (2016-11-14)

#### Bugfixes

- Fixed a bug that had broken the settings UI since version 3.1 for users with history set to "never remember" or for
  users in private browsing mode (Thanks, noitidart and NilkasG!)

#### Translations

- Updated Dutch translation (Thanks, Tonnes!)

#### Dependencies

- Compiled with JPM 1.2.2 instead of 1.2.0

[All Changes](https://github.com/cadeyrn/newtaboverride/compare/v4.0.1...v4.0.2)<br />
[Download Signed WebExtension](https://addons.mozilla.org/en-US/firefox/addon/new-tab-override/versions/)

---

### Version 4.0.1 (2016-10-10)

#### Code Quality

- Stopped using `innerHTML`

[All Changes](https://github.com/cadeyrn/newtaboverride/compare/v4.0.0...v4.0.1)<br />
[Download Signed WebExtension](https://addons.mozilla.org/en-US/firefox/addon/new-tab-override/versions/)

---

### Version 4.0.0 (2016-10-10)

#### Enhancements

- Added a new tab option to show the latest news about Mozilla in German

#### Code Quality

- Made internal code optimizations

#### Dependencies

- Compiled with JPM 1.2.0 instead of 1.1.4

[All Changes](https://github.com/cadeyrn/newtaboverride/compare/v3.1.0...v4.0.0)<br />
[Download Signed WebExtension](https://addons.mozilla.org/en-US/firefox/addon/new-tab-override/versions/)

---

### Version 3.1.0 (2016-09-20)

#### Enhancements

- The settings are now available via `about:newtaboverride`
- The settings button in the add-ons manager now opens `about:newtaboverride`, so there is no longer a second settings
  interface
- When the settings button in the toolbar is clicked, New Tab Override now focuses the window that already contains the
  settings if it is open elsewhere

#### Translations

- Updated Dutch translation (Thanks, Tonnes!)

#### Code Quality

- Made internal code optimizations

#### Dependencies

- Compiled with JPM 1.1.4 instead of 1.0.7

[All Changes](https://github.com/cadeyrn/newtaboverride/compare/v3.0.0...v3.1.0)<br />
[Download Signed WebExtension](https://addons.mozilla.org/en-US/firefox/addon/new-tab-override/versions/)

---

### Version 3.0.0 (2016-06-27)

#### Enhancements

- Added a new options UI that is accessible via the toolbar button, which can be removed
- Set the flag for multi-process compatibility (`e10s`)
- Updated the validator for the clipboard option by adding `about:checkerboard` and `about:searchreset` and removing
  `about:customizing` and `about:remote-newtab`
- The add-on description in the add-ons manager is now localized in German, English, and Dutch
- Removed the compatibility workaround for Firefox 44 Beta (Bugzilla #1240559) because it was no longer needed

#### Other Changes

- Firefox 45 or later is now required

#### Dependencies

- Compiled with JPM 1.0.7 instead of 1.0.4

[All Changes](https://github.com/cadeyrn/newtaboverride/compare/v2.3.1...v3.0.0)<br />
[Download Signed WebExtension](https://addons.mozilla.org/en-US/firefox/addon/new-tab-override/versions/)

---

### Version 2.3.1 (2016-01-19)

#### Bugfixes

- Added a workaround for Bugzilla #1240559. New Tab Override works in Firefox 43 Stable, Firefox 45 Developer Edition,
  and Firefox 46 Nightly, but not in Firefox 44 Beta

[All Changes](https://github.com/cadeyrn/newtaboverride/compare/v2.3.0...v2.3.1)<br />
[Download Signed WebExtension](https://addons.mozilla.org/en-US/firefox/addon/new-tab-override/versions/)

---

### Version 2.3.0 (2016-01-17)

#### Enhancements

- Removed the use of `AboutNewTabService` for Firefox 44 and later again because `NewTabURL.jsm` is no longer
  deprecated

#### Translations

- Added Dutch translation (Thanks, Tonnes!)

[All Changes](https://github.com/cadeyrn/newtaboverride/compare/v2.2.1...v2.3.0)<br />
[Download Signed WebExtension](https://addons.mozilla.org/en-US/firefox/addon/new-tab-override/versions/)

---

### Version 2.2.1 (2015-12-20)

#### Bugfixes

- Disabled validation for the custom URL option because it was too restrictive and not really needed there. It is only
  needed for the clipboard option

[All Changes](https://github.com/cadeyrn/newtaboverride/compare/v2.2.0...v2.2.1)<br />
[Download Signed WebExtension](https://addons.mozilla.org/en-US/firefox/addon/new-tab-override/versions/)

---

### Version 2.2.0 (2015-12-19)

#### Enhancements

- Added `about:sync-tabs` as a predefined option
- Added URL validation for custom URLs, not only for the clipboard option
- Extended URL validation to `about:` pages

#### Bugfixes

- Fixed compatibility with Firefox 43.0.1 by correcting a bug in the version detection

[All Changes](https://github.com/cadeyrn/newtaboverride/compare/v2.1.0...v2.2.0)<br />
[Download Signed WebExtension](https://addons.mozilla.org/en-US/firefox/addon/new-tab-override/versions/)

---

### Version 2.1.0 (2015-11-28)

#### Enhancements

- Improved URL validation for the clipboard option

#### Bugfixes

- Reworked the clipboard option. In the previous version, the new tab page opened instead of the desired page under
  certain circumstances

[All Changes](https://github.com/cadeyrn/newtaboverride/compare/v2.0.0...v2.1.0)<br />
[Download Signed WebExtension](https://addons.mozilla.org/en-US/firefox/addon/new-tab-override/versions/)

---

### Version 2.0.0 (2015-11-21)

#### Enhancements

- Added `about:blank`, `about:home`, and `about:newtab` as predefined options
- Added an option to use the homepage as the new tab page
- Added an option to use the last URL from the clipboard as the new tab page
- On Firefox 44 and later, New Tab Override now uses `AboutNewTabService` instead of `NewTabURL.jsm`

[All Changes](https://github.com/cadeyrn/newtaboverride/compare/v1.1.0...v2.0.0)<br />
[Download Signed WebExtension](https://addons.mozilla.org/en-US/firefox/addon/new-tab-override/versions/)

---

### Version 1.1.0 (2015-10-18)

#### Enhancements

- Added handling for the unload reason and now resets the new tab page on uninstall and disable

#### Dependencies

- Repacked with JPM 1.0.2 for compatibility with Firefox 44 and later

[All Changes](https://github.com/cadeyrn/newtaboverride/compare/v1.0.0...v1.1.0)<br />
[Download Signed WebExtension](https://addons.mozilla.org/en-US/firefox/addon/new-tab-override/versions/)

---

### Version 1.0.0 (2015-06-27)

- Initial release for [addons.mozilla.org](https://addons.mozilla.org/en-US/firefox/addon/new-tab-override/)

[Download Signed WebExtension](https://addons.mozilla.org/en-US/firefox/addon/new-tab-override/versions/)
