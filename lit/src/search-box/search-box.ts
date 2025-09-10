import {html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {BaseSearchElement} from '../BaseSearchElement';

/**
 * A simple search box that can be placed in the header or other parts of a site to allow a user to search and be redirected to a search page.
 */
@customElement('search-box')
export class SearchBox extends BaseSearchElement {
  /**
   * The absolute or relative url of the page to redirect the search query to.
   */
  @property({attribute: true})
  url = '';

  /**
   * The text for the submit button.
   */
  @property({attribute: true})
  submitText = 'Search';

  /**
   * The aria label text for the input field.
   */
  @property({attribute: true})
  ariaLabelText = '';

  /**
   * The placeholder text for the input field.
   */
  @property({attribute: true})
  placeHolderText = '';

  /**
   * The component label text for the search box.
   */
  @property({attribute: true})
  componentLabelText = '';

  protected override createRenderRoot(): HTMLElement | DocumentFragment {
    this.style.display = 'block';
    return this;
  }

  /**
   * Customized submit to submit POST requests to the api endpoint with the query.
   *
   * @param e The form submit event.
   */
  _submit(e: SubmitEvent): void {
    e.preventDefault();

    if (e.currentTarget instanceof Element) {
      const value = e?.currentTarget?.querySelector('input')?.value?.trim();

      const query = new URLSearchParams();
      query.set('q', value || '');

      this.getResults(query, 'POST');
    }
  }

  override render() {
    return html`
      <form class="search-box" @submit="${(e: SubmitEvent) => this._submit(e)}">
        <h2> ${this.componentLabelText} </h2>
        <input
          class="search-box-input"
          type="text"
          placeholder="${this.placeHolderText}"
          aria-label="${this.ariaLabelText}"
        />
        <button class="search-box-submit" type="submit">
          ${this.submitText}
        </button>
      </form>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'search-box': SearchBox;
  }
}
