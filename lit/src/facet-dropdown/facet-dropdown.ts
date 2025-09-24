import {html, TemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {repeat} from 'lit/directives/repeat.js';
import BaseFacetElement from '../BaseFacetElement';
import {ResultsType} from '../types';

/**
 * A facet dropdown element.
 */
@customElement('facet-dropdown')
export class FacetDropdown extends BaseFacetElement {
  /**
   * The label to show inside the select when no option is selected.
   */
  @property()
  selectLabel = 'Choose an option';

  override updated(changedProperties: Map<string, any>) {
    if (this.facetConfigLoaded || !this.context?.responseReady) {
      return;
    }
    super.updated(changedProperties);

    const facet = this._getFacetData();
    this.selectLabel = this._configOrAttribute(
      facet?.settings.widget.selectLabel,
      this.selectLabel
    );
  }

  /** inheritdoc */
  override applyFacet(
    key: string,
    value: string,
    clearApplied: boolean = false
  ) {
    if (value) {
      super.applyFacet(key, value, clearApplied);
    } else {
      this.clearFacet(key);
    }
  }

  /**
   * Returns the html for the facet's label.
   */
  _getLabelElementSelect(): TemplateResult {
    const facet = this._getFacetData();
    const text = this.overrideLabel ? this.overrideLabel : facet.label;
    return html`<label
      for="facet-select-${this.uid}"
      class="facet-label ${facet.key}"
      >${text}</label
    >`;
  }

  /**
   * Render a single facet option.
   *
   * @param option The facet result to render an option for.
   */
  _getOptionElement(option: ResultsType): TemplateResult {
    return html` <option
      value=${option.key}
      ?selected=${option.active ?? false}
    >
      ${option.label}${this.showCount ? ` (${option.count})` : null}
    </option>`;
  }

  /**
   * Get all the facet option elements.
   */
  _getAllOptionsElements(): TemplateResult {
    const facet = this._getFacetData();

    return html`
      <option value="" ?selected="${(facet.active_values?.length ?? 0) <= 0}">
        ${this.selectLabel}
      </option>
      ${repeat(
        facet.results,
        (value) => value.key,
        (value) => {
          return html`${this._getOptionElement(value)}`;
        }
      )}
    `;
  }

  /**
   * Get the select element field.
   */
  _getSelectElement(): TemplateResult {
    return html`
      <select
        id="facet-select-${this.uid}"
        @change="${(e: Event) => {
          const v = e.currentTarget as HTMLInputElement;
          this.applyFacet(this.urlAlias, v.value, true);
        }}"
      >
        ${this._getAllOptionsElements()}
      </select>
    `;
  }

  override render() {
    super.render();

    if (!this.shouldRender()) {
      return null;
    }

    return this.wrapCollapsible(
      this._getCollapsibleLabelElement(),
      html`${this._getSelectElement()} ${this._getResetElement()}`
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'facet-dropdown': FacetDropdown;
  }
}
