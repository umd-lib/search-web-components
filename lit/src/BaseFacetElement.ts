import {BaseSearchElement} from './BaseSearchElement';
import {SearchFacetsType} from './types';
import {property, state} from 'lit/decorators.js';
import {html, TemplateResult} from 'lit';

export default class BaseFacetElement extends BaseSearchElement {
  /**
   * The machine name of the facet to render options for.
   */
  @property()
  key = '';

  /**
   * Replace the default facet label with this text.
   */
  @property()
  overrideLabel = '';

  /**
   * If the facet's label should be shown.
   */
  @property({type: Boolean})
  showLabel = false;

  /**
   * If counts should be shown next to facet options.
   */
  @property({type: Boolean})
  showCount = false;

  /**
   * If a reset button should be shown for this facet.
   */
  @property({type: Boolean})
  showReset = false;

  /**
   * The label to use for the reset/clear facet selection button. `@count` can be used as a token that will be replaced with the number of selected options.
   */
  @property()
  resetText = `Reset (@count)`;

  /**
   * Make the facet options collapsible.
   */
  @property({type: Boolean})
  collapsible = false;

  /**
   * Default a collapsible facet to closed.
   */
  @property({type: Boolean})
  closed = false;

  /**
   * Show the applied options count in a collapsible facet label.
   */
  @property({type: Boolean})
  showCountInCollapseLabel = false;

  /**
   * When set settings for this facet from the api are ignored.
   */
  @property({type: Boolean})
  preferAttributes = false;

  /**
   * The key used for this facet in the url and api calls.
   */
  @property({attribute: false})
  urlAlias = '';

  /**
   * The initial number of top level options to display.
   */
  @property({type: Number})
  softLimit?: number;

  /**
   * The label to 'Show Less' options.
   */
  @property()
  softLimitLessLabel?: string;

  /**
   * The label to 'Show More' options.
   */
  @property()
  softLimitMoreLabel?: string;

  /**
   * If a collapsible facet is open or closed.
   */
  @state()
  optionsOpen = true;

  @state()
  facetConfigLoaded = false;

  @state()
  facet: SearchFacetsType | undefined;

  @state()
  showMoreOpen = false;

  override connectedCallback() {
    super.connectedCallback();
    this.optionsOpen = !this.closed;
  }

  /**
   * Ensure the focusElement is focused when the dropdown is opened.
   */
  override updated(_changedProperties: Map<string, any>) {
    if (this.facetConfigLoaded || !this.context?.responseReady) {
      return;
    }

    const facet = this._getFacetData();
    if (!facet) {
      return;
    }

    this.urlAlias = facet.settings.url_alias;
    this.showLabel = this._configOrAttribute(
      facet.settings.show_title,
      this.showLabel
    );
    this.showCount = this._configOrAttribute(
      facet.settings.widget.show_numbers,
      this.showCount
    );
    this.showReset = this._configOrAttribute(
      facet.settings.widget.showReset,
      this.showReset
    );
    this.resetText = this._configOrAttribute(
      facet.settings.widget.resetText,
      this.resetText
    );
    this.collapsible = this._configOrAttribute(
      facet.settings.widget.collapsible,
      this.collapsible
    );
    this.closed = this._configOrAttribute(
      facet.settings.widget.closed,
      this.closed
    );
    this.optionsOpen = this._configOrAttribute(
      !facet.settings.widget.closed,
      !this.closed
    );
    this.showCountInCollapseLabel = this._configOrAttribute(
      facet.settings.widget.showCountInCollapseLabel,
      this.showCountInCollapseLabel
    );
    this.softLimit = this._configOrAttribute(
      Number(facet?.settings.widget?.soft_limit?.limit),
      this.softLimit
    );
    this.softLimitLessLabel = this._configOrAttribute(
      facet?.settings.widget?.soft_limit?.less_label,
      this.softLimitLessLabel
    );
    this.softLimitMoreLabel = this._configOrAttribute(
      facet?.settings.widget?.soft_limit?.more_label,
      this.softLimitMoreLabel
    );

    this.facetConfigLoaded = true;
  }

  /**
   * Get the correct value for a property based on config and attributes.
   */
  _configOrAttribute(config: any, attribute: any) {
    if (this.preferAttributes) {
      return attribute;
    }

    // For booleans we negotiate between the config and attribute value.
    if (typeof attribute === 'boolean') {
      if (config || attribute) {
        return true;
      }
    }

    // Use the config value if it's defined.
    if (config !== undefined) {
      return config;
    }

    // Fallback to the default attribute value if we didn't find anything else.
    return attribute;
  }

  _getOptionId(key: string): string {
    const cleanKey = key.replace(/\W/g, '-');
    return `option-${this.uid}-${cleanKey}`;
  }

