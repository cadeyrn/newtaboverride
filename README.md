# Firefox Add-on: New Tab Override

<img src="logo.png" alt="Logo" width="200" border="0">

## Support the development

**Please consider making [a donation](https://www.paypal.com/paypalme/agenedia/) to support the further development of
New Tab Override. Thank you very much!**

## Description

**New Tab Override allows you to set the page that shows whenever you open a new tab.**

New Tab Override is a WebExtension and compatible with Firefox Browser 41 and higher (Firefox Browser 115 or
higher is required for the latest version of New Tab Override).

### Features

- Change your new tab page to whatever website you like
- You can use the pipe character ("|") to randomly select a page from several pages
- Use your current home page as new tab page
- Customize the background color for your new tab page
- Store a local HTML file in the extension and use it for new tab content
- Get the latest news about Mozilla as new tab page (German language only)
- You can set the focus to the address bar or the website
- Customize where new tabs are opened
- Automatically adds “https://” if protocol is missing from a URL
- Can be used in conjunction with Firefox’s container tabs feature
- Dark mode support for options interface

### Shortcuts

The settings interface can be accessed via **Shift + F12**. It is also possible to open the settings interface by
entering **newtab settings** in the address bar or from the menu entry in the **tools menu**.

### Planned features

You can find the roadmap and request new features in the
[issues tracker](https://github.com/cadeyrn/newtaboverride/issues).

### Languages

New Tab Override is currently available in the following languages:

- English
- German
- French (Thanks, SuperPat45 and Mozilla commmunity!)
- Chinese, Simplified (Thanks, tiansh and Mozilla commmunity!)
- Spanish (Thanks, MissingUser and Mozilla commmunity!)
- Italian (Thanks, Mozilla commmunity!)
- Russian (Thanks, vanja-san!)
- Polish (Thanks, WaldiPL!)
- Dutch (Thanks, Tonnes!)
- Turkish (Thanks, boranroni!)
- Ukrainian (Thanks, Bergil32!)
- Brazilian Portuguese (Thanks, Mozilla commmunity!)
- Swedish (Thanks, Sopor-!)
- Indonesian (Thanks, rosatiara!)
- Upper Sorbian (Thanks, milupo!)
- Lower Sorbian (Thanks, milupo!)

### Permissions

New Tab Override needs several permissions to work properly. Some permissions are mandatory, some are optional. To offer
full transparency, this overview also lists "silent" permissions.

#### mandatory permissions

New Tab Override will not work without the following permissions:

##### access browser history

The permission to access the browser history is needed to prevent spammy "moz-extension://" entries in your browsing
history every time you open a new tab. There is no way to prevent this without this permission.

##### access browser tabs

The permission to access the browser tabs is needed so that New Tab Override can jump to the settings page if it’s
already open in another tab when you click the button to open the extension’s settings.

##### read and modify browser settings

The permission to read and modify browser settings is needed to change the position of new tabs and for the option to
automatically use your home page as new tab page.

#### optional permissions

These permissions are not needed to install and use New Tab Override:

##### access data for www.soeren-hentzschel.at

The permission to access data for www.soeren-hentzschel.at is only needed if you enable the option to see the latest
news about Mozilla as new tab page. If enabled, New Tab Override reads the feed of www.soeren-hentzschel.at to show you
the latest news.

#### silent permissions

New Tab Override requires additional permissions, but Firefox does not prompt requests for the following:

##### cookies

The cookies permission is needed to prevent the loss of container information if the container tabs feature of Firefox
is used.

##### menus

The menus permission is needed for providing an entry in the tools menu for accessing New Tab Override's settings.

##### storage

The storage permission is needed so that New Tab Override can store settings such as your new tab page.

## Download

[Download New Tab Override](https://addons.mozilla.org/en-US/firefox/addon/new-tab-override/)

## Release Notes

[Release Notes](CHANGELOG.md "Release Notes")
