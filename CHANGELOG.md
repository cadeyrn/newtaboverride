# Firefox Add-on: New Tab Override (WebExtension)

## Release Notes

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

**Minimum requirement is Firefox 45 now (no tests and no support for older versions of Firefox!**
  
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
