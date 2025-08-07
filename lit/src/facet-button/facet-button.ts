import {html, TemplateResult} from 'lit';
import {customElement} from 'lit/decorators.js';
import {repeat} from 'lit/directives/repeat.js';
import BaseFacetElement from '../BaseFacetElement';
import {ResultsType} from '../types';

/**
 * A facet button element.
 */
@customElement('facet-button')
export class FacetButton extends BaseFacetElement {
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
            const classes = ['facet', 'button'];
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
                <button
                  class="${this.key}"
                  type="button"
                  name="${value.key}"
                  value="${value.key}"
                  aria-pressed="${value.active ?? false}"
                  @click=${() => this.applyFacet(this.urlAlias, value.key)}
                >${value.label}${this.showCount ? ` (${value.count})` : null}
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
        ${this._getResetElement()}`
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
    'facet-button': FacetButton;
  }
}
