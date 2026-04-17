import {LitElement, html, nothing, TemplateResult} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';

interface QuickAction {
  label: string;
  boldText: string;
  labelAfter?: string;
  url: string;
  id: string;
}

interface ResourceLink {
  label: string;
  url: string;
  id: string;
  cssClass: string;
}

/**
 * A hero search block with two tabs: UMD Discover (redirects to Primo) and
 * Search All (redirects to an internal Drupal search page).
 *
 * Tab switching, keyboard navigation, the animated underline, and ARIA state
 * are all handled by the theme's umd-libraries-tabs.js which targets
 * [data-tabs-container] on DOMContentLoaded. This component renders the
 * correct static HTML structure that script expects and manages only the
 * Quick Actions dropdown state.
 */
@customElement('homepage-search')
export class HomepageSearch extends LitElement {
  /**
   * Base URL for UMD Discover (Primo). Must be an absolute URL with existing
   * query params (e.g. https://example.com/search?vid=...). The component
   * appends &query=any,contains,{value}.
   */
  @property({attribute: true})
  discoverUrl = '';

  /**
   * URL of the internal Drupal search page. May be relative or absolute.
   * The component appends ?q={value}.
   */
  @property({attribute: true})
  searchAllUrl = '';

  /**
   * URL for the "Learn about search options" link.
   */
  @property({attribute: true})
  learnMoreUrl = '';

  /**
   * Placeholder text for the UMD Discover input.
   */
  @property({attribute: true})
  discoverPlaceholder = 'Search for books, articles, journals, and more...';

  /**
   * Placeholder text for the Search All input.
   */
  @property({attribute: true})
  searchAllPlaceholder =
    'Search libraries collections, websites, research guides and more...';

  /**
   * Label for the UMD Discover tab button.
   */
  @property({attribute: true})
  discoverTabLabel = 'UMD Discover';

  /**
   * Label for the Search All tab button.
   */
  @property({attribute: true})
  searchAllTabLabel = 'Search All';

  /**
   * Description paragraph shown below the UMD Discover search form.
   */
  @property({attribute: true})
  discoverDescription =
    'Detailed collection search results from UMD Libraries collections and from libraries worldwide.';

  /**
   * Description paragraph shown below the Search All search form.
   */
  @property({attribute: true})
  searchAllDescription =
    "Preview results from libraries collections, databases, Libraries' websites, research guides, FAQs, and Database Finder and more.";

  /**
   * URL for the feedback form shown in the footer.
   */
  @property({attribute: true})
  feedbackUrl = '';

  /**
   * URL for the hero image.
   */
  @property({attribute: true})
  imageUrl = '';

  /**
   * Alt text for the hero image.
   */
  @property({attribute: true})
  imageAlt = '';

  /**
   * Caption text for the hero image figcaption.
   */
  @property({attribute: true})
  imageCaption = '';

  /**
   * JSON array of quick action links shown in the UMD Discover dropdown.
   * Each item: { label, boldText, labelAfter?, url, id }
   * Attribute name: quickactions
   */
  @property({
    converter: {
      fromAttribute: (value: string | null): QuickAction[] => {
        if (!value) return [];
        try {
          return JSON.parse(value) as QuickAction[];
        } catch {
          return [];
        }
      },
    },
  })
  quickActions: QuickAction[] = [];

  /**
   * JSON array of resource links shown in the footer resources section.
   * Each item: { label, url, id, cssClass }
   * Attribute name: resourcelinks
   */
  @property({
    converter: {
      fromAttribute: (value: string | null): ResourceLink[] => {
        if (!value) return [];
        try {
          return JSON.parse(value) as ResourceLink[];
        } catch {
          return [];
        }
      },
    },
  })
  resourceLinks: ResourceLink[] = [];

  @state()
  private _dropdownOpen = false;

  protected override createRenderRoot(): HTMLElement | DocumentFragment {
    this.style.display = 'block';
    return this;
  }

  private _submitDiscover(e: SubmitEvent): void {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const input = form.querySelector<HTMLInputElement>('input[type="text"]');
    const value = input?.value?.trim() ?? '';
    if (!this.discoverUrl) return;
    const url = new URL(this.discoverUrl);
    url.searchParams.set('query', `any,contains,${value}`);
    window.location.href = url.toString();
  }

