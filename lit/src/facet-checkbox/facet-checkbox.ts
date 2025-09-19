import { html, nothing, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import BaseFacetElement from '../BaseFacetElement';
import { ResultsType, SearchFacetsType } from '../types';

/**
 * A facet checkbox element.
 */
@customElement('facet-checkbox')
export class FacetCheckbox extends BaseFacetElement {
  /**
   * Use radio inputs instead of checkboxes. Also ensures only one option can be chosen at a time.
   */
  @property({ type: Boolean })
  useRadios = false;

  @state()
  filterText: string = '';

  @state()
  showAllFacets: boolean = false;

  readonly FACET_LIMIT = 10;

  override updated(changedProperties: Map<string, any>) {
    if (this.facetConfigLoaded || !this.context?.responseReady) {
      return;
    }
    super.updated(changedProperties);

    const facet = this._getFacetData();
    this.useRadios = this._configOrAttribute(
      facet?.settings.widget.useRadios,
      this.useRadios
    );
  }

  override applyFacet(
    key: string,
    value: string,
    clearApplied: boolean = false
  ) {
    //@TODO better support the `Ensure that only one result can be displayed` from facet config.
    //@TODO should clicking a radio unselect a selected value? Currently this code does not allow that.
    if (this.useRadios) {
      this.context?.query?.delete(`f[${key}]`);
    }
    super.applyFacet(key, value, clearApplied);
  }

  /**
   * Returns the html for the facet's options.
   */
  _getOptions(children: undefined | ResultsType[] = undefined): TemplateResult {
    const facet = this._getFacetData();

    let opts = children ?? facet.results;
    if (
      children === undefined &&
      this.softLimit &&
      this.softLimit !== 0 &&
      !this.showMoreOpen
    ) {
      opts = opts.slice(0, this.softLimit);
    }

    if (this.filterText && this.filterText.trim() !== '') {
      const filter = this.filterText.trim().toLowerCase();
      opts = opts.filter(opt => opt.label.toLowerCase().includes(filter));
    }

    const showToggle = opts.length > this.FACET_LIMIT;
    const showFilter = opts.length > this.FACET_LIMIT || this.filterText !== '';
    const limitFacets = opts.length > this.FACET_LIMIT && !this.showAllFacets;

    const shown = limitFacets ? opts.slice(0, this.FACET_LIMIT) : opts;
    const hidden = limitFacets ? opts.slice(this.FACET_LIMIT) : [];

    return html`
      ${showFilter ?
        html` <input
                type="text"
                placeholder="Search Term"
                .value=${this.filterText}
                @input=${(e: Event) => {
                  const target = e.target as HTMLInputElement;
                  this.filterText = target.value;
                }}
              />`
        : nothing}

      <ul>
        ${repeat(
          shown,
          (value) => value.key,
          (value) => this._renderOption(value, facet, false)
        )}

        ${repeat(
          hidden,
          (value) => value.key,
          (value) => this._renderOption(value, facet, true)
        )}

        ${showToggle ?
        html`<button @click=${() => { this.showAllFacets = !this.showAllFacets }}>
            ${this.showAllFacets ? 'Show Less' : 'Show More'}
          </button>`
        : nothing}
      </ul>
    `;
  }

  /**
   * Renders a single facet
   */
  _renderOption(value: ResultsType, facet: SearchFacetsType, hide: boolean): TemplateResult {
    const id = this.genUniqId(
      `${facet.key}-${this.safeIdentifier(value.key)}`
    );

    const classes = ['facet'];
    this.useRadios ? classes.push('radio') : classes.push('checkbox');
    value.active ? classes.push('active') : null;
    value.in_active_trail ? classes.push('active-trail') : null;
    if (value.children.length > 0) {
      classes.push('has-children');
      value.children_expanded
        ? classes.push('children-expanded')
        : classes.push('children-hidden');
    }
    return html`
      <li class="${classes.join(' ')}" ?hidden=${hide}>
        <label for="${id}">
          ${value.label}${this.showCount ? ` (${value.count})` : null}
        </label>
        <input
          type="${this.useRadios ? 'radio' : 'checkbox'}"
          id=${id}
          name="${value.key}"
          value="${value.key}"
          .checked=${value.active ?? false}
          ?checked=${value.active ?? false}
          @click=${() => this.applyFacet(this.urlAlias, value.key)}
        />
        ${value.children.length > 0
        ? this._getOptions(value.children)
        : null}
      </li>
    `;
  }

  override render() {
    super.render();

    if (!this.shouldRender()) {
      return null;
    }

    if (this.collapsible) {
      return this.wrapCollapsible(
        this._getCollapsibleLabelElement(),
        html`${this._getOptions()} ${this._getSoftLimitElement()}
        ${this._getResetElement()} `
      );
    }

    return html`
      ${this.showLabel ? this._getLabelElement() : null} ${this._getOptions()}
      ${this._getSoftLimitElement()} ${this._getResetElement()}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'facet-checkbox': FacetCheckbox;
  }
}
