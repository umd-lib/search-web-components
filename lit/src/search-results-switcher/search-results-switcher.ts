import {customElement, property, state} from 'lit/decorators.js';
import {BaseSearchElement} from '../BaseSearchElement';
import {html} from 'lit/static-html.js';
import {repeat} from 'lit/directives/repeat.js';
import {TemplateResult} from 'lit';
import {SearchContext, SimpleValue} from '../types';

/**
 * Switch how the results render.
 */
@customElement('search-results-switcher')
export class SearchResultsSwitcher extends BaseSearchElement {
  /**
   * An array of objects containing a key and label for each available display I.e. [{"key":"list","label":"List"},{"key":"grid","label":"Grid"}].
   */
  @property({type: Object})
  options: SimpleValue[] = [];

  @state()
  indexConfigLoaded = false;

  override updated(_changedProperties: Map<string, any>) {
    if (this.indexConfigLoaded || !this.context?.responseReady) {
      return;
    }

    this.indexConfigLoaded = true;
    if (this.options.length === 0 && this.context.response?.swc_displays) {
      this.options = this.context.response?.swc_displays;
    }
  }

  _getOptionElement(option: SimpleValue): string | TemplateResult {
    return html`<li>
      <button
        name="${option.key}"
        class="${option.key} ${option.key === this.context?.resultDisplay
          ? 'selected'
          : ''}"
        aria-pressed="${option.key === this.context?.resultDisplay}"
        @click="${() => {
          const c = {...this.context};
          c.resultDisplay = '' + option.key;
          this.updateContext(c as SearchContext);
        }}"
      >
        ${option.label}
      </button>
    </li>`;
  }

  _getAllOptions(): string | TemplateResult {
    return html` <ul>
      ${repeat(
        this.options,
        (option) => option.key,
        (option) => {
          return html`${this._getOptionElement(option)}`;
        }
      )}
    </ul>`;
  }

  override render() {
    return html`${this._getAllOptions()} `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'search-results-switcher': SearchResultsSwitcher;
  }
}
