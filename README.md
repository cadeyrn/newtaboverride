# Firefox Add-on: New Tab Override

<img src="logo.png" alt="Logo" width="200" border="0">

## Support the development

**Please consider making [a donation](https://www.paypal.com/paypalme/agenedia/) to support the further development of
New Tab Override. Thank you very much!**

## Description

New Tab Override allows you to choose which page Firefox shows whenever you open a new tab. It can open any website you
like, use your current homepage, display a stored local HTML file, or show a plain background color. It also includes
options for the focus behavior and the tab position.

### Features

- Set any website as your new tab page
- Randomly select one page from multiple URLs separated by the pipe character (`|`)
- Use your current homepage as the new tab page
- Store a local HTML file in the extension and use it as new tab content
- Use a custom background color for new tabs
- Show the latest Mozilla news as the new tab page (German only)
- Choose whether the focus should go to the address bar or the website
- Control where new tabs are opened
- Automatically add `https://` when a URL is missing a protocol
- Assign specific new tab URLs to tab groups or tab containers
- Support dark mode in the settings interface
- Support configuration via enterprise policies

### Keyboard shortcuts

The settings interface can be opened via the keyboard or from the menu. Use <kbd>Shift</kbd> + <kbd>F12</kbd> to open
it. You can also open it by entering `newtab settings` in the address bar or via the menu entry in the "Tools" menu.

### Languages

The add-on is currently available in the following languages:

- English
- German
- French (Thanks, SuperPat45 and Mozilla community!)
- Simplified Chinese (Thanks, tiansh and Mozilla community!)
- Spanish (Thanks, MissingUser and Mozilla community!)
- Italian (Thanks, Mozilla community!)
- Russian (Thanks, vanja-san!)
- Polish (Thanks, WaldiPL!)
- Dutch (Thanks, Tonnes!)
- Turkish (Thanks, boranroni!)
- Ukrainian (Thanks, Bergil32!)
- Brazilian Portuguese (Thanks, Mozilla community!)
- Swedish (Thanks, Sopor-!)
- Indonesian (Thanks, rosatiara!)
- Upper Sorbian (Thanks, milupo!)
- Lower Sorbian (Thanks, milupo!)

### Roadmap

You can view the roadmap and request new features in the
[issues tracker](https://github.com/cadeyrn/newtaboverride/issues).

### Configuration via Enterprise Policies

New Tab Override supports configuration via enterprise policies through `storage.managed`. Managed values override the
same settings configured locally in the extension.

Supported managed settings:

- `type`
- `url`
- `context_rules`
- `focus_website`
- `background_color`

Supported values for managed `type`:

- `custom_url`
- `homepage`
- `background_color`

The `context_rules` setting supports context-specific URLs for Firefox tab environments and named tab groups:

```json
{
  "containers": {
    "firefox-container-1": "https://example.com/work/"
  },
  "groups": {
    "Project Alpha": "https://example.com/project/"
  }
}
```

Context-specific rules are applied when `type` is set to `custom_url`. Tab group rules take precedence over tab
environment rules. Container rules use Firefox's `cookieStoreId` values as keys, while tab group rules use the tab
group name. The standard URL can be empty if at least one context-specific rule is configured.

The `local_file` option and the new tab position remain device-local settings.

Example `policies.json`:

```json
{
  "policies": {
    "3rdparty": {
      "Extensions": {
        "newtaboverride@agenedia.com": {
          "type": "custom_url",
          "url": "https://www.soeren-hentzschel.at",
          "context_rules": {
            "containers": {
              "firefox-container-1": "https://example.org/container/"
            },
            "groups": {
              "Example Group": "https://example.org/group/"
            }
          },
          "focus_website": true
        }
      }
    }
  }
}
```

This example forces New Tab Override to open `https://www.soeren-hentzschel.at` by default, use different URLs in the
configured tab environment and tab group, and place the focus on the website instead of the address bar.

### Permissions

New Tab Override requires several permissions to work properly. Some are mandatory, some are optional, and Firefox does
not prompt for some of them.

#### Mandatory Permissions

New Tab Override will not work as intended without the following permissions:

##### Access browser history

This permission is required to prevent spammy `moz-extension://` entries from being added to the browsing history every
time you open a new tab.

##### Access recently closed tabs

This permission is required so that New Tab Override can remove internally closed new tab pages from Firefox's recently
closed tabs list when the option to set the focus to the website is used.

##### Access browser tabs

This permission is required so that New Tab Override can focus the settings page if it is already open in another tab
instead of opening it again.

##### Read and modify browser settings

This permission is required to change the position of new tabs and to use the option that automatically opens the
current homepage as the new tab page.

#### Optional Permissions

This permission is not required to install and use New Tab Override, but the extension will request it at runtime when
needed:

##### Access data for www.soeren-hentzschel.at

This permission is only required if you enable the option to show the latest Mozilla news as the new tab page. If
enabled, New Tab Override reads the feed from www.soeren-hentzschel.at to display the latest news.

#### Silent Permissions

New Tab Override requires additional permissions, but Firefox does not prompt for the following:

##### cookies

The cookies permission is required to preserve container information when New Tab Override is used together with
Firefox container tabs.

##### contextual identities

The contextual identities permission is required to list the available Firefox containers when configuring
context-specific new tab pages.

##### menus

The menus permission is required to provide a menu entry in the "Tools" menu for accessing the settings page.

##### storage

The storage permission is required to save settings such as your selected new tab page and to read
enterprise-managed settings provided through Firefox policies.

##### tab groups

The tab groups permission is required to read the name of the tab group in which a new tab is opened. This allows New
Tab Override to apply the matching context-specific new tab page.

## Download

[Download New Tab Override](https://addons.mozilla.org/en-US/firefox/addon/new-tab-override/)

## Release Notes

[Release Notes](CHANGELOG.md "Release Notes")
