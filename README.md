# scp-ng-packages

AngularJS module (`scp.packages`) that loads the front-end code of installed
[SynergyCP](https://synergycp.com) add-on packages at runtime.

SynergyCP is a bare metal server management control panel. Its functionality
can be extended with add-on packages (reverse DNS, switch drivers, and so on),
and each package may ship its own pages for the admin and client panels. Those
panels are AngularJS 1.x single-page apps that are built ahead of time, so they
cannot know at build time which packages a given installation has enabled. This
module closes that gap: when the app starts, it asks the SynergyCP API which
packages are enabled, then lazy-loads their JavaScript and CSS before routing
continues.

## How it works

1. The host application tells the module which API endpoint lists the package
   assets for that panel.
2. On the first route resolution, `PackageLoader.load()` fetches that endpoint,
   which lists the asset files of each enabled package.
3. Those files are loaded with
   [ocLazyLoad](https://github.com/ocombe/ocLazyLoad). The request is made once
   and the promise is reused for the lifetime of the page.
4. The loaded package code registers its own UI Router states underneath the
   abstract `app.pkg` state (URL prefix `/pkg`) that this module defines.

Loading is hooked into two places so that package code is always present before
it is needed:

- **Routing** – registered as a
  [`$futureStateProvider`](https://christopherthielen.github.io/ui-router-extras/#/future)
  resolve, so deep links to a package page work on a cold page load.
- **Single sign-on links** – registered as an `SsoUrlProvider` resolve (from
  `scp-ng-core`), so SSO URL handlers contributed by packages exist before an
  SSO link is resolved.

A failure to load packages is logged to the console and swallowed on purpose. A
broken or unreachable package file must not prevent the rest of the control
panel from loading.

## What it provides

| Name | Type | Purpose |
| --- | --- | --- |
| `scp.packages` | module | Depends on `scp.core.auth`, `scp.router` and `ct.ui.router.extras.future`. |
| `PackagesLoaderProvider` | provider | `setApiBase(path)` / `getApiBase()`. Configures the API endpoint to list package assets from. The `PackagesLoader` service throws if no base was set. |
| `PackageLoader` | service | `load()` returns a cached promise that resolves once every enabled package's files have been loaded. |
| `app.pkg` | UI Router state | Abstract parent state (`/pkg`) for all package states. |

## Usage

The module is not published to npm. It is consumed as a sibling checkout and
its prebuilt `dist.min.js` is included in the host application's vendor bundle:

```json
{
  "dependencies": {
    "scp-ng-packages": "file:../scp-ng-packages"
  }
}
```

Add the module as a dependency and configure the endpoint during the config
phase:

```js
angular
  .module('app.core', ['scp.packages'])
  .config(function (PackagesLoaderProvider) {
    PackagesLoaderProvider.setApiBase('<package asset endpoint>');
  });
```

Package code loaded this way typically registers its states through the
`scp-ng-router` helper, which places them under `app.pkg.<name>`:

```js
var pkg = RouteHelpersProvider.package('example');
pkg.state('', {}).state('list', { url: '/list', /* ... */ });
```

### Runtime requirements

The module expects these to be present on the page; it does not bundle them:

- AngularJS 1.x and UI Router, with
  [ui-router-extras](https://github.com/christopherthielen/ui-router-extras)
  (future states)
- [ocLazyLoad](https://github.com/ocombe/ocLazyLoad)
- Lodash, as the global `_`
- [`scp-ng-core`](https://github.com/synergycp/scp-ng-core) (`Api`,
  `SsoUrlProvider`) and
  [`scp-ng-router`](https://github.com/synergycp/scp-ng-router)
  (`RouteHelpersProvider`)

## Development

```bash
npm install
npx gulp
```

`gulp` validates, concatenates, annotates (`ng-annotate`) and minifies
everything in `src/` into `dist.min.js` at the repository root. `dist.min.js`
is committed, because consumers reference it directly, so rebuild and commit it
together with any change to `src/`.

The build toolchain is Gulp 4 with fairly old plugins; if it fails on a current
Node.js release, try an older LTS version.

`bin/compile-up` runs the build and then rebuilds the theme that consumes this
module. It only works inside a full SynergyCP development checkout where the
sibling repositories are present.

There is no automated test suite.

## License and support

Copyright SynergyCP. This repository is published for reference and for use
with SynergyCP; it is marked `UNLICENSED` in `package.json` and no open-source
license is granted.

For product documentation and support, see the
[SynergyCP knowledge base](https://kb.synergycp.com).
