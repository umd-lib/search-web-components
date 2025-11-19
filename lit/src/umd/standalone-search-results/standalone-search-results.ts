import {ContextRoot} from '@lit/context';
import {
  StandAloneSearchContext,
  StandAloneSearchResponseType,
  StandAloneSearchResultType,
} from '../../types';
import {customElement, property, state} from 'lit/decorators.js';
import {LitElement, html, TemplateResult} from 'lit';

interface resultCollection {
  collection?: string;
}

/**
 * The root container for a component based search experience. All search components on the search page must be a child of this component to work correctly.
 */
@customElement('standalone-search-results')
export class StandAloneSearchResults extends LitElement {
  /**
   * The current search context.
   */
  @state()
  context: StandAloneSearchContext = {
    query: new URLSearchParams(window.location.search),
    responseReady: false,
    resultsCount: '5',
    response: {
      total: 0,
      page: 0,
      per_page: 0,
      no_results_link: '',
      module_link: '',
      query: '',
      endpoint: '',
      results: [],
    },
  };

  /**
   * The decoupled search api endpoint to query for results. Search query params added to this url will be used for the initial search if no search query params are present in the page url, they will also be added to the page url on search load, and can be removed by components.
   */
  @property()
  searchEndpoint = '';

  /**
   * The default number of results to show per page.
   */
  @property()
  resultsCount = '5';

  @property()
  noResultsLink = '';

  @property()
  noResultsMessage = '';

  @property()
  blockTitle = '';

  @property()
  blockDescription = '';

  @property()
  bottomLinkText = '';

  @property()
  blockIcon = '';

  @property()
  blockID = '';

  /**
   * The current context root.
   */
  root: ContextRoot = new ContextRoot();

  /**
   * Override the base Lit render root to disable shadow dom.
   *
   * @protected
   */
  protected override createRenderRoot(): HTMLElement | DocumentFragment {
    this.style.display = 'block';
    return this;
  }

  /**
   * Update link icons for bento links: use external icon when host differs.
   * recreate the same feature as the emphasized link component in UMDLIB_UMDDS.
   */
  private updateLinkIcons(): void {
    try {
      const currentLocation = window.location;
      const bentoLinks = this.querySelectorAll<HTMLAnchorElement>(
        '.bento-search .emphasized-link a'
      );

      bentoLinks.forEach((link) => {
        const linkIcon = link.querySelector('span');
        if (!linkIcon) return;
        if (link.host && link.host !== currentLocation.host) {
          linkIcon.classList.remove('i-chevron');
          linkIcon.classList.add('i-external-arrow');
        } else {
          linkIcon.classList.remove('i-external-arrow');
          linkIcon.classList.add('i-chevron');
        }
      });
    } catch (err) {
      // Non-blocking; log for debugging.
      // eslint-disable-next-line no-console
      console.error('updateLinkIcons error', err);
    }
  }

  protected override updated(_changedProps: Map<string, any>): void {
    super.updated(_changedProps);
    // Run after render to ensure DOM nodes exist.
    this.updateLinkIcons();
  }

  override async connectedCallback() {
    super.connectedCallback();

    const context = {...this.context};

    document.addEventListener('update-context', (e) => {
      //@ts-expect-error
      const queryText = decodeURIComponent(e.context.query.toString());
      const newQuery = new URLSearchParams(queryText);
      if (newQuery.has('q') && newQuery.get('q')?.trim != undefined) {
        this.getResults(newQuery);
      }
    });

    let initialQuery: URLSearchParams | undefined;
    context.resultsCount = this.resultsCount;

    // Initialize the query to empty if it's not set or if we want to ignore parameters in the url.
    if (!context.query) {
      context.query = new URLSearchParams();
    }

    // Only use the initial query if the current page doesn't have any search query parameters present.
    if (initialQuery) {
      let useInitial = true;
      const queryTags = ['q', 'per_page'];
      context.query.forEach((value, key) => {
        if (queryTags.includes(key) && value !== '') {
          useInitial = false;
        }
      });
      if (context.query.size === 0 || useInitial) {
        context.query = initialQuery;
        this.context.query = initialQuery;
      }
    }

    // Merge the current query with additional params.
    if (context.query.size == 0) {
      return;
    }
    let searchQuery = context.query;
    searchQuery.set('per_page', this.resultsCount);

    context.response = await StandAloneSearchResults.doSearch(
      this.searchEndpoint,
      searchQuery
    );
    context.responseReady = true;

    this.context = context;
    this.addEventListener('update-context', (e) => {
      //@ts-expect-error This custom event has this property but isn't registered correctly in all tooling.
      this.context = {...this.context, ...e.context};
    });
  }

  async getResults(query: URLSearchParams) {
    query.set('per_page', this.resultsCount);
    const context = {...this.context};
    context.query = query;

    // Merge the query with additional params from the search root.
    let searchQuery = query;

    const spinnerID = this.blockID + "-spinner";
    const blockIconId = this.blockID + "-block-icon";
    const spinner = document.getElementById(spinnerID);
    const icon = document.getElementById(blockIconId);
    if (spinner != undefined && icon != undefined) {
      icon.style.display = 'none';
      spinner.style.display = 'block';
    }
    try {
      [context.response] = await Promise.all([
        StandAloneSearchResults.doSearch(this.searchEndpoint, searchQuery),
      ]);

      this.context = {...context} as StandAloneSearchContext;
    } catch (error) {
      
    } finally {
      if (spinner != undefined && icon != undefined) {
        spinner.style.display = 'none';
        icon.style.display = 'block';
      }
    }

  }

