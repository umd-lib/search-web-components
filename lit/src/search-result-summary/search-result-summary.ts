import {html, TemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {BaseSearchElement} from '../BaseSearchElement';

export interface SearchResultsCounts {
  start: number;
  end: number;
  total: number;
}

/**
 * Displays the start, end, total, searchQuery, or time taken for the current search page.
 */
@customElement('search-result-summary')
export class SearchResultSummary extends BaseSearchElement {
  /**
   * The text to display. `@start`,`@end`,`@total`,`@searchQuery`,`@time`(in seconds) tokens are available and will be replaced with the values from the search.
   */
  @property()
  summaryText = '@start - @end of @total';

  /**
   * Returns the start, end, and total numbers for the current search page.
   */
  _getNumbers(): SearchResultsCounts {
    const currentPage = this.context?.response?.search_results_page ?? 0;
    const limit = parseInt(
      (this.context?.response?.search_results_per_page
        ? this.context?.response.search_results_per_page
        : this.context?.defaultPerPage) as string
    );
    const total = this.context?.response?.search_results_count as number;
    const offset = currentPage * limit;

    const result: SearchResultsCounts = {
      start: 0,
      end: 0,
      total: total,
    };

    if (total === 0) {
      result.start = 0;
    } else {
      result.start = currentPage * limit + 1;
    }

    const max = +offset + limit;
    result.end = max > total ? total : max;

    return result;
  }

  /**
   * Get the summary element.
   */
  _getSummaryElement(): TemplateResult {
    const nums = this._getNumbers();

    const time = this.context?.response?.took
      ? this.context?.response?.took / 1000
      : '';

    const result = this.summaryText
      .replaceAll('@start', 'Showing ' + nums.start)
      .replaceAll('@end', '' + nums.end)
      .replaceAll(
        '@total',
        '' + nums.total + (nums.total === 1 ? ' result' : ' results')
      )
      .replaceAll('@searchQuery', this.context?.query?.get('q') ?? '')
      .replaceAll('@time', '' + time);

    return html`${result}`;
  }

  override render() {
    if (!this.context?.response) {
      return null;
    }

    return html`<div>${this._getSummaryElement()}</div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'search-result-summary': SearchResultSummary;
  }
}
