import {customElement, property} from 'lit/decorators.js';
import {BaseSearchElement} from '../BaseSearchElement';
import {html} from 'lit/static-html.js';
import {TemplateResult} from 'lit';

/**
 * A simple search pager that can display the current page, previous and next pages, previous and next buttons, first and last page buttons.
 */
@customElement('search-simple-pager')
export class SearchSimplePager extends BaseSearchElement {
  /**
   * The text to display for the previous button.
   */
  @property()
  prevLabel = '<';

  /**
   * The text to display for the next button.
   */
  @property()
  nextLabel = '>';

  /**
   * If the next and previous buttons should be shown.
   */
  @property({type: Boolean})
  showNextPrev = false;

  /**
   * If the first and last buttons should be shown
   */
  @property({type: Boolean})
  showFirstLast = false;

  /**
   * The text to display for the first page button.
   */
  @property()
  firstLabel = 'First page';

  /**
   * The text to display for the last page button.
   */
  @property()
  lastLabel = 'Last page';

  /**
   * Number of pages to display on either side of the current page.
   */
  @property({type: Number})
  pagesToDisplay?: number = undefined;

  /**
   * Number of pages to display to the left/right of the first/last page if different then pagesToDisplay.
   */
  @property({type: Number})
  firstLastPagesToDisplay: number = 0;

  /**
   * Update the current query with a new page
   *
   * @param newPage The page to go to.
   */
  _changePage(newPage: number): void {
    const query = new URLSearchParams(this.context?.query?.toString() ?? '');

    if (newPage !== 0) {
      query.set('page', '' + newPage);
    } else {
      query.delete('page');
    }

    this.getResults(query);
  }

  /**
   * Get the element to display the current page.
   */
  _getCurrentPageElement() {
    const currentPage = this.context?.response?.search_results_page ?? 0;

    return html`<button class="page current" aria-pressed="true">
      ${currentPage + 1}
    </button>`;
  }

  _getPrevNextButtonElement(
    label: string | number,
    goto: number,
    classes: string,
    disabled: boolean,
    direction: 'prev' | 'next'
  ) {
    return html`
      <button
        class=${classes}
        ?disabled=${disabled}
        @click=${() => this._changePage(goto)}
        aria-label=${disabled
          ? `${label} page button disabled`
          : `Go to ${label} page`}
      >
        ${direction === 'next'
          ? html`${label}<span class="i-chevron"></span>`
          : html`<span class="i-chevron"></span>${label}`}
      </button>
    `;
  }

  /**
   * Get pages to display before and after the current page.
   */
  _getWrappingPagesElements(): {
    prev: TemplateResult[];
    next: TemplateResult[];
  } {
    const prevPages = [];
    const nextPages = [];
    const currentPage = this.context?.response?.search_results_page ?? 0;
    const maxPage = this.context?.response?.search_results_pages ?? 0;
    const pagesToDisplay =
      (this.firstLastPagesToDisplay &&
      (currentPage === 0 || currentPage === maxPage - 1)
        ? this.firstLastPagesToDisplay
        : this.pagesToDisplay) ?? 0;

    for (let p = 1; p <= pagesToDisplay; p++) {
      if (currentPage - p >= 0) {
        prevPages.unshift(
          this._getPrevNextButtonElement(
            currentPage - p + 1,
            currentPage - p,
            'prev page',
            false,
            'prev'
          )
        );
      }

      if (currentPage + p < maxPage) {
        nextPages.push(
          this._getPrevNextButtonElement(
            currentPage + p + 1,
            currentPage + p,
            'next page',
            false,
            'next'
          )
        );
      }
    }

    return {prev: prevPages, next: nextPages};
  }

  /**
   * Get the next, previous, first, last button elements.
   */
  _getWrappingButtonElements(): {
    prev: TemplateResult;
    next: TemplateResult;
    first: TemplateResult;
    last: TemplateResult;
  } {
    const currentPage = this.context?.response?.search_results_page ?? 0;
    const maxPages = this.context?.response?.search_results_pages ?? 0;

    const prev = html` ${this.showNextPrev
      ? this._getPrevNextButtonElement(
          this.prevLabel,
          currentPage - 1,
          'prev button umd-lib secondary',
          currentPage === 0,
          'prev'
        )
      : null}`;

    const next = html` ${this.showNextPrev
      ? this._getPrevNextButtonElement(
          this.nextLabel,
          currentPage + 1,
          'next button umd-lib secondary',
          currentPage === maxPages - 1,
          'next'
        )
      : null}`;

    const first = html` ${this.showFirstLast
      ? html`<button
          class="first button"
          @click=${() => this._changePage(0)}
          ?disabled=${currentPage === 0}
        >
          ${this.firstLabel}
        </button>`
      : null}`;

    const last = html` ${this.showFirstLast
      ? html`<button
          class="last button"
          @click=${() => this._changePage(maxPages - 1)}
          ?disabled=${currentPage === maxPages - 1}
        >
          ${this.lastLabel}
        </button>`
      : null}`;

    return {
      next: next,
      prev: prev,
      first: first,
      last: last,
    };
  }

  /**
   * Get the result pagination elements.
   */
  _getResultPaginationElements(): TemplateResult {
    const currentPage = this.context?.response?.search_results_page ?? 0;
    const maxPages = this.context?.response?.search_results_pages ?? 0;

    return html`
      <div>
        <span class="sr-only"
          >Page navigation: Enter page number, currently on page
          ${currentPage + 1} of ${maxPages}</span
        >
        <label for="results-pagination" aria-hidden="true" class="t-body-small"
          >Go to page</label
        >
        <input
          class="t-interactive c-border-secondary c-content-primary"
          type="number"
          id="results-pagination"
          name="page"
          min="1"
          max="${maxPages}"
          value="${currentPage + 1}"
          aria-label="Enter page number, from 1 to ${maxPages}"
        />
        <span aria-hidden="true" class="t-body-small">of ${maxPages}</span>
        <button
          @click=${() => {
            const input = this.renderRoot.querySelector<HTMLInputElement>(
              '#results-pagination'
            );
            const value = input ? parseInt(input.value, 10) : currentPage + 1;
            if (!isNaN(value) && value >= 1 && value <= maxPages) {
              this._changePage(value - 1);
            }
          }}
          aria-label="Go to page number entered in the input box"
          class="umd-lib button"
        >
          Go
        </button>
      </div>
    `;
  }

  override render() {
    if (
      this.context === undefined ||
      !this.context.responseReady ||
      this.context.response?.search_results_pages === 1
    ) {
      return;
    }

    const wrappingButtons = this._getWrappingButtonElements();

    return html`
      <nav class="pager" aria-label="Result navigation">
        <div
          class="pagination__status t-body-small s-stack-small"
          id="page-context"
        >
          Currently on Page
          ${typeof this.context?.response?.search_results_page === 'number'
            ? this.context.response.search_results_page + 1
            : 0}
          of
          ${typeof this.context?.response?.search_results_pages === 'number'
            ? this.context.response.search_results_pages
            : 0}
        </div>
        <div class="pagination__actions">
          <ul class="pagination__action buttons">
            <li>${wrappingButtons.prev}</li>
            <li>${wrappingButtons.next}</li>
          </ul>
          <div class="pagination__action go-to-result-page">
            ${this._getResultPaginationElements()}
          </div>
        </div>
      </nav>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'search-simple-pager': SearchSimplePager;
  }
}
