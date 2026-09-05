# Enosx Browser

A private, focused, offline-ready browser shell with Enosx AI.

## What is implemented

Enosx Browser now includes a Chrome/Brave-style browser shell with tabs, address/search navigation, back and forward controls, reload, bookmarks, reading list, history, workspaces, private mode, privacy status, install prompts, and an Enosx AI panel.

Enosx AI includes explicit context permissions and selectable processing modes: Local AI, Hybrid AI, Private Cloud AI, and No AI. The current UI is a privacy-safe foundation; connecting a production model service can be added without changing the browser experience.

The browser is offline-first. The app registers a service worker, caches the application shell, displays online/offline status, and stores bookmarks, reading-list items, history, and preferences in local browser storage. The installed desktop app loads the compiled static build without requiring an internet connection.

## Install like a desktop browser

### Linux installer artifacts

The repository includes an Electron Builder configuration. A Linux build produces:

- `release/Enosx-Browser-0.1.0-linux-x86_64.AppImage` — portable installer-free application. Make it executable with `chmod +x` and launch it directly.
- `release/Enosx-Browser-0.1.0-linux-amd64.deb` — Debian/Ubuntu installer. Install with `sudo apt install ./release/Enosx-Browser-0.1.0-linux-amd64.deb`.

These files are generated locally and are intentionally excluded from Git so that release artifacts can be uploaded separately or attached to a GitHub Release.

### Windows and macOS installers

Build the installers on the target operating system:

```bash
pnpm installer:windows   # NSIS .exe installer
pnpm installer:mac       # .dmg installer
```

Electron Builder packages the same static offline build into a native desktop application. Cross-platform builds may require platform-specific signing and packaging dependencies.

### Browser installation from Chrome or Brave

The web build is also installable as a Progressive Web App. Start or deploy the production web build, open it in Chrome or Brave, then choose **Install Enosx Browser** from the address-bar install control or the browser menu. The PWA uses `public/manifest.webmanifest` and `public/sw.js` for installation and offline app-shell caching.

## Development

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000` in a browser. The desktop development shell can be started with:

```bash
pnpm electron:dev
```

## Production builds

```bash
pnpm build:web
pnpm electron:build
```

`pnpm build:web` creates the static `out/` directory. `pnpm electron:build` packages it as a desktop application using the configuration in `package.json` and `electron/`.

## Offline behavior

The first web visit must be online so the browser can download the app shell. After that, the interface, local navigation shell, saved bookmarks, reading list, history, privacy controls, and Local AI demo interactions remain available offline. External websites, remote search, cloud AI, and external synchronization still require a network connection.

## Security notes

The Electron shell uses context isolation, disables Node integration in the renderer, enables sandboxing, and restricts external window requests to the system browser. The current Enosx AI controls make context permissions visible but do not connect to a production AI model yet.