  private _submitSearchAll(e: SubmitEvent): void {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const input = form.querySelector<HTMLInputElement>('input[type="text"]');
    const value = input?.value?.trim() ?? '';
    if (!this.searchAllUrl) return;
    const url = new URL(this.searchAllUrl, window.location.href);
    url.searchParams.set('q', value);
    window.location.href = url.toString();
  }

  private _isExternalUrl(url: string): boolean {
    try {
      return new URL(url, window.location.href).host !== window.location.host;
    } catch {
      return false;
    }
  }

  private _handleDiscoverFocus(): void {
    this._dropdownOpen = true;
  }

  private _handleDiscoverBlur(): void {
    // Delay allows clicks on dropdown links to register before hiding.
    setTimeout(() => {
      this._dropdownOpen = false;
    }, 150);
  }

  private _renderDiscoverPanel(): TemplateResult {
    return html`
      <div
        class="tab--panel"
        id="tabpanel-umd-discover"
        role="tabpanel"
        tabindex="0"
        aria-labelledby="tab-umd-discover"
      >
        <div class="input-form">
          <form
            class="hero-search-form"
            @submit="${(e: SubmitEvent) => this._submitDiscover(e)}"
          >
            <div class="hero-search-form">
              <div class="hero-search-input c-bg-secondary">
                <label class="sr-only" for="search-query-input-discover">
                  ${this.discoverPlaceholder}
                </label>
                <input
                  id="search-query-input-discover"
                  type="text"
                  name="search_query"
                  placeholder="${this.discoverPlaceholder}"
                  aria-label="${this.discoverPlaceholder}"
                  autocomplete="off"
                  class="form-text c-bg-secondary"
                  @focus="${() => this._handleDiscoverFocus()}"
                  @blur="${() => this._handleDiscoverBlur()}"
                />
                <button
                  type="submit"
                  class="button js-form-submit form-submit btn btn-primary"
                >
                  <div class="sr-only">Search</div>
                </button>
              </div>
            </div>
          </form>
        </div>
        <div class="tab-description t-label">
          <p>${this.discoverDescription}</p>
        </div>
        ${this.quickActions.length > 0
          ? html`
              <div
                class="hero-search-box-dropdown"
                id="hero-search-box-dropdown"
                style="${this._dropdownOpen ? '' : 'display:none;'}"
              >
                <div class="hero-search-dropdown-content">
                  <div class="quick-action">
                    <h3 class="drop-down-subtitle t-title-small s-stack-small">
                      Quick Actions
                    </h3>
                    <ul class="quick-action-options" role="list">
                      ${this.quickActions.map(
                        (action) => html`
                          <li class="s-stack-small">
                            <a
                              href="${action.url}"
                              class="quick-action-option l-flex-row"
                              id="${action.id}"
                            >
                              <i
                                data-lucide="search"
                                width="1rem"
                                height="1rem"
                                aria-hidden="true"
                                style="margin-right: 0.5rem;"
                              ></i>
                              <span
                                >${action.label}
                                <span>${action.boldText}</span>
                                ${action.labelAfter ?? nothing}</span
                              >
                            </a>
                          </li>
                        `
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            `
          : nothing}
      </div>
    `;
  }

  private _renderSearchAllPanel(): TemplateResult {
    return html`
      <div
        class="tab--panel"
        id="tabpanel-search-all"
        role="tabpanel"
        tabindex="0"
        aria-labelledby="tab-search-all"
      >
        <div class="input-form">
          <form
            class="hero-search-form"
            @submit="${(e: SubmitEvent) => this._submitSearchAll(e)}"
          >
            <div class="hero-search-form">
              <div class="hero-search-input c-bg-secondary">
                <label class="sr-only" for="search-query-input-search-all">
                  ${this.searchAllPlaceholder}
                </label>
                <input
                  id="search-query-input-search-all"
                  type="text"
                  name="search_query"
                  placeholder="${this.searchAllPlaceholder}"
                  aria-label="${this.searchAllPlaceholder}"
                  autocomplete="off"
                  class="form-text c-bg-secondary"
                />
                <button
                  type="submit"
                  class="button js-form-submit form-submit btn btn-primary"
                >
                  <div class="sr-only">Search</div>
                </button>
              </div>
            </div>
          </form>
        </div>
        <div class="tab-description t-label">
          <p>${this.searchAllDescription}</p>
        </div>
      </div>
    `;
  }

  override render(): TemplateResult {
    return html`
      <div class="hero-search-section s-box-page-medium-h s-center s-page-lock">
        <div class="hero-search-block c-bg-primary">
          <div class="search-feature">
            <div class="search-feature-header">
              <h2 class="search-feature-title t-title-large">Search</h2>
              <div class="search-feature-description">
                <i
                  aria-hidden="true"
                  data-lucide="info"
                  width="1rem"
                  height="1rem"
                ></i>
                <a
                  href="${this.learnMoreUrl}"
                  id="hero-what-does-this-search-link"
                  class="t-label information-link"
                >
                  Learn about search options.
                </a>
              </div>
            </div>

            <div class="search-feature-tab c-bg-secondary">
              <!--
              data-tabs-container: picked up by umd-libraries-tabs.js on
              DOMContentLoaded to initialise triggers, panels, keyboard nav,
              and the animated underline. Do not manage tab state in Lit.
            -->
              <div
                class="umd-lib tabs--container"
                data-tabs-container
                id="tabs-homepage-search"
                data-default-tab=""
              >
                <p id="tabs-homepage-search-label" class="sr-only">
                  Search tabs
                </p>
                <div
                  class="tabs--triggers"
                  role="tablist"
                  aria-labelledby="tabs-homepage-search-label"
                >
                  <button
                    class="tab--trigger t-interactive c-content-secondary s-box-medium-h s-box-small-v"
                    id="tab-umd-discover"
                    type="button"
                    role="tab"
                    aria-controls="tabpanel-umd-discover"
                  >
                    <span class="focus t-title-small"
                      >${this.discoverTabLabel}</span
                    >
                  </button>

                  <button
                    class="tab--trigger t-interactive c-content-secondary s-box-medium-h s-box-small-v"
                    id="tab-search-all"
                    type="button"
                    role="tab"
                    aria-controls="tabpanel-search-all"
                  >
                    <span class="focus t-title-small"
                      >${this.searchAllTabLabel}</span
                    >
                  </button>

                  <div class="tabs--triggers-deco" id="tabs--trigger-deco">
                    <span
                      class="tabs--triggers-deco-activeline"
                      id="deco-underline"
                    ></span>
                  </div>
                </div>

                <div class="tabs--content">
                  ${this._renderDiscoverPanel()} ${this._renderSearchAllPanel()}
                </div>
              </div>
            </div>
          </div>

          ${this.resourceLinks.length > 0
            ? html`
                <div class="resource-links">
                  <h3 class="resource-links-title t-title-medium">Resources</h3>
                  <ul role="list">
                    ${this.resourceLinks.map(
                      (link) => html`
                        <li>
                          <div class="umd-lib emphasized-link ">
                            <a
                              href="${link.url}"
                              class="${link.cssClass} resource-link-item emphasized-link--text t-body-small t-interactive-sub c-content-primary c-underline-primary ani-underline"
                              id="${link.id}"
                            >
                              <span
                                class="${this._isExternalUrl(link.url)
                                  ? 'i-external-arrow'
                                  : 'i-chevron'}"
                              ></span>
                              ${link.label}
                            </a>
                          </div>
                        </li>
                      `
                    )}
                  </ul>
                </div>
              `
            : nothing}
          ${this.feedbackUrl
            ? html`
                <div class="hero-search-footer">
                  <i
                    aria-hidden="true"
                    data-lucide="info"
                    width="1rem"
                    height="1rem"
                  ></i>
                  <p class="help t-label">
                    Any suggestions? Fill out
                    <a href="${this.feedbackUrl}">the feedback form</a>.
                  </p>
                </div>
              `
            : nothing}
        </div>
        ${this.imageUrl
          ? html`
              <div class="hero-search-image">
                <figure>
                  <img
                    alt="${this.imageAlt}"
                    src="${this.imageUrl}"
                    loading="lazy"
                  />
                  ${this.imageCaption
                    ? html`<figcaption class="t-label wysiwyg-editor">
                        ${this.imageCaption}
                      </figcaption>`
                    : nothing}
                </figure>
              </div>
            `
          : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'homepage-search': HomepageSearch;
  }
}
