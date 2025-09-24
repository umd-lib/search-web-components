import {html, TemplateResult} from 'lit';
import {customElement} from 'lit/decorators.js';
import BaseFacetElement from '../BaseFacetElement';
import {ResultsType} from '../types';
import {DropdownMixin} from '../BaseDropdownElement';

/**
 * A themeable and accessible HTML facet dropdown. Parts of this component may still change.
 * Based on https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/
 */
@customElement('facet-dropdown-html')
export class FacetDropdownHtml extends DropdownMixin(BaseFacetElement) {
  override updated(changedProperties: Map<string, any>) {
    if (this.facetConfigLoaded || !this.context?.responseReady) {
      return;
    }
    super.updated(changedProperties);

    const facet = this._getFacetData();
    this.htmlSelectLabel = this._configOrAttribute(
      facet?.settings.widget.htmlSelectLabel,
      this.htmlSelectLabel
    );
    this.required = this._configOrAttribute(
      facet?.settings.widget.required,
      this.required
    );
    this.multipleSelect = this._configOrAttribute(
      facet?.settings.widget.multipleSelect,
      this.multipleSelect
    );
  }

  /** @inheritDoc */
  override applyFacet(
    key: string,
    value: string,
    _clearApplied: boolean = false
  ) {
    super.applyFacet(key, value, !this.multipleSelect);

    if (!this.multipleSelect) {
      this.close();
    }
  }

  /** HTML helper function **/

  /** @inheritDoc */
  override getHtmlLabel(): string | TemplateResult {
    return this.overrideLabel ? this.overrideLabel : this._getFacetData().label;
  }

  /** @inheritDoc */
  override getOptionKey(option: ResultsType): string {
    return option.key;
  }

  /** @inheritDoc */
  override getOptionValue(option: ResultsType): string {
    return option.key;
  }

  /** @inheritDoc */
  override getOptionLabel(option: ResultsType): string {
    return `${option.label}${this.showCount ? ` (${option.count})` : ''}`;
  }

  /** @inheritDoc */
  override getAllOptions(): ResultsType[] {
    return this._getFacetData().results;
  }

  /** @inheritDoc */
  override isOptionSelected(option: ResultsType): boolean {
    return option.active ?? false;
  }

  /** @inheritDoc */
  override hasSelectedOptions(): boolean {
    return (this._getFacetData()?.active_values?.length ?? 0) > 0;
  }

  /** @inheritDoc */
  override getHtmlSelectLabel(): string | TemplateResult {
    if (this.hasSelectedOptions()) {
      const selected = this.getSelectedOptions() as ResultsType[];
      return selected.map((o) => o.label).join(', ');
    }

    return this.htmlSelectLabel;
  }

  /** @inheritDoc */
  override optionMouseDown(e: MouseEvent, option: ResultsType): void {
    e.preventDefault();
    this.applyFacet(this.urlAlias, option.key);
  }

  /** @inheritDoc */
  override clearSelection(e: MouseEvent): void {
    e.preventDefault();
    this.clearFacet(this.urlAlias);
    this.close();
  }

  /** @inheritDoc */
  override applySelection(_event: KeyboardEvent): void {
    if (this.focusedOption && this.focusedOption.dataset.value) {
      this.applyFacet(this.urlAlias, this.focusedOption.dataset.value);
    } else {
      this.clearFacet(this.urlAlias);
      this.close();
    }
  }

  /** @inheritDoc */
  override getSelectedOptions(): unknown[] {
    return this._getFacetData().results.filter((o) => o.active);
  }

  /** @inheritDoc */
  override filterOptions(searchString: string): ResultsType[] {
    return this.getAllOptions().filter((option) => {
      return option.label.toLowerCase().startsWith(searchString);
    });
  }

  /**
   * Render the element.
   */
  override render() {
    super.render();
    if (!this.shouldRender()) {
      return null;
    }

    return this.wrapCollapsible(
      this._getCollapsibleLabelElement(),
      html`
        <div class="html-dropdown-container">
          ${this._getHtmlSelectLabelElement()} ${this._getHtmlSelectElement()}
          ${this._getResetElement()}
        </div>
      `
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'facet-dropdown-html': FacetDropdownHtml;
  }
}
