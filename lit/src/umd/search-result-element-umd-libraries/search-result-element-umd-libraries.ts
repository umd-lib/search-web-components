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
  linked_field?: string;
  prefix_field?: string;
  suffix_field?: string;
  is_hidden?: string;
  is_link?: string;
  is_body?: string;
  is_date?: string;
  link_text?: string;
  link_prefix?: string;
  icon?: string;
  is_eyebrow?: string;
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

  private renderTitle(
    base_path: string,
    id: any,
    title: any,
    firstField: any,
    content_link: any
  ): any {
    if (base_path && id) {
      return html`
        <h3 class="item-title t-title-small s-stack-small">
          <a href="${base_path + id}"
            ><span class="sr-only">Title:</span>${title}
          </a>
        </h3>
      `;
    }

    if (firstField && content_link) {
      return html`
        <h3 class="item-title t-title-small s-stack-small">
          <a href="${content_link}"
            ><span class="sr-only">Title:</span>${firstField.value}</a
          >
        </h3>
      `;
    } else if (firstField) {
      return html`
        <h3 class="item-title t-title-small s-stack-small">
          ${this.renderFirstFieldTitle(firstField)}
        </h3>
      `;
    }

    return '';
  }

  private trimAndCloseTags(htmlContent: string, maxLength: number = 800): string {
    // Strip all HTML tags
    const plainText = htmlContent.replace(/<[^>]*>/g, '');

    // Truncate to maxLength and add ellipsis if longer
    if (plainText.length > maxLength) {
      return plainText.substring(0, maxLength) + ' ...';
    }

    return plainText;
  }

  private formatDate(dateValue: any): string {
    if (Array.isArray(dateValue)) {
      return dateValue.map(d => this.formatDate(d)).join(', ');
    }

    try {
      let date: Date;
      let numValue = dateValue;

      // Convert string numbers to actual numbers
      if (typeof dateValue === 'string') {
        const parsed = Number(dateValue);
        if (!isNaN(parsed)) {
          numValue = parsed;
        }
      }

      // Handle numeric timestamps (Unix seconds or JavaScript milliseconds)
      if (typeof numValue === 'number') {
        // If it's less than 100 billion, assume it's seconds; otherwise milliseconds
        const timestamp = numValue < 100000000000 ? numValue * 1000 : numValue;
        date = new Date(timestamp);
      } else {
        date = new Date(dateValue);
      }

      if (isNaN(date.getTime())) {
        return dateValue;
      }

      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateValue;
    }
  }

  private renderFirstFieldTitle(firstField: any): any {
    if (Array.isArray(firstField.value)) {
      if (firstField.field.facet_link_pattern) {
        return repeat(
          firstField.value,
          (val: any) => val,
          (val: any) =>
            html`
              <a
                href="${firstField.field.facet_link_pattern}${val}"
              >
                ${firstField.label}${firstField.label ? ': ' : ''}
                ${val}</a
              >
            `
        );
      } else {
        return repeat(
          firstField.value,
          (val: any) => val,
          (val: any) =>
            html`${firstField.label}${firstField.label
              ? ': '
              : ''}${val}`
        );
      }
    }

    if (firstField.field.facet_link_pattern !== undefined) {
      return html`<a
        href="${firstField.field.facet_link_pattern}${firstField.value}"
        >${firstField.value}^^8</a
      >`;
    }

    return unsafeHTML(firstField.value);
  }

  override render() {
    const id_field = this.settings['id'] as string;
    const link_field = this.settings['link_field'] as string;
    const title_field = this.settings['title'] as string;
    const thumbnail_field = this.settings['thumbnail'] as string;
    let orientation = this.settings['orientation'] as string;
    const item_class = this.settings['item_class'] as string;
    const fields: Record<string, Field> = this.settings['fields'];
    const base_path: string = this.settings['base_path'];
    const query_string = this?.context?.query?.get('q');

    let title = this.data[title_field];
    let thumbnail = this.data[thumbnail_field];
    let id = undefined;
    let content_link = undefined;

    let img_class = '';
    let item_detail_class = 's-inline-small';
    if (
      orientation === undefined ||
      orientation === null ||
      orientation != 'right'
    ) {
      orientation = 'left';
      item_detail_class = '';
      img_class = 's-inline-small';
    }

    let has_value = true;
    let eyebrow_value = undefined;
    const field_entries = Object.entries(fields)
      .map(([label, field]) => {
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

        if (link_field in this.data) {
          content_link = this.data[link_field].trim();
        }

        let page = 0;
        if (id_field in this.data) {
          id = this.data[id_field].trim();
          if (this.data[id_field].includes('solr_document')) {
            id = this.data[id_field].replace('solr_document/', '');
          }
          if (labelText == 'Excerpt') {
            const matches = value.match(/n=(\d+)/);
            if (matches) {
              page = matches[1] as number;
            }
            value = value.replace(/\[HIGHLIGHT\]/g, '<em>');
            value = value.replace(/\[\/HIGHLIGHT\]/g, ' </em>');
            value = value.replace(/\|n[^\s]*/g, ' ');
          }
          if (page > 0) {
            id = query_string
              ? id + '?q=' + query_string + '&page=' + page
              : id;
          } else {
            id = query_string ? id + '?q=' + query_string : id;
          }
        }

        const displayLabel =
          field.show_label != undefined && field.show_label == 'true'
            ? labelText
            : undefined;
        const link_text =
          field.link_text != undefined ? field.link_text : undefined;

        // Hidden fields not intended for display can be used as values for other fields
        const is_hidden = field.is_hidden == 'true' ? true : false;

        let content = undefined;

        // Prefix one field onto the displayed value, if prefix_field is specified.
        // If prefix_field is an array and value is an array, we assume the values correspond by index.
        // Similar logic applies for suffix_field.
        let combined_value = undefined;
        if (
          field.prefix_field != undefined &&
          this.data[field.prefix_field] != undefined
        ) {
          if (
            Array.isArray(value) &&
            !Array.isArray(this.data[field.prefix_field])
          ) {
            combined_value = value.map(
              (v: string) => this.data[field.prefix_field!] + ' — ' + v
            );
          } else if (
            !Array.isArray(value) &&
            !Array.isArray(this.data[field.prefix_field])
          ) {
            combined_value = this.data[field.prefix_field!] + ' — ' + value;
          } else if (
            Array.isArray(value) &&
            Array.isArray(this.data[field.prefix_field]) &&
            value.length === this.data[field.prefix_field].length
          ) {
            // This takes some trust in the data, that the prefix and value arrays are in the correct order,
            // but without some sort of unique identifier there's not much else we can do.
            combined_value = value.map(
              (v: string, index: number) =>
                this.data[field.prefix_field!][index] + ' — ' + v
            );
          }
        }

        if (
          field.suffix_field != undefined &&
          this.data[field.suffix_field] != undefined
        ) {
          if (
            Array.isArray(value) &&
            !Array.isArray(this.data[field.suffix_field])
          ) {
            combined_value = value.map(
              (v: string) => v + ' — ' + this.data[field.suffix_field!]
            );
          } else if (
            !Array.isArray(value) &&
            !Array.isArray(this.data[field.suffix_field])
          ) {
            combined_value = value + ' — ' + this.data[field.suffix_field!];
          } else if (
            Array.isArray(value) &&
            Array.isArray(this.data[field.suffix_field]) &&
            value.length === this.data[field.suffix_field].length
          ) {
            combined_value = value.map(
              (v: string, index: number) =>
                v + ' — ' + this.data[field.suffix_field!][index]
            );
          }
        }

        if (combined_value != undefined) {
          value = combined_value;
        }

        // Handle date formatting
        if (field.is_date != undefined && field.is_date == 'true') {
          value = this.formatDate(value);
        }

        // Handle linked fields for URLs.
        // If field is marked as a link, we check for linked_field or facet_link_pattern to construct the URL.
        // If neither is present, we assume the value itself is the URL.
        if (field.is_body && field.is_body == 'true') {
          // Intended for description content.
          const trimmedValue = this.trimAndCloseTags(value);
          content = html`<div class="body">${unsafeHTML(trimmedValue)}</div>`;
        } else if (field.is_link && field.is_link == 'true') {
          let link_prefix: string | undefined = undefined;
          if (field.link_prefix != undefined) {
            link_prefix = field.link_prefix;
          }
          if (
            field.linked_field != undefined &&
            this.data[field.linked_field] != undefined
          ) {
            const linked_field = this.data[field.linked_field];
            if (Array.isArray(value) && Array.isArray(linked_field)) {
              // Based on the data structure, I think we can assume that the field indexes match, so 0 = 0, etc.
              content = html` ${repeat(
                value,
                (val) => val,
                (val, index) =>
                  html`<a href="${link_prefix}${linked_field[index]}" class="field-link">
                      ${link_text != undefined ? link_text : val} </a
                    >${index < value.length - 1 ? ', ' : ''}`
              )}`;
            } else if (!Array.isArray(value) && !Array.isArray(linked_field)) {
              content = html`<a href="${link_prefix}${linked_field}" class="field-link">
                ${link_text != undefined ? link_text : value}
              </a>`;
            }
          } else if (field.facet_link_pattern != undefined) {
            if (Array.isArray(value)) {
              content = html` ${repeat(
                value,
                (val) => val,
                (val, index) =>
                  html`<a href="${link_prefix}${field.facet_link_pattern}${val}" class="facet-link">
                      ${link_text != undefined ? link_text : val} </a
                    >${index < value.length - 1 ? ', ' : ''}`
              )}`;
            } else {
              content = html`<a href="${link_prefix}${field.facet_link_pattern}${value}" class="facet-link">
                ${link_text != undefined ? link_text : value}
              </a>`;
            }
          } else if (field.linked_field == undefined) {
            content = html`<a href="${link_prefix}${value}" class="self-link">
              ${link_text != undefined ? link_text : value}
            </a>`;
          }
        } else {
          if (Array.isArray(value)) {
            content = html`${repeat(
              value,
              (val) => val,
              (val, index) =>
                html`${val}${index < value.length - 1 ? ', ' : ''}`
            )}`;
          }
        }

        // Create icon markup for field
        let icon = undefined;
        if (field.icon != undefined) {
          icon = html` <i
            style="display: block;"
            data-lucide="${field.icon}"
            class="bento-search-header-icon"
          ></i>`;
        }

        // Extract eyebrow field if present
        let is_eyebrow = false;
        if (field.is_eyebrow === 'true' && value != undefined) {
          eyebrow_value = value;
          is_eyebrow = true;
        }

        // Build dynamic classes based on field types
        let fieldClasses = '';
        if (field.is_link && field.is_link == 'true') {
          fieldClasses += 'has-link ';
        }
        if (field.is_date && field.is_date == 'true') {
          fieldClasses += 'has-date ';
        }
        fieldClasses = fieldClasses.trim();

        return {
          label: displayLabel,
          value,
          field,
          is_body: field.is_body == 'true',
          body_content:
            field.is_body == 'true' && !is_hidden
              ? html`<div class="body t-label s-stack-small">
                  ${unsafeHTML(this.trimAndCloseTags(value))}
                </div>`
              : undefined,
          template:
            is_hidden == true || is_eyebrow == true
              ? html`<span class="hidden">${value}</span>`
              : html`<div class="t-label ${fieldClasses ? `class="${fieldClasses}"` : ''}">
                  ${displayLabel
                    ? html`<dt class="t-bold">${displayLabel}:</dt>`
                    : undefined}
                  <dd>
                    ${icon ? icon : undefined}
                    ${is_bool
                      ? html`${has_value == true
                          ? field.boolean_true
                          : field.boolean_false}`
                      : content != undefined
                      ? content
                      : unsafeHTML(value)}
                  </dd>
                </div>`,
        };
      })
      .filter((entry): entry is NonNullable<typeof entry> => entry != null);

    // Separate body fields (to be hoisted above the dl) from everything else.
    // Hidden body fields stay in the dl as <span class="hidden">.
    const bodyEntries = field_entries.filter(
      (entry) => entry.is_body && entry.field.is_hidden != 'true'
    );
    const nonBodyEntries = field_entries.filter(
      (entry) => !entry.is_body || entry.field.is_hidden == 'true'
    );

    // Body content rendered between the title and the dl.
    const body_content =
      bodyEntries.length > 0
        ? html`${bodyEntries.map((entry) => entry.body_content)}`
        : nothing;

    // Extract first non-body field for equipmenet & space results when title is not linked, and use remaining non-body fields for the field list.
    const firstField = nonBodyEntries[0];
    const remainingFields = nonBodyEntries.slice(1);

    // Create field list using only non-body fields
    const field_list =
      base_path && id
        ? nonBodyEntries.map((entry) => entry.template)
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
      <article class="orientation-${orientation} ${item_class || ''}">
        <div class="item-detail ${item_detail_class}">
          ${eyebrow_value ? html`<div class="is-eyebrow">${eyebrow_value}</div>` : nothing}
          ${this.renderTitle(base_path, id, title, firstField, content_link)}
          ${body_content}
          ${field_list.length > 0
            ? html`<dl class="item-fields">${field_list}</dl>`
            : nothing}
        </div>
        ${!thumbnail_field || !thumbnail || thumbnail === 'static:unavailable'
          ? nothing
          : html`<img
              src="${thumbnail}"
              alt="${altText}"
              class="${img_class}"
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
