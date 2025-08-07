import {html, TemplateResult} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {BaseSearchElement} from '../BaseSearchElement';
import {repeat} from 'lit/directives/repeat.js';
import {SimpleValue} from '../types';
import {DropdownMixin} from '../BaseDropdownElement';

/**
 * A element to choose how many results per page to display.
 */
@customElement('search-results-per-page')
export class SearchResultsPerPage extends DropdownMixin(BaseSearchElement) {
  /** @inheritDoc */
  override required = true;

  /**
   * HTML element to use when rendering options.
   */
  @property()
  type: 'select' | 'list' | 'html' = 'select';

  /**
   * The label text to use for the select field.
   */
  @property()
  labelText = 'Per page';

  /**
   * An array of available options to display structured like {"label": "Example", "value": "10"}.
   */
  @property({type: Array})
  options: SimpleValue[] = [];

  @state()
  indexConfigLoaded = false;

  override updated(_changedProperties: Map<string, any>) {
    if (this.indexConfigLoaded || !this.context?.responseReady) {
      return;
    }

    this.indexConfigLoaded = true;
    if (this.options.length === 0 && this.context.response?.swc_page_sizes) {
      this.options = this.context.response?.swc_page_sizes;
    }
  }

  /**
   * Update the current query with a new page limit and reset the current page.
   *
   * @param limit
   */
  _queryPerPage(limit: string | null): void {
    const query = new URLSearchParams(this.context?.query?.toString() ?? '');

    const defaultPerPage = '' + this?.context?.defaultPerPage;
    const searchPerPage = '' + this?.context?.response?.search_results_per_page;

    if (limit) {
      query.set('limit', limit);
    } else {
      query.set('limit', defaultPerPage);
    }

    // Reset the search to the first page if the page limit changes.
    if (limit !== searchPerPage) {
      query.delete('page');
    }

    // Remove the unneeded param if the limit matches the default.
    if (limit === defaultPerPage) {
      query.delete('limit');
    }

    this.getResults(query);
  }

  /**
   * Get the currently selected page limit.
   */
  _getSelected(): SimpleValue | undefined {
    const defaultPerPage = '' + this?.context?.defaultPerPage;
    const searchPerPage = '' + this?.context?.response?.search_results_per_page;

    let selected = this.options.find((i) => i.key === defaultPerPage);
    if (this.context?.response?.search_results_per_page) {
      selected = this.options.find((i) => i.key === searchPerPage);
    }

    return selected;
  }

  /**
   * Get the element for all available options.
   */
  _getSelectOption(): TemplateResult {
    return html` ${repeat(
      this.options,
      (item) => item.key,
      (item) => {
        return html`<option
          value=${item.key}
          ?selected=${this._getSelected()?.key === item.key}
        >
          ${item.label}
        </option>`;
      }
    )}`;
  }

  /**
   * Get the element for all available options.
   */
  _getListOption(): TemplateResult {
    return html` ${repeat(
      this.options,
      (item) => item.key,
      (item) => {
        return html`<li>
          <button
            class="${this._getSelected()?.key === item.key ? 'selected' : null}"
            value=${item.key}
            @click=${(e: Event) => {
              e.preventDefault();
              this._queryPerPage('' + item.key);
            }}
          >
            ${item.label}
          </button>
        </li>`;
      }
    )}`;
  }

  /**
   * Get the elements for a vanilla select field.
   */
  _getSelect() {
    return html`
      ${this.labelText
        ? html`<label for="per-page-${this.uid}">${this.labelText}</label>`
        : null}
      <select
        id="per-page-${this.uid}"
        name="result count"
        @change="${(e: Event) => {
          e.preventDefault();
          const el = e.currentTarget as HTMLInputElement;
          const limit = el.value;
          this._queryPerPage(limit);
        }}"
        required
      >
        ${this._getSelectOption()}
      </select>
    `;
  }

  /**
   * Get the elements for a list field.
   */
  _getList() {
    return html`
      ${this.labelText
        ? html`<label for="per-page-${this.uid}">${this.labelText}</label>`
        : null}
      <ul id="sort-${this.uid}">
        ${this._getListOption()}
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

  override render() {
    if (this.options.length === 0 || !this.context?.response) {
      return null;
    }

    switch (this.type) {
      case 'select':
        return this._getSelect();
      case 'list':
        return this._getList();
      case 'html':
        return this._getHtml();
    }
  }

  /** HTML helper function **/
  /** @inheritDoc */
  override getHtmlLabel(): string | TemplateResult {
    return this.labelText;
  }

  /** @inheritDoc */
  override getOptionKey(option: SimpleValue): string {
    return option.key ? '' + option.key : '' + option.value;
  }

  /** @inheritDoc */
  override getOptionValue(option: SimpleValue): string {
    return option.value ? '' + option.value : '' + option.key;
  }

  /** @inheritDoc */
  override getOptionLabel(option: SimpleValue): string {
    return '' + option.label;
  }

  /** @inheritDoc */
  override getAllOptions(): SimpleValue[] {
    return this.options;
  }

  /** @inheritDoc */
  override isOptionSelected(option: SimpleValue): boolean {
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
  override optionMouseDown(e: MouseEvent, option: SimpleValue): void {
    e.preventDefault();
    this._queryPerPage('' + this.getOptionValue(option));
    this.close();
  }

  /** @inheritDoc */
  override applySelection(_event: KeyboardEvent): void {
    if (this.focusedOption && this.focusedOption.dataset.value) {
      this._queryPerPage(this.focusedOption.dataset.value);
    }
  }

  /** @inheritDoc */
  override getSelectedOptions(): SimpleValue[] {
    const selected = this._getSelected();
    return selected ? [selected] : [];
  }

  /** @inheritDoc */
  override filterOptions(searchString: string): SimpleValue[] {
    return this.getAllOptions().filter((option) => {
      return ('' + option.label).toLowerCase().startsWith(searchString);
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'search-results-per-page': SearchResultsPerPage;
  }
}
