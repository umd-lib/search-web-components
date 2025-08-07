import {html, TemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {repeat} from 'lit/directives/repeat.js';
import BaseFacetElement from '../BaseFacetElement';
import {ResultsType} from '../types';

/**
 * A facet checkbox element.
 */
@customElement('facet-checkbox')
export class FacetCheckbox extends BaseFacetElement {
  /**
   * Use radio inputs instead of checkboxes. Also ensures only one option can be chosen at a time.
   */
  @property({type: Boolean})
  useRadios = false;

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
    return html`
      <ul>
        ${repeat(
          opts,
          (value) => value.key,
          (value) => {
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
              <li class="${classes.join(' ')}">
                <input
                  type="${this.useRadios ? 'radio' : 'checkbox'}"
                  id=${id}
                  name="${value.key}"
                  value="${value.key}"
                  .checked=${value.active ?? false}
                  ?checked=${value.active ?? false}
                  @click=${() => this.applyFacet(this.urlAlias, value.key)}
                />
                <label for="${id}"
                  >${value.label}${this.showCount
                    ? ` (${value.count})`
                    : null}</label
                >
                ${value.children.length > 0
                  ? this._getOptions(value.children)
                  : null}
              </li>
            `;
          }
        )}
      </ul>
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
