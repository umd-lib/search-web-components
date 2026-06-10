import {customElement, property, state} from 'lit/decorators.js';
import {BaseSearchElement} from '../../BaseSearchElement';
import {html, TemplateResult} from 'lit';

/**
 * The root container for a component based search experience. All search components on the search page must be a child of this component to work correctly.
 */
@customElement('more-searchers')
export class MoreSearchers extends BaseSearchElement {
  @property()
  blockTitle = '';

  @property()
  blockDescription = '';

  @property({type: Object})
  blockUrls: {
    title?: string;
    [key: string]: any;
  } = {};

  @property({type: Object})
  Urls: {
    [title: string]: {
      url: string;
      no_query?: string;
      description?: string;
      format?: string;
    };
  } = {};

  @property()
  blockIcon = '';

  @property()
  blockID = '';

  /**
   * The decoupled search api endpoint to query for results. Search query params added to this url will be used for the initial search if no search query params are present in the page url, they will also be added to the page url on search load, and can be removed by components.
   */
  @property()
  localQuery = '';

  @property({type: Boolean})
  isCollapsible = false;

  @property({type: Boolean})
  startsCollapsed = false;

  /**
   * If a collapsible block is open or closed.
   */
  @state()
  optionsOpen = true;

  /**
   * Override the base Lit render root to disable shadow dom.
   *
   * @protected
   */
  protected override createRenderRoot(): HTMLElement | DocumentFragment {
    this.style.display = 'block';
    return this;
  }

  override async connectedCallback() {
    super.connectedCallback();

    this.optionsOpen = !this.startsCollapsed;

    const context = {...this.context};

    if (
      !context?.query ||
      !context?.query.has('q') ||
      context?.query.get('q')?.trim == undefined
    ) {
      const rawQuery = new URLSearchParams(window.location.search);
      if (rawQuery.has('q') && rawQuery.get('q')?.trim() != undefined) {
        this.localQuery = rawQuery.get('q') ?? '';
      }
    } else if (
      context?.query &&
      context?.query.has('q') &&
      context?.query.get('q')?.trim() != undefined
    ) {
      this.localQuery = context.query.get('q') ?? '';
    }
  }

  override render() {
    let current_query: any = undefined;
    if (
      this.context?.query &&
      this.context?.query.has('q') &&
      this.context?.query.get('q')?.trim != undefined
    ) {
      let curr = this.context?.query.get('q') ?? '';
      if (curr != undefined) {
        current_query = curr;
      }
    }

    if (current_query == undefined && this.localQuery != undefined) {
      current_query = this.localQuery;
    }

    // Determine which URLs to use: prefer Urls, fallback to blockUrls
    const urlsToUse =
      Object.keys(this.Urls).length > 0 ? this.Urls : this.blockUrls;
    const isNewFormat = Object.keys(this.Urls).length > 0;

    const urls: TemplateResult[] = [];
    Object.entries(urlsToUse).map(([title, urlData]) => {
      let url: string;
      let no_query: string | undefined;
      let description: string | undefined;
      let format: string | undefined;

      if (isNewFormat) {
        // New format: urlData is {url, no_query?, description?, format?}
        url = (urlData as any).url || '';
        no_query = (urlData as any).no_query;
        description = (urlData as any).description;
        format = (urlData as any).format;
      } else {
        // Old format: urlData is just the URL string
        url = urlData;
      }

      // Determine finalUrl: if no query, use no_query URL if available, otherwise use regular url logic
      let finalUrl: string;
      if (!current_query || current_query.trim() === '') {
        finalUrl = no_query || url;
      } else {
        finalUrl = url.includes('%placeholder%')
          ? url.replace('%placeholder%', current_query)
          : url + current_query;
      }

      if (this.isCollapsible) {
        // facet
        urls.push(
          html` <li class="facet s-box-small-v s-box-small-h result-default">
            <a href="${finalUrl}">${title}</a>
          </li>`
        );
      } else {
        urls.push(
          html` <li
            class="bento-search-result-item s-box-small-v s-box-small-h result-default"
          >
            <article>
              <h3 class="item-title t-title-small s-stack-small">
                <a href="${finalUrl}">${title}</a>
              </h3>
              ${description
                ? html` <p class="sr-only">description</p>
                    <p class="t-body-small s-stack-small">${description}</p>`
                : ''}
              ${format
                ? html` <dl class="item-fields">
                    <div class="t-label">
                      <dt class="t-bold">Item format:</dt>
                      <dd>${format}</dd>
                    </div>
                  </dl>`
                : ''}
            </article>
          </li>`
        );
      }
    });

    const collapseId = `block-more-searchers-${this.uid}`;

    return html`
      <div>
        <section
          id="${this.blockID}"
          class="bento-search s-margin-general-medium ${this.isCollapsible
            ? 'collapsible c-bg-secondary'
            : 'c-border-tertiary'} ${this.isCollapsible && !this.optionsOpen
            ? 'collapsed'
            : ''}"
          aria-labelledby="more-searchers-title-${this.uid}"
        >
          ${this.isCollapsible
            ? html`
                <button
                  class="bento-search-header collapsible c-content-primary s-box-small-v s-box-small-h ${this
                    .optionsOpen
                    ? 'open'
                    : 'closed'}"
                  aria-expanded="${this.optionsOpen}"
                  aria-controls="${collapseId}"
                  @click=${() => (this.optionsOpen = !this.optionsOpen)}
                >
                  <h2
                    id="more-searchers-title-${this.uid}"
                    class="t-title-small t-uppercase"
                  >
                    ${this.blockTitle}
                  </h2>
                  <span class="i-chevron-down" aria-hidden="true"></span>
                </button>
              `
            : html`
                <div
                  class="bento-search-header dark-theme c-bg-primary c-content-primary s-box-small-v s-box-small-h"
                >
                  ${this.blockIcon && this.blockIcon.trim() != ''
                    ? html`
                        <div
                          class="bento-search-header-icon-container"
                          aria-hidden="true"
                        >
                          <i
                            data-lucide="${this.blockIcon}"
                            class="bento-search-header-icon"
                          ></i>
                        </div>
                      `
                    : html``}
                  <h2
                    id="more-searchers-title-${this.uid}"
                    class="t-title-medium"
                  >
                    ${this.blockTitle}
                  </h2>
                </div>
              `}
          ${this.blockDescription && this.blockDescription.trim() != ''
            ? html` <p
                class="description t-label c-content-secondary c-bg-tertiary s-box-small-h"
              >
                ${this.blockDescription}
              </p>`
            : ''}
          <ul
            id="${this.isCollapsible ? collapseId : 'block-more-searchers'}"
            class="${this.isCollapsible
              ? this.optionsOpen
                ? 'open'
                : 'closed'
              : ''}"
            aria-hidden="${this.isCollapsible ? !this.optionsOpen : false}"
          >
            ${this.isCollapsible && !this.optionsOpen ? null : urls}
          </ul>
        </section>
      </div>
    `;
  }
}
