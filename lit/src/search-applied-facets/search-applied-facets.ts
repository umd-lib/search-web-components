import {html, TemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {BaseSearchElement} from '../BaseSearchElement';
import {repeat} from 'lit/directives/repeat.js';
import {FacetValue} from '../types';

/**
 * An element that shows the applied facets and allows for one or all of them to be removed.
 */
@customElement('search-applied-facets')
export class SearchAppliedFacets extends BaseSearchElement {
  /**
   * The label to use for individual facet buttons. `@value` can be used as a token that will be replaced with each facet's value.
   */
  @property()
  removeText = 'Remove @value';

  /**
   * The label to use for the reset/clear all button. `@count` can be used as a token that will be replaced with the number of applied facets.
   */
  @property()
  resetText = 'Reset (@count)';

  /**
   * Show the facet reset button.
   */
  @property({type: Boolean})
  showReset = false;

  /**
   * Show individual facet remove buttons.
   */
  @property({type: Boolean})
  showIndividual = false;

  /**
   * Get all the applied facets from the current context's query.
   */
  _getApplied(): FacetValue[] {
    //@TODO this should double check the applied with the response
    const applied: FacetValue[] = [];
    const query = this?.context?.query;

    if (!query) {
      return applied;
    }

    if (this.context?.response) {
      this.context.response.facets.forEach((f) => {
        const values: Array<string> = query.getAll(
          `f[${f.settings.url_alias}]`
        );
        values.forEach((value) => {
          applied.push({
            key: f.settings.url_alias,
            facetKey: f.settings.url_alias,
            value: value,
          });
        });
      });
    }

    return applied;
  }

  /**
   * Get the reset button element.
   */
  _getResetElement(): TemplateResult {
    return html`
      <li class="applied reset">
        <button class="applied-button-reset" @click=${() => this.clearFacets()}>
          ${this.resetText.replaceAll('@count', '' + this._getApplied().length)}
        </button>
      </li>
    `;
  }

  /**
   * Get the individual facet buttons.
   *
   * @param applied An array of applied facets.
   */
  _getIndividualFacets(applied: FacetValue[]): TemplateResult {
    return html`
      ${repeat(
        applied,
        (item) => `${item.key}:${item.value}`,
        (item) => {
          const text = this.removeText.replace('@value', item.value);
          return html`
            <li class="applied facet">
              <div @click=${() => this.applyFacet(item.facetKey, item.value)}>
                ${item.value}
              </div>
              <button
                @click=${() => this.applyFacet(item.facetKey, item.value)}
                class="applied-button-remove"
              >
                ${text}
              </button>
            </li>
          `;
        }
      )}
    `;
  }

  override render() {
    if (!this.context?.response) {
      return null;
    }

    const applied = this._getApplied();

    if (applied.length === 0) {
      return null;
    }

    return html`
      <ul class="applied-facets">
        ${this.showIndividual ? this._getIndividualFacets(applied) : null}
        ${this.showReset ? this._getResetElement() : null}
      </ul>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'search-applied-facets': SearchAppliedFacets;
  }
}
