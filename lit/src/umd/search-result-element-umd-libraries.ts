import { html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { BaseSearchElement } from '../BaseSearchElement';

/**
 * A default result render element that shows the raw JSON for each result in a collapsible details element.
 */
@customElement('search-result-element-umd-libraries')
export class SearchResultElementUMDLibraries extends BaseSearchElement {
  /**
   * The settings for this element type.
   * This
   */
  @property({type: Object})
  settings: {
    field?: string;
    [key: string]: any;
  } = {};

  /**
   * The result data.
   */
  @property({ attribute: true, type: Object })
  data: Record<string, any> = {};

  override render() {
    type result_fields = keyof typeof this.data;

    const id_field = this.settings['id'] as result_fields;
    const title_field = this.settings['title'] as result_fields;
    const thumbnail_field = this.settings['thumbnail'] as result_fields;
    const list_fields: string = this.settings['fields'];
    const base_path: string = this.settings['base_path'];

    let id = this.data[id_field];
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
      <h2>
        <a href="${base_path + id}">
          ${title}
        </a>
      </h2>

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
