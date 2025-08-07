import {html} from 'lit';
import {property, customElement} from 'lit/decorators.js';
import {BaseSearchElement} from '../BaseSearchElement';

/**
 * A default result render element that shows the raw JSON for each result in a collapsible details element.
 */
@customElement('search-result-element-default')
export class SearchResultElementDefault extends BaseSearchElement {
  /**
   * The result data.
   */
  @property({attribute: true, type: Object})
  data: object = {};

  override render() {
    return html`
      <details open style="overflow-x: scroll">
        <summary>Item</summary>
        <pre>${JSON.stringify(this.data, null, 2)}</pre>
      </details>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'search-result-element-default': SearchResultElementDefault;
  }
}
