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

  is_standalone = false;
  standalone_icon = '';

  /**
   * Ensure the focusElement is focused when the dropdown is opened.
   */
  override updated(_changedProperties: Map<string, any>) {
    if (this.configLoaded && this.context?.responseReady) {
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
          if (mapping.settings['is_standalone']) {
            let standalone_str = mapping.settings['is_standalone'];
            if (standalone_str == 'true') {
              this.is_standalone = true;
            }
          }
          if (mapping.settings['standalone_icon']) {
            let icon = mapping.settings['standalone_icon'];
            if (icon != undefined && icon != '') {
              this.standalone_icon = icon;
            }
          }
        });
      });

      this.configLoaded = true;
    }

    // always re-run Lucide icons after DOM update
    requestAnimationFrame(() => {
      if (typeof (window as any).lucide !== 'undefined') {
        (window as any).lucide.createIcons();
      }
    });
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

    if (this.is_standalone) {
      const total = this.context?.response?.search_results_count ?? 0;
      return this._getStandaloneResults(results, total);
    }

    // No results
    if (results.length === 0) {
      return html`
        <div
          class="no-results s-box-medium-v s-box-medium-h c-bg-secondary s-margin-general-large"
        >
          <div class="title s-margin-general-medium">
            <h2 class="t-title-medium s-stack-small">No records found</h2>
            <p>There are no results matching your search term.</p>
          </div>
          <div class="refine-search wysiwyg-editor">
            <h3 class="t-title-small">Suggestions</h3>
            <ul>
              <li>Check your spelling</li>
              <li>Try more general keywords.</li>
              <li>Try different keywords that mean the same thing</li>
            </ul>
          </div>
        </div>
      `;
    }
    return html`
      <div>
        <ul class="${this.context?.resultDisplay}" test="true">
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
                class="search-result result-${this.safeIdentifier(
                  result[this.resultField] ?? 'default'
                )} s-margin-general-medium"
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

  /**
   * For bento-like results, currently used in the combined search page in digital collections
   */
  _getStandaloneResults(
    results: SearchResultType[],
    total: number
  ): TemplateResult | null {
    let current_query = undefined;
    if (
      this.context?.query &&
      this.context?.query.has('q') &&
      this.context?.query.get('q')?.trim != undefined
    ) {
      let curr = this.context?.query.get('q') ?? '';
      console.log(curr);
      if (curr != undefined) {
        current_query = curr;
      }
    }
    // No results
    if (results.length === 0 || current_query == undefined) {
      return html`
        <div>
          <section
            class="bento-search c-border-tertiary s-margin-general-medium"
          >
            <div
              class="bento-search-header dark-theme c-content-primary c-bg-primary s-box-small-v s-box-small-h"
            >
              <div
                class="bento-search-header-icon-container"
                aria-hidden="true"
              >
                <i
                  id="${this.standalone_icon}-standalone-icon"
                  data-lucide="${this.standalone_icon}"
                  class="bento-search-header-icon"
                ></i>
              </div>
              <h2 class="t-title-medium">
                <a id="primary-search" href="/search"
                  >Image & Text Repository</a
                >
              </h2>
            </div>
            <p
              class="description t-label c-content-secondary c-bg-tertiary s-box-small-h"
            >
              Results from our Image and Text Repository
            </p>
            <div class="bento-search-no-results s-box-small-v s-box-small-h">
              <p class="t-body-medium">No records found</p>
            </div>
            <div class="bento-search-footer">
              <div class="s-box-small-v s-box-small-h">
                <div class="umd-lib emphasized-link">
                  <a
                    href="/search"
                    class="emphasized-link--text t-body-small t-interactive-sub c-content-primary c-underline-primary ani-underline"
                  >
                    <span class="i-chevron"></span>Try a different search
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      `;
    }
    return html`
      <div>
        <section class="bento-search c-border-tertiary s-margin-general-medium">
          <div
            class="bento-search-header dark-theme c-content-primary c-bg-primary s-box-small-v s-box-small-h"
          >
            <div class="bento-search-header-icon-container" aria-hidden="true">
              <i
                data-lucide="${this.standalone_icon}"
                class="bento-search-header-icon"
              ></i>
            </div>
            <h2 class="t-title-medium">
              <a id="primary-search" href="/search?q=${current_query}"
                >Image and Text Search</a
              >
            </h2>
          </div>
          <p
            class="description t-label c-content-secondary c-bg-tertiary s-box-small-h"
          >
            Results from our Image and Text Repository
          </p>
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

                return html` <li
                  class="bento-search-result-item s-box-small-v s-box-small-h
                           result-${this.safeIdentifier(
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
          <div class="bento-search-footer">
            <div class="s-box-small-v s-box-small-h">
              <div class="umd-lib emphasized-link">
                <a
                  href="/search?q=${current_query}"
                  class="emphasized-link--text t-body-small t-interactive-sub c-content-primary c-underline-primary ani-underline"
                >
                  <span class="i-chevron"></span>See all ${total} results
                </a>
              </div>
            </div>
          </div>
        </section>
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
