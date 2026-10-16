# Packaging and hosting

[Rehearsal](https://tools.arcdrake.com/rehearsal/) is part of [Arcdrake Tools](https://tools.arcdrake.com/). This repository contains its standalone source. Its workflows check changes and prepare downloadable artifacts; they do not deploy the hosted service.

## Build a static package

Follow the development checks in the [README](../README.md), then run:

```sh
npm run package:release
```

The command creates `artifacts/release/` with a `manifest.json` containing per-file SHA-256 hashes.

The application files are `index.html`, `style.css`, `app.js`, `schedule.js` and `language.js`. The package also includes `LICENSE` and `THIRD_PARTY_NOTICES.md`; retain these when redistributing it. Packaging does not download dependencies, upload files or configure hosting.

The **Prepare release artifact** GitHub Actions workflow runs on `main` when dispatched by a maintainer. It repeats the checks and uploads an artifact named with the source commit. GitHub keeps these workflow artifacts for 30 days; they are not permanent release downloads.

## Host your own copy

Serve the package's application files over HTTPS from a static host, preserving relative asset paths. A directory mount must serve its trailing-slash index. Serve the packaged files, not the repository root or development tools.

The standalone app does not include a Content Security Policy. Configure and test one at your host, together with other appropriate security headers, including `X-Content-Type-Options: nosniff` and `Referrer-Policy: no-referrer`. Verify asset loading, scheduling, saving and HTML export on your chosen origin.

Browser saves belong to the current origin. Moving to another host does not transfer an existing save; export JSON from the old location and import it at the new one. Hosting receives ordinary page and asset requests, so describe your host's data processing accurately.

Retain the previous package and manifest if you need to restore an earlier version. Verify the files against the manifest before serving them.
