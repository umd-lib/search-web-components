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
  placeHolderText = '';

  /**
   * The text for the submit button.
   */
  @property()
  labelText = '';

  /**
   * The text for the clear input button.
   */
  @property()
  clearText = 'Remove';

  /**
   * Handles replacing the current query with a new query containing only the new keyword input.
   *
   * @param event The form submit event.
   */
//   _dateQuery(event: SubmitEvent) {
//     event.preventDefault();
//     const fromField: HTMLInputElement | null = this.querySelector('input#date-from');
//     const toField: HTMLInputElement | null = this.querySelector('input#date-to');

//     const fromDate: string | undefined = fromField?.value.trim();
//     let toDate: string | undefined = toField?.value.trim();
  _dateQuery(
    fromDate: string,
    toDate: string
  ): void {
    const hasFrom = this._isValidYear(fromDate);
    const hasTo = this._isValidYear(toDate);
    if (this.context != undefined) {
        this.context.dateFrom = fromDate ?? undefined;
        this.context.dateTo = toDate ?? undefined;
    }

    let queryVal = '';
    if (!hasFrom && !hasTo) {
      this.clearFacet('date');
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

    this.applyFacet('date', queryVal, true);

  }

  
  _isValidYear(val: string | undefined) {
    if (val == undefined || val.trim() == '' || val.length > 4) {
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
  //    <form class="date-ranger" id="date-ranger-form-${this.uid}" @submit="${this._dateQuery}">

  override render() {
    const statusId = `date-ranger-${this.uid}`;
    return html`
      <div
        class="search-sort c-bg-secondary s-margin-general-medium s-box-small-v s-box-small-h"
        role="region"
        aria-labelledby="date-ranger-${this.uid}"
      >
        <div
          id="date-ranger-${this.uid}"
          class="sort-title t-title-small t-uppercase s-stack-medium c-content-primary"
        >
          Year Range
        </div>
        <div
          id="${statusId}"
          class="sr-only"
          aria-live="polite"
          aria-atomic="true"
        >
          Year Range Filter Form
        </div>
      <form class="date-ranger" id="date-ranger-form-${this.uid}" aria-describedby="${statusId}">
        <span>
          <div>Year From:</div>
          <input
            class="date-from-input"
            id="date-from-${this.uid}"
            name="date-from"
            type="text"
            .value="${this?.context?.dateFrom ?? ''}"
            placeholder="${this.placeHolderText}"
          />
          <div>Year To:</div>
          <input
            class="date-to-input"
            id="date-to-${this.uid}"
            name="date-to"
            type="text"
            .value="${this?.context?.dateTo ?? ''}"
            placeholder="${this.placeHolderText}"
          />
        </span>
        <button
          type="submit"
          class="umd-lib button secondary"
          @click=${(e: Event) => {
            e.preventDefault();
            const from_date =
              (
                document.getElementById(`date-from-${this.uid}`) as HTMLSelectElement
              )?.value ?? '';
            const to_date =
              (
                document.getElementById(`date-to-${this.uid}`) as HTMLSelectElement
              )?.value ?? '';
            this._dateQuery(from_date, to_date);
          }}
        >
          Submit
        </button>
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