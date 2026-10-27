# English and German interface

The bundled `dist/language.js` supplies translations for interface text, help, errors and accessibility labels without network requests or runtime dependencies. Exported HTML run sheets also use the selected language. User-authored names and notes remain unchanged.

Language selection follows this order:

1. A valid `?lang=de` or `?lang=en` URL parameter.
2. The saved `arcdrake-tools-language` preference.
3. German when the browser's language is German; English otherwise.

An explicit URL choice still works when browser storage is unavailable. Only the language preference is persisted by this module.

English/Deutsch controls change the language without reloading or clearing entered data. The app dispatches and listens for `arcdrake-language-change` on `window`, with `detail.language` set to `en` or `de`. A script running in the same page, such as site navigation, can use this event to coordinate language changes. The event does not cross iframe boundaries.

The Tools host wrapper recognizes both visible, enabled `.language-switch button[data-app-language="en"]` and `[data-app-language="de"]` controls and hides only its duplicate `.arcdrake-collection-languages` group. It retains collection/privacy/legal links and a fallback selector when app controls are missing. Load the reviewed wrapper before `DOMContentLoaded` so it can recheck after app module initialization. Keep the app selector for standalone copies. Neither layer navigates away or reloads on a language change.

The introductory demo is regenerated from the selected language, retaining its delay toggle. The editable event and stored save are untouched. Feedback notices translate in place from the shared EN/DE copy; the same form, message, optional email, category and pending send survive a switch. Existing Tools privacy and Arcdrake contact links follow the selected language.

## Adding translations

The translator retains English source text per node and translates exact strings or bounded message templates. It does not replace arbitrary words inside user text. Add both the English source and German translation for new interface copy, keep user-supplied values outside translated text, and extend the localization tests.

Run `npm run test:localization` after installing the development tools described in the [README](../README.md). The checks cover language selection, translated results, preservation of entered data, unavailable storage and narrow layouts.
