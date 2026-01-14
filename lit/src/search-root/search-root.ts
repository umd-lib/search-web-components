import {ContextRoot, provide} from '@lit/context';
import {SearchContext} from '../types';
import {searchContext} from '../SearchContext';
import {customElement, property, state} from 'lit/decorators.js';
import {LitElement} from 'lit';
import {BaseSearchElement} from '../BaseSearchElement';

/**
 * The root container for a component based search experience. All search components on the search page must be a child of this component to work correctly.
 */
@customElement('search-root')
export class SearchRoot extends LitElement {
  /**
   * The current search context.
   */
  @provide({context: searchContext})
  @state()
  context: SearchContext = {
    url: '',
    query: new URLSearchParams(window.location.search),
    responseReady: false,
    defaultPerPage: '10',
    updateUrl: true,
    resultDisplay: 'list',
    additionalParams: '',
    dialogOpen: false,
    dialogBreakpoint: 0,
    thirdPartySettings: {},
  };

  /**
   * The decoupled search api endpoint to query for results. Search query params added to this url will be used for the initial search if no search query params are present in the page url, they will also be added to the page url on search load, and can be removed by components.
   */
  @property()
  url = '';

  /**
   * A valid search query parameter string starting with '?'. These parameters will be added to all searches but will not be added to the page url.
   */
  @property()
  additionalParams = '';

  /**
   * The default number of results to show per page.
   */
  @property()
  defaultPerPage = '10';

  /**
   * The default result display.
   */
  @property()
  defaultResultDisplay: 'list' | 'grid' | string = 'list';

  @property()
  dateWidgetFacetField = "date";

  /**
   * When set the page url is not updated with search query parameters.
   */
  @property({type: Boolean})
  noPageUrlUpdate = false;

  /**
   * The maximum screen width where the search-dialog-pane/button will act as a toggle. Set -1 to always apply.
   */
  @property({type: Number})
  dialogBreakpoint = -1;

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
    if (this.url) {
      const [url, query] = this.url.split('?');
      if (url.startsWith('/')) {
        context.url = new URL(url, document.baseURI).href;
      } else {
        context.url = url;
      }

      if (query) {
        initialQuery = new URLSearchParams(query);
      }
    }
    context.defaultPerPage = this.defaultPerPage;
    context.resultDisplay = this.defaultResultDisplay;
    context.dialogBreakpoint = this.dialogBreakpoint;
    const dateFacet = this.dateWidgetFacetField ? 'f[' + this.dateWidgetFacetField + ']' : undefined;

    if (this.noPageUrlUpdate) {
      context.updateUrl = false;
    }

    // Initialize the query to empty if it's not set or if we want to ignore parameters in the url.
    if (!context.query || this.noPageUrlUpdate) {
      context.query = new URLSearchParams();
    }

    // Only use the initial query if the current page doesn't have any search query parameters present.
    if (initialQuery) {
      let useInitial = true;
      const queryTags = ['q', 'page', 'limit', 'sort', 'order'];
      context.query.forEach((value, key) => {
        if ((queryTags.includes(key) && value !== '') || key.startsWith('f[')) {
          useInitial = false;
        }
      });
      if (context.query.size === 0 || useInitial) {
        context.query = initialQuery;
        this.context.query = initialQuery;
      }
    }

    // Merge the current query with additional params.
    context.additionalParams = this.additionalParams;
    let searchQuery = context.query;
    if (this.additionalParams) {
      searchQuery = new URLSearchParams(
        new URLSearchParams(this.additionalParams).toString() +
          '&' +
          searchQuery.toString()
      );
    }

    // Pluck date facet for date widget.
    if (dateFacet != undefined) {
      const date_check = context.query;
      date_check.forEach((value, key) => {
        if (value != undefined && value != '' && key.includes(dateFacet)) {
          if (value.includes(" TO ")) {
            let date_array = value.split(" TO ", 2);
            context.dateFrom = date_array[0].replace('[', '');
            context.dateTo = date_array[1].replace(']', '');
          } else {
            context.dateFrom = value;
          }
        }
      })
    }

    context.response = await BaseSearchElement.doSearch(
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
}

declare global {
  interface HTMLElementTagNameMap {
    'search-root': SearchRoot;
  }
}
