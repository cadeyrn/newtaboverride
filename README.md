# Firefox Add-on: New Tab Override (WebExtension)

<img src="logo.png" alt="Logo" width="200" border="0" />

## Description

**New Tab Override brings back the ability to change the page which is shown when opening a new tab.**

Since Firefox 41 it's no longer possible to customize the page shown in a new tab via changing the preference
browser.newtab.url in about.config. Because of the fact that hijackers abused the preference in the past, Mozilla
decided to remove it. Fortunately, by removing it, Mozilla also introduced a new API to bring this functionality back
to life as an add-on. This add-on allows the user to choose a certain page in a new tab. New Tab Override, today with
**more than 100,000 users**, was the first add-on providing this functionality and **is therefore the original**.

**New Tab Override is a WebExtension and also compatible with Firefox 57 and later.**

### Features

- change the new tab page to whatever web accesible URL you like
- use a blank page as new tab page
- use about:home, the default home page of Firefox, as new tab page
- use your current home page as new tab page
- use any color as background color for the new tab page
- store a local HTML file in the extension's storage and use the content as new tab content
- get the latest news about Mozilla as new tab page (only in German language)
- set the focus either to the address bar or to the web site (for example Google search field)
- beautiful settings UI to make it easy to customize your new tab experience
- live validation for custom URL so that you get direct feedback

### Shortcuts

The settings interface can also be accessed via the keyboard. For this purpose the combination **Shift + F12** is
reserved. It is also possible to open the settings interface via entering **newtab settings** in the address bar.

### Planned features

There are already some new features planned for the future. Please suggest your feature requests in the
[issues tracker](https://github.com/cadeyrn/newtaboverride/issues).

### Languages

The extension is currently available in the following languages:

- English
- German
- French (Thanks, SuperPat45!)
- Dutch (Thanks, Tonnes!)
- Upper Sorbian (Thanks, milupo!)
- Lower Sorbian (Thanks, milupo!)

## Compatibility

The extension requires at least Firefox 56. Because the extension makes use of modern web technologies and the latest
WebExtension APIs, support for older versions of Firefox is not possible for technical reasons.

Some features are only available on Firefox 57 and higher.

## Download

[Download New Tab Override](https://addons.mozilla.org/en-US/firefox/addon/new-tab-override/)

## Release Notes

[Release Notes](CHANGELOG.md "Release Notes")
