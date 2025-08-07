import {html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {BaseSearchElement} from '../BaseSearchElement';

/**
 * A search input that can be placed on a search page to allow a user to search fulltext fields from an index.
 */
@customElement('search-input')
export class SearchInput extends BaseSearchElement {
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
  _querySearch(event: SubmitEvent) {
    event.preventDefault();

    const input: HTMLInputElement | null = this.querySelector('input');
    const value: string | undefined = input?.value.trim();

    const query = new URLSearchParams();
    if (value) {
      query.set('q', value);
    } else {
      query.delete('q');
    }

    this.getResults(query);
  }

  _clearSearch() {
    const query = new URLSearchParams();

    this.getResults(query);
  }

  override render() {
    return html`
      <form class="search-input" @submit="${this._querySearch}">
        <span>
          <input
            class="search-input-input"
            type="text"
            .value="${this?.context?.query?.get('q') ?? ''}"
            placeholder="${this.placeHolderText}"
          />
          ${this?.context?.query?.get('q')
            ? html`<button
                class="search-input-clear"
                type="button"
                @click=${() => {
                  this._clearSearch();
                }}
              >
                ${this.clearText}
              </button>`
            : null}
        </span>
        <button class="search-input-submit" type="submit">
          ${this.labelText}
        </button>
      </form>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'search-input': SearchInput;
  }
}
