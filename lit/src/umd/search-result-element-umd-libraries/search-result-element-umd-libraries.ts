import {html, nothing} from 'lit';
import {property, customElement} from 'lit/decorators.js';
import {BaseSearchElement} from '../../BaseSearchElement';

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
  @property({type: Object})
  settings: {
    field?: string;
    [key: string]: any;
  } = {};

  /**
   * The result data.
   */
  @property({attribute: true, type: Object})
  data: Record<string, any> = {};

  override render() {
    const id_field = this.settings['id'] as string;
    const title_field = this.settings['title'] as string;
    const thumbnail_field = this.settings['thumbnail'] as string;
    const fields: Record<string, Field> = this.settings['fields'];
    const base_path: string = this.settings['base_path'];
    const query_string = this?.context?.query?.get('q');

    let id = undefined;
    if (id_field in this.data) {
      id = this.data[id_field].trim();
      if (this.data[id_field].includes('solr_document')) {
        id = this.data[id_field].replace('solr_document/', '');
      }
      id = query_string ? id + '?q=' + query_string : id;
    }

    let title = this.data[title_field];
    let thumbnail = this.data[thumbnail_field];

    const field_list = Object.entries(fields).map(([label, field], idx) => {
      const value = this.data[field.key];
      if (
        value === undefined ||
        value === null ||
        value === '' ||
        (Array.isArray(value) && value.length === 0)
      ) {
        return nothing;
      }

      let extraClass = '';
      let srOnlyText = '';
      if (idx === 0) {
        extraClass = 'type';
        srOnlyText = 'Item type:';
      } else if (idx === 1) {
        extraClass = 'collection';
        srOnlyText = 'Collection:';
      } else if (idx === 2) {
        extraClass = 'date';
        srOnlyText = 'Date:';
      }

      const ddClass = `t-label${extraClass ? ' ' + extraClass : ''}`;

      if (field.show_label && field.show_label == 'true') {
        return html`<div class="">
          <dt>${label}:</dt>
          <dd class="${ddClass}">${value}</dd>
        </div>`;
      } else {
        return html`<dd class="${ddClass}">
          <span></span>
          <span class="sr-only">${srOnlyText}</span>
          ${value}
        </dd>`;
      }
    });

    if (Array.isArray(title)) {
      title = title.map((t: string) =>
        t.startsWith('[@') ? t.split(']')[1] : t
      );
      title = title.join(' | ');
    }

    if (Array.isArray(thumbnail)) {
      thumbnail = thumbnail[0];
    }

    // Get the first field's key for alt text
    const firstFieldKey = Object.values(fields)[0]?.key;
    const altText = firstFieldKey ? this.data[firstFieldKey] : '';

    return html`
      <section>
        <div class="item-detail">
          <h2 class="item-title t-title-small s-stack-small">
            <a href="${base_path + id}"
              ><span class="sr-only">Title:</span>${title}
            </a>
          </h2>
          ${html`<dl class="item-fields">${field_list}</dl>`}
        </div>
        ${thumbnail === 'static:unavailable'
          ? nothing
          : html`<img
              src="${thumbnail}"
              alt="${altText}"
              class="s-inline-small"
              onerror="
              this.onerror=null;
              this.src='/assets/placeholder-image.svg';
              this.classList.add('image-error', 't-label', 't-italic');
              this.alt='.   ${altText} - image not found';"
            />`}
      </section>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'search-result-element-umd-libraries': SearchResultElementUMDLibraries;
  }
}
