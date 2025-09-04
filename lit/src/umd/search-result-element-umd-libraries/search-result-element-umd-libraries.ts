import { html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { BaseSearchElement } from '../../BaseSearchElement';

interface Field {
  key: string;
  show_label?: string;
}

/**
 * A default result render element that shows the raw JSON for each result in a collapsible details element.
 */
@customElement('search-result-element-umd-libraries')
export class SearchResultElementUMDLibraries extends BaseSearchElement {

  /**
   * The settings for this element type.
   * This
   */
  @property({ type: Object })
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

    const id_field = this.settings['id'] as string;
    const title_field = this.settings['title'] as string;
    const thumbnail_field = this.settings['thumbnail'] as string;
    const fields: Record<string, Field> = this.settings['fields'];
    const base_path: string = this.settings['base_path'];

    const query_string = this?.context?.query?.get('q');
    let id = this.data[id_field].replace("solr_document/");
    id = query_string ? id + "?q=" + query_string : id;

    let title = this.data[title_field];
    let thumbnail = this.data[thumbnail_field]

    const field_list = Object.entries(fields).map(([label, field]) => {
      if (field.show_label && field.show_label == "true") {
        return html`<li> <strong> ${label}:</strong> ${this.data[field.key]} </li>`
      } else {
        return html`<li> ${this.data[field.key]} </li>`
      }
    });

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

      ${thumbnail === 'static:unavailable' ? nothing : html`<img src="${thumbnail}" />`}

      ${html`<ul> ${field_list} </ul>`}
      <hr />
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'search-result-element-umd-libraries': SearchResultElementUMDLibraries;
  }
}
