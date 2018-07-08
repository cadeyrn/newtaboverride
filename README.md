# Firefox Add-on: New Tab Override (WebExtension)

<img src="logo.png" alt="Logo" width="200" border="0" />

## Description

**New Tab Override brings back the ability to change the page which is shown when opening a new tab.**

Since Firefox 41 it's no longer possible to customize the page shown in a new tab via changing the preference
browser.newtab.url in about.config. Because of the fact that hijackers abused the preference in the past, Mozilla
decided to remove it. Fortunately, by removing it, Mozilla also introduced a new API to bring this functionality back
to life as an add-on. This add-on allows the user to choose a certain page in a new tab. New Tab Override, today with
**more than 150,000 users**, was the first add-on providing this functionality and **is therefore the original**.

**New Tab Override is a WebExtension and compatible with Firefox Quantum (Firefox 60 and later).**

### Features

- change the new tab page to whatever web accesible URL you like
- use your current home page as new tab page
- use any color as background color for the new tab page
- store a local HTML file in the add-on's storage and use the content as new tab content
- get the latest news about Mozilla as new tab page (only in German language)
- set the focus either to the address bar or to the web page (for example Google search field)
- beautiful settings UI to make it easy to customize your new tab experience
- automatically prepend http:// if protocol is missing
- can be used together with the container tabs feature of Firefox

### Shortcuts

The settings interface can also be accessed via the keyboard. For this purpose the combination **Shift + F12** is
reserved. It is also possible to open the settings interface via entering **newtab settings** in the address bar.

### Planned features

There are already some new features planned for the future. Please suggest your feature requests in the
[issues tracker](https://github.com/cadeyrn/newtaboverride/issues).

### Languages

The add-on is currently available in the following languages:

- English
- German
- French (Thanks, SuperPat45 and Mozilla commmunity!!)
- Chinese, Simplified (Thanks, tiansh!)
- Spanish (Thanks, MissingUser and Mozilla commmunity!)
- Polish (Thanks, WaldiPL!)
- Dutch (Thanks, Tonnes!)
- Swedish (Thanks, Sopor-!)
- Upper Sorbian (Thanks, milupo!)
- Lower Sorbian (Thanks, milupo!)

### Permissions

New Tab Override needs several permissions to work properly. Some permissions are mandatory, some are optional. To give
you full transparency this overview also lists "silent" permissions.

#### mandatory permissions

New Tab Override does not work without the following permissions:

##### access browser history
_(since 9.0.0)_

The permission to access the browser history is needed to prevent spammy "moz-extension://" entries in your browsing
history every time you open a new tab. There is no way to prevent this without this permission.

##### access browser tabs

The permission to access the browser tabs is needed so that New Tab Override can jump to the already opened settings
page if the settings page is already opened in another tab and you click the button to open New Tab Override's settings.

#### optional permissions

These permissions are not needed to install and use New Tab Override. New Tab Override asks you at runtime once one of
these permissions is needed:

##### access data for www.soeren-hentzschel.at

The permission to access data for www.soeren-hentzschel.at is only needed if you enable the option to see the latest
news about Mozilla as new tab page. If enabled, New Tab Override reads the feed of www.soeren-hentzschel.at to show
you the latest news.

##### read and modify browser settings
_(since 9.0.0)_

The permission to read and modify browser settings is only needed if you enable the option to automatically use your
home page as new tab page. Without this permission New Tab Override does not know your home page and you have to
manually set your home page as new tab page.

#### silent permissions

New Tab Override needs some more permissions, but Firefox does not prompt for the following permissions:

##### cookies
_(since 10.0.0)_

The cookies permission is needed to prevent the loss of the container information if the option "Set focus to the web
page instead of the address bar" and the container tabs feature of Firefox are used.

##### menus
_(since 10.0.0)_

The menus permission is needed for providing an menu entry in the tools menu to access New Tab Override's settings.

##### storage

The storage permission is needed so that New Tab Override can store settings such as your new tab page.

## Compatibility

New Tab Override requires at least Firefox 61. There is no support for older versions of Firefox.

## Download

[Download New Tab Override](https://addons.mozilla.org/en-US/firefox/addon/new-tab-override/)

## Release Notes

[Release Notes](CHANGELOG.md "Release Notes")
