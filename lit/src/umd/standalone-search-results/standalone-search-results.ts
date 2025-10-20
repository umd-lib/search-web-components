import {ContextRoot} from '@lit/context';
import {StandAloneSearchContext, StandAloneSearchResponseType, StandAloneSearchResultType} from '../../types';
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
    url: '',
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
    }
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
  moduleLink = '';

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

  override async connectedCallback() {
    super.connectedCallback();

    const context = {...this.context};

    let initialQuery: URLSearchParams | undefined;
    if (this.searchEndpoint) {
      const [url, query] = this.searchEndpoint.split('?');
      if (url.startsWith('/')) {
        context.url = new URL(url, document.baseURI).href;
      } else {
        context.url = url;
      }

      if (query) {
        initialQuery = new URLSearchParams(query);
      }
    }
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
      context.url ?? '',
      searchQuery
    );
    context.responseReady = true;

    this.context = context;
    this.addEventListener('update-context', (e) => {
      //@ts-expect-error This custom event has this property but isn't registered correctly in all tooling.
      this.context = {...this.context, ...e.context};
    });
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
    )
  }

  static async doFetch(
    url: RequestInfo | URL,
    headerOptions: HeadersInit | undefined = undefined,
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
        <ul>
          ${title ? html`<li>${title}</li>` : ''}
          ${link ? html`<li>${link}</li>` : ''}
          ${item_format ? html`<li>${item_format}</li>` : ''}
          ${description ? html`<li>${description}</li>` : ''}
          ${author ? html`<li>${author}</li>` : ''}
          ${availability ? html`<li>${availability}</li>` : ''}
          ${date ? html`<li>${date}</li>` : ''}
          ${collection.collection ? html`<li>${collection.collection}</li>` : ''}
          <hr />
        </ul>
      `);
    });

    if (records.length > 0) {
      return html`
        <div>
          ${records}
          <p>${this.moduleLink || this.context.response.module_link}</p>
        </div>
      `;
    } else {
      return html`
        <div>
          <p>No Results</p>
          <p>${this.noResultsLink || this.context.response.no_results_link}</p>
        </div>`;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'standalone-search-results': StandAloneSearchResults;
  }
}