import { html, nothing } from 'lit';
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

    const title_field = element.getAttribute('titlefield') as result_fields;
    const thumbnail_field = element.getAttribute('thumbnailfield') as result_fields;
    const list_fields = element.getAttribute('listfields');

    if (title_field === null || title_field === '') {
      return html`<div> Title not configured </div>`;
    }
    if (thumbnail_field === null || thumbnail_field === '') {
      return html`<div> Thumbnail not configured </div>`;
    }
    if (list_fields === null || list_fields === '') {
      return html`<div> List Fields not configured </div>`;
    }

    let title = this.data[title_field];
    let thumbnail = this.data[thumbnail_field]
    const fields = list_fields.split(',').map(field => field as result_fields);

    if (Array.isArray(title)) {
      title = title.map((t: string) => t.startsWith('[@') ? t.split(']')[1] : t);
      title = title.join(' | ');
    }

    if (Array.isArray(thumbnail)) {
      thumbnail = thumbnail[0];
    }

    return html`
      <h2> ${title} </h2>
      ${ thumbnail === 'static:unavailable' ? nothing : html`<img src="${thumbnail}" />` }
      <ul>
        ${fields.map(field =>
          field === 'id' ? html`<li hidden> ${this.data[field]} </li>` : html`<li> ${this.data[field]} </li>`
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