  static async doSearch(url: string, query: URLSearchParams) {
    const searchQuery = new URLSearchParams(query.toString());

    let appliedCount = 0;

    // Drupal currently does not support multiple of the same key in a request
    // https://www.drupal.org/project/drupal/issues/3038774. It's easier for us
    // to support it in the url and convert the user visible url to one that
    // Drupal supports.
    for (const [key, value] of query.entries()) {
      if (!key.startsWith('f[')) {
        continue;
      }
      searchQuery.delete(key);
      let facetKey = key.replace('f[', '');
      facetKey = facetKey.substring(0, facetKey.length - 1);
      searchQuery.append(`f[${appliedCount}]`, `${facetKey}:${value}`);
      appliedCount++;
    }

    const requestUrl = new URL(url);
    requestUrl.search = searchQuery.toString();

    return StandAloneSearchResults.doFetch(requestUrl, undefined).then(
      (response: StandAloneSearchResponseType) => {
        return response;
      }
    );
  }

  static async doFetch(
    url: RequestInfo | URL,
    headerOptions: HeadersInit | undefined = undefined
  ) {
    const headers = new Headers(headerOptions);

    return fetch(url, {
      headers: headers,
      cache: 'no-store',
    })
      .then(async (response) => {
        const responseText = await response.text();

        if (!response.ok) {
          throw new Error(
            `HTTP error! Status: ${response.status}. Message:${responseText}`
          );
        }
        return Promise.resolve(JSON.parse(responseText));
      })
      .catch((error) => console.error('Error in fetching:', error));
  }

  override render() {
    const results = this.context.response.results;
    const total = this.context.response.total;
    const footer = this.bottomLinkText.replace('%total%', total.toString());

    const records: TemplateResult[] = [];
    results.forEach(function (result) {
      const record = result as StandAloneSearchResultType;
      const collection = record.extra as resultCollection;
      const title = record.title;
      const link = record.link;
      const item_format = record.item_format;
      const description = record.description;
      const author = record.author;
      const availability = record.availability;
      const date = record.date;

      records.push(html`
        <li class="bento-search-result-item s-box-small-v s-box-small-h">
          <article>
            <div class="item-detail">
              ${title
                ? html`<h3 class="item-title t-title-small">
                    ${link
                      ? html` <a href="${link}"
                          ><span class="sr-only">Title:</span>${title}
                        </a>`
                      : html`${title}`}
                  </h3>`
                : ''}
              ${description
                ? html`<p class="sr-only">description</p>
                    <p class="t-body-small s-stack-small">${description}</p>`
                : ''}
              <dl class="item-fields">
                ${item_format
                  ? html`<div class="t-label">
                      <dt class="t-bold">Item format:</dt>
                      <dd>${item_format}</dd>
                    </div>`
                  : ''}
                ${author
                  ? html`<div class="t-label">
                      <dt class="t-bold">Author:</dt>
                      <dd>${author}</dd>
                    </div>`
                  : ''}
                ${availability
                  ? html`<div class="t-label">
                      <dt class="t-bold">Availability:</dt>
                      <dd>${availability}</dd>
                    </div>`
                  : ''}
                ${date
                  ? html`<div class="t-label">
                      <dt class="t-bold">Date:</dt>
                      <dd>${date}</dd>
                    </div>`
                  : ''}
                ${collection?.collection
                  ? html`<div class="t-label">
                      <dt class="t-bold">Collection</dt>
                      <dd>${collection.collection}</dd>
                    </div>`
                  : ''}
              </dl>
            </div>
          </article>
        </li>
      `);
    });

    return html`
      <div>
        <section class="bento-search c-border-tertiary s-margin-general-medium" id="${this.blockID}">
          <div
            class="bento-search-header dark-theme c-content-primary c-bg-primary s-box-small-v s-box-small-h"
          >
            <div class="bento-search-header-icon-container" aria-hidden="true">
              <i
                id="${this.blockID}-block-icon"
                style="display: block;"
                data-lucide="${this.blockIcon}"
                class="bento-search-header-icon"
              ></i>
              <i
                id="${this.blockID}-spinner"
                style="display: none;"
                data-lucide="hourglass"
                class=bento-search-header-icon"
              ></i>
            </div>
            <h2 class="t-title-medium">
              <a
                id="${this.context.response.endpoint}"
                href="${this.noResultsLink ||
                this.context.response.no_results_link}"
                >${this.blockTitle}</a
              >
            </h2>
          </div>
          <p
            class="description t-label c-content-secondary c-bg-tertiary s-box-small-h"
          >
            ${this.blockDescription}
          </p>
          ${records.length > 0
            ? html` <ul>
                  ${records}
                </ul>
                <div class="bento-search-footer">
                  ${footer
                    ? html`<div class="s-box-small-v s-box-small-h">
                        <div class="umd-lib emphasized-link">
                          <a
                            href="${this.context.response.module_link}"
                            class="emphasized-link--text t-body-small t-interactive-sub c-content-primary c-underline-primary ani-underline"
                          >
                            <span class="i-chevron"></span>${footer}
                          </a>
                        </div>
                      </div>`
                    : ''}
                </div>`
            : html` <div class="bento-search-footer">
                ${this.noResultsMessage
                  ? html` <div class="s-box-small-v s-box-small-h">
                      <div class="umd-lib emphasized-link">
                        <a
                          href="${this.noResultsLink ||
                          this.context.response.no_results_link}"
                          class="emphasized-link--text t-body-small t-interactive-sub c-content-primary c-underline-primary ani-underline"
                        >
                          <span class="i-chevron"></span>${this
                            .noResultsMessage}
                        </a>
                      </div>
                    </div>`
                  : ''}
              </div>`}
        </section>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'standalone-search-results': StandAloneSearchResults;
  }
}