  /**
   * Get the facet value and configuration for the given key.
   */
  _getFacetData(): SearchFacetsType {
    return this.context?.response?.facets.find(
      (f: SearchFacetsType) => f.key === this.key
    ) as SearchFacetsType;
  }

  /**
   * Returns the html for the facet's label.
   */
  _getLabelElement(): TemplateResult {
    const facet = this._getFacetData();
    const text = this.overrideLabel ? this.overrideLabel : facet.label;
    const labelId = `facet-label-${this.uid}`;
    const hasActiveOptions =
      facet.active_values && facet.active_values.length > 0;
    return html`<h2
      id="${labelId}"
      class="facet-label t-title-small t-uppercase s-stack-medium ${facet.key}"
      role="heading"
      aria-level="2"
      ?active="${hasActiveOptions}"
    >
      ${text}
    </h2>`;
  }

  /**
   * Returns the html for the facet's label.
   */
  _getCollapsibleLabelElement(): TemplateResult {
    const facet = this._getFacetData();
    const text = this.overrideLabel ? this.overrideLabel : facet.label;

    return html`
      <button
        aria-expanded="${this.optionsOpen}"
        class="facet-label collapsible ${facet.key} ${this.optionsOpen
          ? 'open'
          : 'closed'} c-bg-secondary s-box-small-v s-box-small-h"
        @click=${() => (this.optionsOpen = !this.optionsOpen)}
        aria-controls="${'facet-collapse-' + this.uid}"
        aria-label="${text} facet filter"
      >
        <div class="facet-label-text">
          <h2 class="t-title-small t-uppercase c-content-primary">
            ${text}${this.showCountInCollapseLabel &&
            facet.active_values?.length
              ? `(${facet.active_values.length})`
              : null}
          </h2>
        </div>
        <span class="i-chevron-down" aria-hidden="true"></span>
      </button>
    `;
  }

  /**
   * Returns the html for the button to toggle the soft limit.
   */
  _getSoftLimitElement(): TemplateResult {
    const facet = this._getFacetData();

    if (!this.softLimit || facet.results.length <= this.softLimit) {
      return html``;
    }

    return html`<button
      aria-expanded="${this.showMoreOpen}"
      class="facet-show-more ${facet.key} ${this.showMoreOpen
        ? 'open'
        : 'closed'}"
      @click=${() => (this.showMoreOpen = !this.showMoreOpen)}
      aria-controls="${'facet-options-collapse-' + this.uid}"
    >
      ${this.showMoreOpen ? this.softLimitLessLabel : this.softLimitMoreLabel}
    </button>`;
  }

  wrapCollapsible(
    label: TemplateResult,
    options: TemplateResult
  ): TemplateResult {
    const collapseId = `facet-collapse-${this.uid}`;

    return html`
      ${label}
      <div
        id="${collapseId}"
        class="facet-options facet-wrapper ${this.optionsOpen
          ? 'open'
          : 'closed'} c-bg-secondary s-margin-general-medium s-box-small-v s-box-small-h"
        role="region"
        aria-hidden="${!this.optionsOpen}"
      >
        ${this.optionsOpen ? options : null}
      </div>
    `;
  }

  /**
   * Returns the html for the facet reset button.
   */
  _getResetElement(): TemplateResult {
    const facet = this._getFacetData();

    if (
      !this.showReset ||
      !facet.active_values ||
      facet.active_values.length === 0
    ) {
      return html``;
    }

    const buttonText = this.resetText.replaceAll(
      '@count',
      '' + facet.active_values.length
    );
    const ariaLabel = `Reset ${facet.label} filters. Currently ${
      facet.active_values.length
    } ${
      facet.active_values.length === 1 ? 'filter is' : 'filters are'
    } selected.`;

    return html`<button
      class="${this.key} facet reset"
      @click="${() => this.clearFacet(this.urlAlias)}"
      aria-label="${ariaLabel}"
      type="button"
    >
      ${buttonText}
    </button>`;
  }

  shouldRender() {
    if (
      !this.context?.response ||
      this._getFacetData() === undefined ||
      this._getFacetData().count === 0
    ) {
      return false;
    }

    return true;
  }

  override render() {
    this.classList.add(this.safeIdentifier(this.key));

    const facet = this._getFacetData();

    if (facet && facet.count) {
      this.classList.add('has-options');
    } else {
      this.classList.remove('has-options');
    }

    if (facet && facet.active_values && facet.active_values.length > 0) {
      this.classList.add('is-active');
    } else {
      this.classList.remove('is-active');
    }

    if (this.collapsible && !this.optionsOpen) {
      this.classList.add('collapsed');
    } else {
      this.classList.remove('collapsed');
    }
  }
}
