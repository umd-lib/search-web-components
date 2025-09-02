import { html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { BaseSearchElement } from '../BaseSearchElement';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';

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
    const fields = this.settings['fields'];
    const base_path: string = this.settings['base_path'];

    let id = this.data[id_field];
    let title = this.data[title_field];
    let thumbnail = this.data[thumbnail_field]
    let field_output = ''

    if (Array.isArray(title)) {
      title = title.map((t: string) => t.startsWith('[@') ? t.split(']')[1] : t);
      title = title.join(' | ');
    }

    if (Array.isArray(thumbnail)) {
      thumbnail = thumbnail[0];
    }

    for(var key in fields) {
      if (fields.hasOwnProperty(key)) {
        let displayed_field = fields[key].key
        let show_label = fields[key].show_label
        if (this.data[displayed_field]) {
          if (show_label && show_label == "true") {
            field_output += '<li><strong>' + key + ':</strong> ' + this.data[displayed_field] + '</li>'
          } else {
            field_output += '<li>' + this.data[displayed_field] + '</li>'
          }
        }
      }
    }

    let revised_id = id.replace("solr_document/")

    let query_string = this?.context?.query?.get('q')

    if (query_string) {
      revised_id += "?q=" + query_string
    }

    return html`
      <h2>
        <a href="${base_path + revised_id}">
          ${title}
        </a>
      </h2>

      ${ thumbnail === 'static:unavailable' ? nothing : html`<img src="${thumbnail}" />` }

      ${ html`<ul> ${unsafeHTML(field_output)} </ul>` }
      <hr />
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'search-result-element-umd-libraries': SearchResultElementUMDLibraries;
  }
}
