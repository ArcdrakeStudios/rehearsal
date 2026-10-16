# Rehearsal

Plan an event, see what a delay changes, and share a run sheet. Rehearsal helps organizers of workshops, demonstrations and small events build a running order with durations, people and dependencies.

**[Open Rehearsal](https://tools.arcdrake.com/rehearsal/)** · [Download source](https://github.com/ArcdrakeStudios/rehearsal/archive/refs/heads/main.zip) · [Arcdrake Tools](https://tools.arcdrake.com/) · [Report an issue](https://github.com/ArcdrakeStudios/rehearsal/issues)

## How to use it

1. Open the example or start an empty event.
2. Add steps, durations and the people needed. Select any steps that must finish first.
3. Try a delayed step or an unavailable person to see the revised schedule.
4. Download an HTML run sheet to share or print, or save an editable JSON backup.

<details>
<summary>View desktop screenshot</summary>

![Rehearsal with fictional example data](docs/screenshots/desktop.png)

</details>

[Mobile screenshot](docs/screenshots/mobile.png). Screenshots show the standalone application with fictional data.

## Privacy and limitations

Event editing and scheduling happen in your browser. There is no application backend or event upload. Saving is manual: **Save in this browser** keeps one event and its simulation in localStorage on the current origin. Clearing browser data removes that save. Download JSON to keep a portable backup; the HTML run sheet is for sharing and printing, not continued editing.

Independent steps may overlap. Shared people and dependencies constrain scheduling; a person marked unavailable is unavailable for the whole simulation. Physical print output has not been verified. Preview the exported run sheet before relying on a printed copy.

The interface and exported run sheets support English and German. Changing language preserves your event; names and notes you enter are not translated. The language preference is stored locally.

The hosted site receives ordinary page and asset requests. See its [privacy information](https://tools.arcdrake.com/privacy/) for hosting details.

## Run locally

Download and extract the source ZIP, or clone this repository. Open a terminal
in the resulting folder.

Install Node.js 24 or newer, then run from this repository:

```sh
npm start
```

Open http://127.0.0.1:43147/. Stop the preview with Ctrl+C. No package installation is needed to run the application. Serve it over HTTP(S), rather than opening `index.html` directly. The files in `dist/` are the application source; there is no compilation step.

## Development

Install the locked development tools and run the checks:

```sh
npm ci
npx playwright install chromium
npm test
npm run test:ci
npm run test:localization
npm run package:release
```

Browser checks manage their own local servers. Leave the preview port free before running them. The package command writes static files and a SHA-256 manifest to `artifacts/release/`; it does not publish or deploy.

Automated browser coverage uses Chromium, including narrow layouts. Safari, Firefox, physical devices and screen readers have not been verified for this app. Report compatibility problems with your browser version and a fictional example.

See [contributing](CONTRIBUTING.md), [language support](docs/LOCALIZATION.md) and [packaging and hosting](docs/RELEASING.md).

## License and support

An [Arcdrake](https://arcdrake.com/) product. Free to use, modify and redistribute under the [MIT license](LICENSE). See [third-party notices](THIRD_PARTY_NOTICES.md) for attribution.

Use the [issue tracker](https://github.com/ArcdrakeStudios/rehearsal/issues) for bugs and suggestions. Do not include private event details. Report security vulnerabilities through the [private reporting channel](SECURITY.md).

Feature requests are welcome in the issue tracker. To contribute an improvement,
see [the contribution guide](CONTRIBUTING.md).
