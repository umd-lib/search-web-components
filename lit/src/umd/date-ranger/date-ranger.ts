import {html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import BaseFacetElement from '../../BaseFacetElement';

/**
 * A search input that can be placed on a search page to allow a user to search fulltext fields from an index.
 */
@customElement('date-ranger')
export class DateRanger extends BaseFacetElement {
  /**
   * The placeholder text for the input field.
   */
  @property()
  placeHolderFromText = '';
  @property()
  placeHolderToText = '';

  /**
   * The text for the submit button.
   */
  @property()
  submitButton = '';

  /**
   * The title for the block.
   */
  @property()
  labelText = '';

  /**
   * Which Search API facet field to query
   */
  @property()
  facetField = '';

  // Add error handling for invalid year inputs
  @property({type: Boolean})
  private hasError = false;

  @property()
  private errorMessage = '';

  /**
   * Handles replacing the current query with a new query containing only the new keyword input.
   *
   * @param event The form submit event.
   */
  _dateQuery(fromDate: string, toDate: string): void {
    const hasFrom = this._isValidYear(fromDate);
    const hasTo = this._isValidYear(toDate);

    // Validate date range
    if (!this._validateDateRange(fromDate, toDate)) {
      return;
    }

    if (this.context != undefined) {
      this.context.dateFrom = fromDate ?? undefined;
      this.context.dateTo = toDate ?? undefined;
    }

    let queryVal = '';
    if (!hasFrom && !hasTo) {
      this.clearFacet(this.facetField);
      return;
    }

    if (hasFrom && !hasTo) {
      queryVal = fromDate;
    } else if (!hasFrom && hasTo) {
      queryVal = toDate;
    } else {
      const fromDateNum = Number(fromDate);
      const toDateNum = Number(toDate);

      queryVal = `[${fromDate} TO ${toDate}]`;
      if (fromDateNum > toDateNum) {
        queryVal = `[${toDate} TO ${fromDate}]`;
      }
    }

    this.applyFacet(this.facetField, queryVal, true);
  }

  _isValidYear(val: string | undefined) {
    if (val == undefined || val.trim() == '' || val.trim().length !== 4) {
      return false;
    }
    return !isNaN(Number(val)) && val.trim() !== '';
  }

  /** inheritdoc */
  override applyFacet(
    key: string,
    value: string,
    clearApplied: boolean = false
  ) {
    if (value) {
      super.applyFacet(key, value, clearApplied);
    } else {
      this.clearFacet(key);
    }
  }

  _clearSearch() {
    const query = new URLSearchParams();

    this.getResults(query);
  }

  // Year range validation
  _validateDateRange(fromDate: string, toDate: string): boolean {
    const hasFrom = this._isValidYear(fromDate);
    const hasTo = this._isValidYear(toDate);

    // Reset error state
    this.hasError = false;
    this.errorMessage = '';

    // If both dates exist, check range
    if (hasFrom && hasTo) {
      const fromNum = Number(fromDate);
      const toNum = Number(toDate);

      if (toNum < fromNum) {
        this.hasError = true;
        this.errorMessage =
          'End year must be equal to or greater than start year.';
        return false;
      }
    }

    return true;
  }

  // Clear the date filter both from context and facet
  _clearDateFilter() {
    // Clear error state
    this.hasError = false;
    this.errorMessage = '';

    // Clear context values
    if (this.context != undefined) {
      this.context.dateFrom = undefined;
      this.context.dateTo = undefined;
    }

    let inputzFrom = document.getElementById(
      `date-from-${this.uid}`
    ) as HTMLInputElement;
    let inputzTo = document.getElementById(
      `date-to-${this.uid}`
    ) as HTMLInputElement;
    if (inputzFrom) {
      inputzFrom.value = '';
    }
    if (inputzTo) {
      inputzTo.value = '';
    }

    this.clearFacet(this.facetField);
  }

  // check if the date filter is active
  _hasActiveFilter(): boolean {
    return !!(this.context?.dateFrom || this.context?.dateTo);
  }

  override render() {
    return html`
      <div
        class="search-sort c-bg-secondary s-margin-general-medium s-box-small-v s-box-small-h${this._hasActiveFilter()
          ? ' active'
          : ''}"
        role="region"
        aria-labelledby="date-ranger-title-${this.uid}"
      >
        <div class="s-stack-medium">
          <h2
            id="date-ranger-title-${this.uid}"
            class="sort-title t-title-small t-uppercase c-content-primary"
          >
            ${this.labelText} <span class="sr-only">Filter</span>
          </h2>
        </div>
        ${this.hasError
          ? html`
              <div
                id="date-error-${this.uid}"
                class="error-message s-stack-medium"
                role="alert"
                aria-live="polite"
              >
                ${this.errorMessage}
              </div>
            `
          : ''}
        <form
          class="date-ranger"
          id="date-ranger-form-${this.uid}"
          aria-labelledby="date-ranger-title-${this.uid}"
        >
          <div class="date-input-group s-stack-medium">
            <div class="date-input-item s-stack-small">
              <label
                for="date-from-${this.uid}"
                class="t-label c-content-primary"
                >From year</label
              >
              <input
                class="date-from-input c-bg-secondary"
                id="date-from-${this.uid}"
                name="date-from"
                type="text"
                .value="${this?.context?.dateFrom ?? ''}"
                placeholder="${this.placeHolderFromText}"
                aria-describedby="date-format-hint-${this.uid}"
                inputmode="numeric"
                pattern="[0-9]{4}"
                maxlength="4"
              />
            </div>

            <div class="date-input-item s-stack-small">
              <label for="date-to-${this.uid}" class="t-label c-content-primary"
                >To year</label
              >
              <input
                class="date-to-input c-bg-secondary"
                id="date-to-${this.uid}"
                name="date-to"
                type="text"
                .value="${this?.context?.dateTo ?? ''}"
                placeholder="${this.placeHolderToText}"
                aria-describedby="date-format-hint-${this.uid}"
                inputmode="numeric"
                pattern="[0-9]{4}"
                maxlength="4"
              />
            </div>
          </div>
          <div id="date-format-hint-${this.uid}" class="sr-only">
            Enter years as four digits, for example 1942 to 1955.
          </div>
          <div class="button-group">
            <button
              type="button"
              class="clear-button t-label c-content-primary"
              aria-label="Clear date filter"
              @click=${() => this._clearDateFilter()}
            >
              Clear
            </button>
            <button
              type="submit"
              class="umd-lib button secondary"
              @click=${(e: Event) => {
                e.preventDefault();
                const from_date =
                  (
                    document.getElementById(
                      `date-from-${this.uid}`
                    ) as HTMLInputElement
                  )?.value ?? '';
                const to_date =
                  (
                    document.getElementById(
                      `date-to-${this.uid}`
                    ) as HTMLInputElement
                  )?.value ?? '';
                this._dateQuery(from_date, to_date);
              }}
            >
              ${this.submitButton}
            </button>
          </div>
        </form>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'date-ranger': DateRanger;
  }
}
