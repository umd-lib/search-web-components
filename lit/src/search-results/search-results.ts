import {customElement, property, state} from 'lit/decorators.js';
import {BaseSearchElement} from '../BaseSearchElement';
import {html, unsafeStatic} from 'lit/static-html.js';
import {repeat} from 'lit/directives/repeat.js';
import {TemplateResult} from 'lit';
import {SearchResultMappingType, SearchResultType} from '../types';

interface ProcessedMappings {
  [key: string]: ProcessedMapping;
}

interface ProcessedMapping {
  element: string;
  settings: {
    [key: string]: any;
  };
}

/**
 * A container for the search results. Handles rendering each result in its correct element.
 */
@customElement('search-results')
export class SearchResults extends BaseSearchElement {
  /**
   * The field from the index to use to map a result to an element.
   */
  @property()
  resultField = '';

  /**
   * An array of objects that contain the element, keys, and settings for results. I.e. [{"element":"search-result-element-rendered","keys":["article","page"],"settings":{"key":"rendered_result"}}]. 'default' can be used as a fallback for unmapped results. When using the display switcher keys can be appended with the display id i.e `-grid` to make mapping specific to a display type.
   */
  @property({type: Object})
  mappings: SearchResultMappingType[] = [];

  @state()
  configLoaded = false;

  @state()
  processedMappings: ProcessedMappings = {};

  /**
   * Ensure the focusElement is focused when the dropdown is opened.
   */
  override updated(_changedProperties: Map<string, any>) {
    if (this.configLoaded || !this.context?.responseReady) {
      return;
    }

    if (!this.resultField) {
      this.resultField = this.context.response?.swc_results.field ?? '';
    }

    if (this.mappings.length === 0) {
      this.mappings = this.context.response?.swc_results.mappings ?? [];
    }

    this.mappings.forEach((mapping) => {
      mapping.keys.forEach((key) => {
        this.processedMappings[key] = {
          element: mapping.element,
          settings: mapping.settings,
        };
      });
    });

    this.configLoaded = true;
  }

  /**
   * Get the element type and settings for the given result.
   */
  _mapResult(result: SearchResultType): ProcessedMapping | undefined {
    if (
      this.processedMappings[
        `${result[this.resultField]}-${this.context?.resultDisplay}`
      ]
    ) {
      return this.processedMappings[
        `${result[this.resultField]}-${this.context?.resultDisplay}`
      ];
    }

    if (this.processedMappings[`default-${this.context?.resultDisplay}`]) {
      return this.processedMappings[`default-${this.context?.resultDisplay}`];
    }

    if (this.processedMappings[result[this.resultField]]) {
      return this.processedMappings[result[this.resultField]];
    }

    if (this.processedMappings['default']) {
      return this.processedMappings['default'];
    }

    console.warn('No element mapping found for: ', result);
    return undefined;
  }

  /**
   * Get the result elements correctly mapped to the right element type.
   */
  _getResults(): TemplateResult | null {
    const results = this.context?.response?.search_results ?? [];

    if (results.length === 0) {
      return null;
    }

    return html`
      <div>
        <ul class="${this.context?.resultDisplay}">
          ${repeat(
            results,
            (result) => result.id,
            (result) => {
              const resultMap = this._mapResult(result);

              if (!resultMap) {
                return null;
              }

              if (!customElements.get(resultMap.element)) {
                console.warn(
                  resultMap.element +
                    ' is not defined as a custom element for element mapping:',
                  result
                );
                return null;
              }

              return html`<li
                class="result-${this.safeIdentifier(
                  result[this.resultField] ?? 'default'
                )}"
              >
                <${unsafeStatic(resultMap.element)}
                  .data=${result}
                  .settings=${resultMap.settings}
                />
              </li>`;
            }
          )}
        </ul>
      </div>
    `;
  }

  override render() {
    if (!this.configLoaded) {
      return null;
    }

    return html`${this._getResults()} `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'search-results': SearchResults;
  }
}
