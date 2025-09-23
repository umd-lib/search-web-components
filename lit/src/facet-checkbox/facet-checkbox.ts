import {html, nothing, TemplateResult} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {repeat} from 'lit/directives/repeat.js';
import BaseFacetElement from '../BaseFacetElement';
import {ResultsType, SearchFacetsType} from '../types';

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

  @state()
  filterText: string = '';

  @state()
  showAllFacets: boolean = false;

  @state()
  lastFocusedFacetKey: string = '';

  @state()
  announceMessage: string = '';

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

    // If lastFocusedFacetKey was set, restore focus after render
    if (
      this.lastFocusedFacetKey &&
      changedProperties.has('lastFocusedFacetKey')
    ) {
      this._restoreFocusToFacet();
    }
  }

  override applyFacet(
    key: string,
    value: string,
    clearApplied: boolean = false
  ) {
    // Store the facet key that was just interacted with for focus management
    this.lastFocusedFacetKey = value;

    // Get the facet option to announce the change
    const facet = this._getFacetData();
    const option = facet.results.find((opt) => opt.key === value);
    if (option) {
      const action = option.active ? 'removed' : 'selected';
      this.announceMessage = `${option.label} filter ${action}`;

      // Clear the announcement after a brief delay
      setTimeout(() => {
        this.announceMessage = '';
      }, 1000);
    }

    //@TODO better support the `Ensure that only one result can be displayed` from facet config.
    //@TODO should clicking a radio unselected a selected value? Currently this code does not allow that.
    if (this.useRadios) {
      this.context?.query?.delete(`f[${key}]`);
    }
    super.applyFacet(key, value, clearApplied);
  }

  /**
   * Returns the html for the active (checked) facets section.
   */
  _getActiveFacetsSection(): TemplateResult {
    const facet = this._getFacetData();
    const activeFacets = facet.results.filter((opt) => opt.active);

    if (activeFacets.length === 0) {
      return html``;
    }

    const activeSectionId = `active-facets-${this.uid}`;
    const activeListId = `active-facets-list-${this.uid}`;

    return html`
      <section
        class="facet-active-section s-stack-medium"
        id="${activeSectionId}"
        aria-labelledby="${activeSectionId}-title"
        role="group"
      >
        <h3
          id="${activeSectionId}-title"
          aria-hidden="true"
          class="facet-active-section-title t-label sr-only"
        >
          Active Filters (${activeFacets.length})
        </h3>
        <ul
          class="active-facets-list"
          id="${activeListId}"
          aria-label="Currently selected ${facet.label} filters"
          role="list"
        >
          ${repeat(
            activeFacets,
            (value) => value.key,
            (value) => this._renderOption(value, facet, false)
          )}
        </ul>
        <button
          class="uncheck-all-button t-label c-content-primary"
          @click=${() => this.clearFacet(this.urlAlias)}
          aria-describedby="${activeListId}"
          aria-label="Remove all selected ${facet.label} filters"
        >
          Remove Selected
        </button>
      </section>
    `;
  }

  /**
   * Returns the html for the facet's options.
   */
  _getOptions(children: undefined | ResultsType[] = undefined): TemplateResult {
    const facet = this._getFacetData();

    let opts = children ?? facet.results;

    // Filter out active facets from the main options list (they'll be shown in the active section)
    if (children === undefined) {
      opts = opts.filter((opt) => !opt.active);
    }

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
      opts = opts.filter((opt) => opt.label.toLowerCase().includes(filter));
    }

    const showToggle = opts.length > this.FACET_LIMIT;
    const showFilter = opts.length > this.FACET_LIMIT || this.filterText !== '';
    const limitFacets = opts.length > this.FACET_LIMIT && !this.showAllFacets;

    const shown = limitFacets ? opts.slice(0, this.FACET_LIMIT) : opts;
    const hidden = limitFacets ? opts.slice(this.FACET_LIMIT) : [];

    const searchId = `facet-search-${this.uid}`;
    const searchInputId = `facet-search-input-${this.uid}`;
    const optionsListId = `facet-options-${this.uid}`;

    return html`
      ${(children ?? facet.results).length > this.FACET_LIMIT
        ? html`
            <div class="facet-search s-stack-medium" role="search">
              <label
                for="${searchInputId}"
                class="facet-search-title t-label"
                id="${searchId}-label"
              >
                Search Filter
              </label>
              ${showFilter
                ? html` <input
                    id="${searchInputId}"
                    class="facet-search-box c-content-primary c-bg-secondary"
                    type="text"
                    placeholder="Search Term"
                    .value=${this.filterText}
                    aria-describedby="${searchId}-description"
                    aria-controls="${optionsListId}"
                    @input=${(e: Event) => {
                      const target = e.target as HTMLInputElement;
                      this.filterText = target.value;
                    }}
                  />`
                : nothing}
              <div id="${searchId}-description" class="sr-only">
                Type to filter the list of ${facet.label} options below
              </div>
            </div>
          `
        : null}

      <ul
        id="${optionsListId}"
        class="facet-options-list"
        aria-label="${facet.label} filter options"
        role="list"
      >
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
      </ul>
      ${showToggle
        ? html`<button
            @click=${() => {
              this.showAllFacets = !this.showAllFacets;
            }}
            class="facet-show-all t-label c-content-primary"
            aria-expanded="${this.showAllFacets}"
            aria-controls="${optionsListId}"
            aria-label="${this.showAllFacets
              ? 'Show fewer'
              : 'Show more'} ${facet.label} options"
          >
            ${this.showAllFacets ? 'Show Less' : 'Show More'}
          </button>`
        : nothing}
    `;
  }

  /**
   * Renders a single facet
   */
  _renderOption(
    value: ResultsType,
    facet: SearchFacetsType,
    hide: boolean
  ): TemplateResult {
    const id = this.genUniqId(`${facet.key}-${this.safeIdentifier(value.key)}`);
    const inputType = this.useRadios ? 'radio' : 'checkbox';
    const groupName = this.useRadios ? `${facet.key}-radio-group` : value.key;

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

    const ariaDescription = this.showCount
      ? `${value.count} ${value.count === 1 ? 'result' : 'results'}`
      : null;

    return html`
      <li
        class="${classes.join(' ')} s-stack-small"
        ?hidden=${hide}
        role="listitem"
      >
        <input
          type="${inputType}"
          id=${id}
          name="${groupName}"
          value="${value.key}"
          .checked=${value.active ?? false}
          ?checked=${value.active ?? false}
          @click=${() => this.applyFacet(this.urlAlias, value.key)}
          aria-describedby="${ariaDescription ? `${id}-count` : ''}"
          @keydown=${this._handleOptionKeydown}
          aria-label="${value.label}"
        />
        <label for="${id}" aria-hidden="true">
          ${value.label}
          ${this.showCount
            ? html`
                <span
                  id="${id}-count"
                  class="facet-count"
                  aria-label="${ariaDescription}"
                  aria-hidden="true"
                >
                  (${value.count})
                </span>
              `
            : null}
        </label>
        ${value.children.length > 0 ? this._getOptions(value.children) : null}
      </li>
    `;
  }

  _handleOptionKeydown(e: KeyboardEvent) {
    // Allow space bar to toggle checkbox/radio in addition to click
    if (e.key === ' ') {
      e.preventDefault();
      (e.target as HTMLInputElement).click();
    }
  }

  /**
   * Restores focus to the facet that was last interacted with after DOM updates
   */
  _restoreFocusToFacet() {
    if (!this.lastFocusedFacetKey) return;

    // Use requestAnimationFrame to ensure DOM has updated
    requestAnimationFrame(() => {
      const facet = this._getFacetData();
      const targetId = this.genUniqId(
        `${facet.key}-${this.safeIdentifier(this.lastFocusedFacetKey)}`
      );
      const targetElement = this.shadowRoot?.getElementById(
        targetId
      ) as HTMLInputElement;

      if (targetElement) {
        targetElement.focus();
        // Clear the stored key after successful focus
        this.lastFocusedFacetKey = '';
      }
    });
  }

  override render() {
    super.render();

    if (!this.shouldRender()) {
      return null;
    }

    const facet = this._getFacetData();
    const wrapperAriaLabel = `${facet.label} facet filter`;

    if (this.collapsible) {
      return this.wrapCollapsible(
        this._getCollapsibleLabelElement(),
        html`
          <div
            class="facet-wrapper"
            role="region"
            aria-label="${wrapperAriaLabel}"
          >
            <!-- Live region for screen reader announcements -->
            <div aria-live="polite" aria-atomic="true" class="sr-only">
              ${this.announceMessage}
            </div>

            ${this._getActiveFacetsSection()} ${this._getOptions()}
            ${this._getSoftLimitElement()} ${this._getResetElement()}
          </div>
        `
      );
    }

    return html`
      <div
        class="facet-wrapper c-bg-secondary s-margin-general-medium s-box-small-v s-box-small-h"
        role="region"
        aria-label="${wrapperAriaLabel}"
      >
        <!-- Live region for screen reader announcements -->
        <div aria-live="polite" aria-atomic="true" class="sr-only">
          ${this.announceMessage}
        </div>

        <div class="s-stack-medium">
          ${this.showLabel ? this._getLabelElement() : null}
        </div>
        ${this._getActiveFacetsSection()} ${this._getOptions()}
        ${this._getSoftLimitElement()} ${this._getResetElement()}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'facet-checkbox': FacetCheckbox;
  }
}
