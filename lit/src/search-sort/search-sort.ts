import {html, TemplateResult} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {BaseSearchElement} from '../BaseSearchElement';
import {repeat} from 'lit/directives/repeat.js';
import {SortOption, UMDSort} from '../types';
import {DropdownMixin} from '../BaseDropdownElement';

// @TODO support a default sort key.

/**
 * A dropdown element to choose how to sort the search results.
 */
@customElement('search-sort')
export class SearchSort extends DropdownMixin(BaseSearchElement) {
  /** @inheritDoc */
  override required = true;

  /**
   * HTML element to use when rendering options.
   */
  @property()
  type: 'select' | 'list' | 'html' | 'umd-libraries' = 'select';

  /**
   * The label to display for the sort select field.
   */
  @property()
  labelText = 'Sort';

  /**
   * An array of available options to display structured like {"key": "example_field", "label": "Example", "order": "asc or desc"}.
   */
  @property({type: Array})
  sorts: SortOption[] = [];

  /**
   * Sort options specific for the UMD Libraries sort component.
   */
  @property({type: Object})
  umd_sorts: UMDSort = {sort_by: [], order: [], results_per: [], post: false};

  @state()
  indexConfigLoaded = false;

  override updated(_changedProperties: Map<string, any>) {
    if (this.indexConfigLoaded || !this.context?.responseReady) {
      return;
    }

    this.indexConfigLoaded = true;
    if (this.sorts.length === 0 && this.context.response?.swc_sorts) {
      this.sorts = this.context.response?.swc_sorts;
    }
  }

  /**
   * Update the current query with a new sort order.
   * @param sortKey
   * @param sortOrder
   */
  _querySort(
    sortKey: string,
    sortOrder: string,
    resultsPerPage?: string
  ): void {
    const query = new URLSearchParams(this.context?.query?.toString() ?? '');

    if (sortKey) {
      query.set('sort', sortKey);
      query.set('order', sortOrder);
    }

    if (resultsPerPage) {
      query.set('limit', resultsPerPage);
    }

    if (sortKey === this.context?.response?.default_sort) {
      query.delete('sort');
    }

    if (sortOrder === this.context?.response?.default_sort_order) {
      query.delete('order');
    }

    this.getResults(query);
  }

  /**
   * Get the currently selected sort option.
   */
  _getSelected(): SortOption | undefined {
    let selectedSort =
      this.context?.query?.get('sort') +
      '|' +
      this.context?.query?.get('order');

    if (selectedSort === 'null|null') {
      selectedSort =
        this.context?.response?.default_sort +
        '|' +
        this.context?.response?.default_sort_order;
    }

    let selected: SortOption | undefined = {
      label: 'Relevance',
      key: 'search_api_relevance',
      order: 'desc',
    };
    if (this.sorts.find((i) => `${i.key}|${i.order}` === selectedSort)) {
      selected = this.sorts.find((i) => `${i.key}|${i.order}` === selectedSort);
    }

    return selected;
  }

  /**
   * Get the element for all available sort options.
   */
  _getSelectOptions(): TemplateResult {
    const selected = this._getSelected();
    const s = selected?.key + '|' + selected?.order;

    return html`${repeat(
      this.sorts,
      (item) => item.key,
      (item) => {
        const v = item.key + '|' + item.order;
        return html`<option value=${v} ?selected=${v === s}>
          ${item.label}
        </option>`;
      }
    )}`;
  }

