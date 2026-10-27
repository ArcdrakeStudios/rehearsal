import {mountMeasurementFeedback} from './measurement-feedback-client.mjs';
import {getLanguage} from './language.js';

// Keep one form/client alive across language changes, including in-flight sends.
// language.js translates shared notices in place, never textarea values.
const container = document.getElementById('measurement-feedback');
const ui = mountMeasurementFeedback(container, {product:'rehearsal', language:'en'});
export const measurement = ui.client;
function updateLinks() {
 const prefix = getLanguage() === 'de' ? '/de' : '';
 const links = container.querySelectorAll('a');
 links[0].href = `https://tools.arcdrake.com${prefix}/privacy/`;
 links[1].href = `https://arcdrake.com${prefix}/contact/`;
 ui.refreshChoice();
}
updateLinks();
window.addEventListener('arcdrake-language-change', updateLinks);
window.addEventListener('storage', ui.refreshChoice);
void measurement.track('page_view');

// Announce the locale selected before this native consent dialog mounted.
window.dispatchEvent(new CustomEvent('arcdrake-language-change', {detail:{language:getLanguage()}}));
