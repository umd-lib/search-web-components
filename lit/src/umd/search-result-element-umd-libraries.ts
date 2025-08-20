import { html } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { BaseSearchElement } from '../BaseSearchElement';

/**
 * A default result render element that shows the raw JSON for each result in a collapsible details element.
 */
@customElement('search-result-element-umd-libraries')
export class SearchResultElementUMDLibraries extends BaseSearchElement {
  /**
   * The result data.
   */
  @property({ attribute: true, type: Object })
  data: Record<string, any> = {};

  override render() {
    type result_fields = keyof typeof this.data;

    const element = document.querySelector('search-results');

    if (element === null) {
      return html`<div>No Search Results Element Found</div>`;
    }

    const title = element.getAttribute('titlefield') as result_fields;
    const thumbnail = element.getAttribute('thumbnailfield') as result_fields;
    const lists = element.getAttribute('listfields');

    if (title === null || title === '') {
      return html`<div> Title not configured </div>`;
    }
    if (thumbnail === null || thumbnail === '') {
      return html`<div> Thumbnail not configured </div>`;
    }
    if (lists === null || lists === '') {
      return html`<div> List Fields not configured </div>`;
    }

    const fields = lists.split(',').map(field => field as result_fields);

    return html`
      <h2> ${this.data[title]} </h2>
      <img src="${this.data[thumbnail][0]}" />
      <ul>
        ${fields.map(field =>
          field === 'id' ? html`<li hidden> ${this.data[field]} </li>`: html`<li> ${this.data[field]} </li>`
        )}
      </ul>
      <hr />
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'search-result-element-umd-libraries': SearchResultElementUMDLibraries;
  }
}