  /**
   * Get the element for all available sort options.
   */
  _getListOptions(): TemplateResult {
    const selected = this._getSelected();
    const s = selected?.key + '|' + selected?.order;

    return html`${repeat(
      this.sorts,
      (item) => item.key,
      (item) => {
        const v = item.key + '|' + item.order;
        const isSelected = v === s;
        return html`<li role="none">
          <button
            type="button"
            role="radio"
            class="${isSelected ? 'selected' : null}"
            value=${v}
            aria-checked="${isSelected}"
            aria-label="Sort by ${item.label}"
            @click=${(e: Event) => {
              e.preventDefault();
              this._querySort(item.key, item.order);
            }}
            @keydown=${(e: KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this._querySort(item.key, item.order);
              }
            }}
          >
            ${item.label}
            ${isSelected
              ? html`<span class="sr-only"> (currently selected)</span>`
              : ''}
          </button>
        </li>`;
      }
    )}`;
  }

  /**
   * Get the elements for a vanilla select field.
   */
  _getSelect() {
    const selected = this._getSelected();
    const describedById = `sort-desc-${this.uid}`;

    return html`
      ${this.labelText
        ? html`<label for="sort-${this.uid}">${this.labelText}</label>`
        : null}
      <div
        id="${describedById}"
        class="sr-only"
        aria-live="polite"
        aria-atomic="true"
      >
        ${selected
          ? `Currently sorted by ${selected.label}`
          : 'No sort applied'}
      </div>
      <select
        id="sort-${this.uid}"
        name="sort"
        aria-describedby="${describedById}"
        aria-label="${this.labelText || 'Sort options'}"
        @change="${(e: Event) => {
          e.preventDefault();
          const el = e.currentTarget as HTMLInputElement;
          const [sort, order] = el.value.split('|');
          this._querySort(sort, order);
        }}"
        required
      >
        ${this._getSelectOptions()}
      </select>
    `;
  }

  /**
   * Get the elements for a list field.
   */
  _getList() {
    const selected = this._getSelected();
    const describedById = `sort-list-desc-${this.uid}`;

    return html`
      ${this.labelText
        ? html`<div class="sort-label" id="sort-label-${this.uid}">
            ${this.labelText}
          </div>`
        : null}
      <div
        id="${describedById}"
        class="sr-only"
        aria-live="polite"
        aria-atomic="true"
      >
        ${selected
          ? `Currently sorted by ${selected.label}`
          : 'No sort applied'}
      </div>
      <ul
        id="sort-${this.uid}"
        role="radiogroup"
        aria-labelledby="sort-label-${this.uid}"
        aria-describedby="${describedById}"
      >
        ${this._getListOptions()}
      </ul>
    `;
  }

  /**
   * Get the elements for a html select field.
   */
  _getHtml() {
    return html`
      ${this._getHtmlLabelElement()}
      <div class="html-dropdown-container">
        ${this._getHtmlSelectLabelElement()} ${this._getHtmlSelectElement()}
      </div>
    `;
  }

  _sortTemplates(label: string, name: string, options: string[]) {
    const selectId = `${name}-${this.uid}`;
    const helpId = `${name}-help-${this.uid}`;

    return html`
      <div class="sort-option s-stack-small">
        <label for="${selectId}" class="t-label c-content-primary">
          ${label}
        </label>
        <div id="${helpId}" class="sr-only">
          Select ${label.toLowerCase()} from the available options
        </div>
        <select
          id="${selectId}"
          name="${name}"
          required
          class="c-bg-secondary"
          aria-describedby="${helpId}"
          aria-label="${label}"
        >
          ${options.map((option) => {
            if (option.includes(':')) {
              const [optionLabel, value] = option.split(':');
              return html` <option value="${value}">${optionLabel}</option> `;
            } else {
              return html` <option value="${option}">${option}</option> `;
            }
          })}
        </select>
      </div>
    `;
  }

  /**
   * Custom sort component for UMD Libraries
   */
  _getCustom() {
    const sort_by = this.umd_sorts['sort_by'];
    const order = this.umd_sorts['order'];
    const results_per = this.umd_sorts['results_per'];
    const statusId = `sort-status-${this.uid}`;
    const formId = `sort-form-${this.uid}`;

    const sort_templates = [];
    sort_templates.push(this._sortTemplates('Sort By', 'sort_by', sort_by));
    sort_templates.push(this._sortTemplates('Order', 'order', order));
    sort_templates.push(
      this._sortTemplates('Results Per Page', 'results', results_per)
    );

    return html`
      <div
        class="search-sort c-bg-secondary s-margin-general-medium s-box-small-v s-box-small-h"
        role="region"
        aria-labelledby="sort-title-${this.uid}"
      >
        <div
          id="sort-title-${this.uid}"
          class="sort-title t-title-small t-uppercase s-stack-medium c-content-primary"
        >
          Sort & Display
        </div>
        <div
          id="${statusId}"
          class="sr-only"
          aria-live="polite"
          aria-atomic="true"
        >
          Sort and display options form
        </div>
        <form
          id="${formId}"
          class="sort-options s-stack-medium"
          aria-describedby="${statusId}"
        >
          ${sort_templates}
        </form>
        <button
          type="submit"
          class="umd-lib button secondary"
          aria-describedby="${statusId}"
          @click=${(e: Event) => {
            e.preventDefault();
            const sort_value =
              (
                document.getElementById(
                  `sort_by-${this.uid}`
                ) as HTMLSelectElement
              )?.value ?? '';
            const order_value =
              (
                document.getElementById(
                  `order-${this.uid}`
                ) as HTMLSelectElement
              )?.value ?? '';
            const results_value =
              (
                document.getElementById(
                  `results-${this.uid}`
                ) as HTMLSelectElement
              )?.value ?? '';
            this._querySort(sort_value, order_value, results_value);

            // Update status for screen readers
            const statusElement = document.getElementById(statusId);
            if (statusElement) {
              statusElement.textContent = `Applied sort: ${sort_value} in ${order_value} order, showing ${results_value} results per page`;
            }
          }}
          @keydown=${(e: KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              (e.target as HTMLButtonElement).click();
            }
          }}
        >
          Apply
        </button>
      </div>
    `;
  }

  override render() {
    if (this.sorts.length === 0 || !this.context?.response) {
      return null;
    }

    switch (this.type) {
      case 'select':
        return this._getSelect();
      case 'list':
        return this._getList();
      case 'html':
        return this._getHtml();
      case 'umd-libraries':
        return this._getCustom();
    }
  }

  /** HTML helper function **/
  /** @inheritDoc */
  override getHtmlLabel(): string | TemplateResult {
    return this.labelText;
  }

  /** @inheritDoc */
  override getOptionKey(option: SortOption): string {
    return `${option.key}-${option.order}`;
  }

  /** @inheritDoc */
  override getOptionValue(option: SortOption): string {
    return `${option.key}|${option.order}`;
  }

  /** @inheritDoc */
  override getOptionLabel(option: SortOption): string {
    return '' + option.label;
  }

  /** @inheritDoc */
  override getAllOptions(): SortOption[] {
    return this.sorts;
  }

  /** @inheritDoc */
  override isOptionSelected(option: SortOption): boolean {
    const selected = this._getSelected();
    if (!selected) {
      return false;
    }
    return this.getOptionValue(selected) === this.getOptionValue(option);
  }

  /** @inheritDoc */
  override hasSelectedOptions(): boolean {
    return this._getSelected() ? true : false;
  }

  /** @inheritDoc */
  override getHtmlSelectLabel(): string | TemplateResult {
    if (this._getSelected()) {
      return '' + this._getSelected()?.label;
    }

    return this.htmlSelectLabel;
  }

  /** @inheritDoc */
  override optionMouseDown(e: MouseEvent, option: SortOption): void {
    e.preventDefault();
    this._querySort(option.key, option.order);
    this.close();
  }

  /** @inheritDoc */
  override applySelection(_event: KeyboardEvent): void {
    if (this.focusedOption && this.focusedOption.dataset.value) {
      const [sort, order] = this.focusedOption.dataset.value.split('|');
      this._querySort(sort, order);
    }
  }

  /** @inheritDoc */
  override getSelectedOptions(): SortOption[] {
    const selected = this._getSelected();
    return selected ? [selected] : [];
  }

  /** @inheritDoc */
  override filterOptions(searchString: string): SortOption[] {
    return this.getAllOptions().filter((option) => {
      return ('' + option.label).toLowerCase().startsWith(searchString);
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'search-sort': SearchSort;
  }
}
