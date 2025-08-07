import {LitElement} from 'lit';
import {SearchContext, SearchResponseType} from './types';
import {property, state} from 'lit/decorators.js';
import {consume} from '@lit/context';
import {searchContext} from './SearchContext';

export class BaseSearchElement extends LitElement {
  @consume({context: searchContext, subscribe: true})
  @property({attribute: false})
  context?: SearchContext;

  @state()
  uid = this.genUniqId();

  protected override createRenderRoot(): HTMLElement | DocumentFragment {
    this.style.display = 'block';
    return this;
  }

  updateContext(context: SearchContext) {
    const event = new CustomEvent('update-context', {
      bubbles: true,
      composed: true,
    });

    //@ts-expect-error This custom event has this property but isn't registered correctly in all tooling.
    event.context = context;

    this.dispatchEvent(event);
  }

  applyFacet(key: string, value: string, clearApplied = false) {
    const query = new URLSearchParams(this.context?.query?.toString());
    const queryKey = `f[${key}]`;

    if (clearApplied) {
      query.delete(queryKey);
    }

    let currentValues = query.getAll(queryKey);
    if (currentValues.includes(value)) {
      query.delete(queryKey, value);
    } else {
      query.append(queryKey, value);
    }

    query.delete('page');

    this.getResults(query);
  }

  clearFacet(key: string) {
    const query = new URLSearchParams(this.context?.query?.toString());
    const queryKey = `f[${key}]`;

    query.delete(queryKey);
    query.delete('page');

    this.getResults(query);
  }

  clearFacets() {
    const query = new URLSearchParams(this.context?.query?.toString());

    const facetKeys: string[] = [];
    query.forEach((_value, key) => {
      if (key.startsWith('f[')) {
        facetKeys.push(key);
      }
    });

    facetKeys.forEach((key) => query.delete(key));

    if (query.has('page')) {
      query.delete('page');
    }

    this.getResults(query);
  }

  async getResults(query: URLSearchParams) {
    const url = new URL(window.location.href);
    url.search = query.toString();

    const context = {...this.context};
    context.query = query;

    // Merge the query with additional params from the search root.
    let searchQuery = query;
    if (this.context?.additionalParams) {
      searchQuery = new URLSearchParams(
        new URLSearchParams(this.context.additionalParams).toString() +
          '&' +
          query.toString()
      );
    }

    [context.response] = await Promise.all([
      BaseSearchElement.doSearch(context.url ?? '', searchQuery),
    ]);

    this.context = {...context} as SearchContext;
    this.updateContext(<SearchContext>context);

    if (this.context.updateUrl) {
      window.history.pushState(null, '', url.toString());
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

    return BaseSearchElement.doFetch(requestUrl).then(
      (response: SearchResponseType) => {
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

  /**
   * Get a string safe to use as an id or class.
   */
  safeIdentifier(value: string): string {
    return value.replace(/\W/g, '-');
  }

  genUniqId(prefix: string = '') {
    return (
      (prefix ? `${prefix}-` : '') + Math.random().toString(36).slice(2, 9)
    );
  }
}
