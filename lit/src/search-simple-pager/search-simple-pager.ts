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

    this.getResults(query, 'POST');
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

  _getPrevNextButtonElement(label: string|number, goto: number, classes: string, disabled: boolean) {
    return html`
    <button
      class=${classes}
      ?disabled=${disabled}
      @click=${() => this._changePage(goto)}
    >
      ${label}
    </button>`;
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
            "prev page",
            false
          )
        );
      }

      if (currentPage + p < maxPage) {
        nextPages.push(
          this._getPrevNextButtonElement(
            currentPage + p + 1,
            currentPage + p,
            "next page",
            false
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
        "prev button",
        currentPage === 0
      ) : null}`;

    const next = html` ${this.showNextPrev
      ? this._getPrevNextButtonElement(
        this.nextLabel,
        currentPage + 1,
        "next button",
        currentPage === maxPages - 1
      ) : null}`;

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

  override render() {
    if (
      this.context === undefined ||
      !this.context.responseReady ||
      this.context.response?.search_results_pages === 1
    ) {
      return;
    }

    const wrappingPages = this._getWrappingPagesElements();
    const wrappingButtons = this._getWrappingButtonElements();

    return html`
      <div class="pager">
        ${wrappingButtons.first} ${wrappingButtons.prev}
        ${wrappingPages.prev.length > 0 ? wrappingPages.prev : null}
        ${this._getCurrentPageElement()}
        ${wrappingPages.next.length > 0 ? wrappingPages.next : null}
        ${wrappingButtons.next} ${wrappingButtons.last}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'search-simple-pager': SearchSimplePager;
  }
}
