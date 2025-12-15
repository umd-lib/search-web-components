import {nothing, html} from 'lit';
import {property, customElement} from 'lit/decorators.js';
import {BaseSearchElement} from '../../BaseSearchElement';

import {unsafeHTML} from 'lit/directives/unsafe-html.js';
// Needed for markup in external databases.
import {repeat} from 'lit/directives/repeat.js';

interface Field {
  key: string;
  show_label?: string;
  facet_link_pattern?: string;
  is_boolean?: string;
  boolean_true?: string;
  boolean_false?: string;
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

    let title = this.data[title_field];
    let thumbnail = this.data[thumbnail_field];
    let id = undefined;

    let has_value = true;
    const field_entries = Object.entries(fields)
      .map(([label, field], idx) => {
        let value = this.data[field.key];
        let is_bool = field.is_boolean == 'true' ? true : false;
        if (
          value === undefined ||
          value === null ||
          value === '' ||
          (Array.isArray(value) && value.length === 0)
        ) {
          if (!is_bool) {
            return null;
          }
          has_value = false;
        }

        // Prefer the entry key or an explicit field.label; otherwise use fallbacks for first three fields.
        const rawLabel =
          (typeof label === 'string' && label) ||
          (field && (field as any).label) ||
          '';
        let labelText = rawLabel.trim();

        if (!labelText) {
          const fallback = ['Item type:', 'Collection:', 'Date:'];
          labelText = fallback[idx] || '';
        }

        let page = 0;
        if (id_field in this.data) {
          id = this.data[id_field].trim();
          if (this.data[id_field].includes('solr_document')) {
            id = this.data[id_field].replace('solr_document/', '');
          }
          if (labelText == "Excerpt") {

            const matches = value.match(/n=(\d+)/);
            if (matches) {
              page = matches[1] as number;
            }
            console.log(value);
            value = value.replace(/\|n[^\s]*/g, ' ');
          }
          if (page > 0) {
            id = query_string ? id + '?q=' + query_string + "&page=" + page : id;
          } else {
            id = query_string ? id + '?q=' + query_string : id;
          }
        }

        const displayLabel = field.show_label == 'true' ? label : labelText;

        return {
          label: displayLabel,
          value,
          field,
          template:
            field.show_label == 'true'
              ? Array.isArray(value) && field.facet_link_pattern != undefined
                ? html` <div class="t-label">
                    <dt class="t-bold">${label}:</dt>
                    <dd>
                      ${repeat(
                        value,
                        (val) => val,
                        (val, index) =>
                          html`<a href="${field.facet_link_pattern}${val}"
                              >${val}</a
                            >${index < value.length - 1 ? ', ' : ''}`
                      )}
                    </dd>
                  </div>`
                : Array.isArray(value)
                ? html`<div class="t-label">
                    <dt class="t-bold">${label}:</dt>
                    <dd>
                      ${repeat(
                        value,
                        (val) => val,
                        (val, index) =>
                          html`${val}${index < value.length - 1 ? ', ' : ''}`
                      )}
                    </dd>
                  </div>`
                : html`<div class="t-label">
                    <dt class="t-bold">${label}:</dt>
                    <dd>${is_bool ? html`${has_value == true ? field.boolean_true : field.boolean_false}` : unsafeHTML(value)}</dd>
                  </div>`
              : Array.isArray(value) ? html`<div class="t-label">
                  <dt class="t-bold">${labelText}</dt>
                  <dd>${repeat(value, (val) => val, (val, index) => html`${val}${index < value.length - 1 ? ', ' : '' }`)}</dd>
                </div>` 
                : html`<div class="t-label">
                    <dt class="t-bold">${label}:</dt>
                    <dd>${is_bool ? html`${has_value == true ? field.boolean_true : field.boolean_false}` : unsafeHTML(value)}</dd>
                  </div>`
        };
      })
      .filter((entry): entry is NonNullable<typeof entry> => entry != null);

    // Extract first field for use in h2 when base_path && id is false
    const firstField = field_entries[0];
    const remainingFields = field_entries.slice(1);

    // Create field list based on whether we're using first field in h2
    const field_list =
      base_path && id
        ? field_entries.map((entry) => entry.template)
        : remainingFields.map((entry) => entry.template);

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
      <article>
        <div class="item-detail">
          ${base_path && id
            ? html`
                <h2 class="item-title t-title-small s-stack-small">
                  <a href="${base_path + id}"
                    ><span class="sr-only">Title:</span>${title}
                  </a>
                </h2>
              `
            : firstField
            ? html`
                <h2 class="item-title t-title-small s-stack-small">
                  ${Array.isArray(firstField.value)
                    ? firstField.field.facet_link_pattern
                      ? repeat(
                          firstField.value,
                          (val) => val,
                          (val) =>
                            html`
                              <a
                                href="${firstField.field
                                  .facet_link_pattern}${val}"
                              >
                                ${firstField.label}${firstField.label
                                  ? ': '
                                  : ''}
                                ${val}</a
                              >
                            `
                        )
                      : repeat(
                          firstField.value,
                          (val) => val,
                          (val) =>
                            html`${firstField.label}${firstField.label
                              ? ': '
                              : ''}${val}`
                        )
                    : unsafeHTML(firstField.value)}
                </h2>
              `
            : ''}
          ${html`<dl class="item-fields">${field_list}</dl>`}
        </div>
        ${!thumbnail_field || !thumbnail || thumbnail === 'static:unavailable'
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
      </article>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'search-result-element-umd-libraries': SearchResultElementUMDLibraries;
  }
}
