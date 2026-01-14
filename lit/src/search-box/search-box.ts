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

  @property()
  current_query = '';

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

  override async connectedCallback() {
    super.connectedCallback();
    if (!this.context?.query) {
      return;
    }
    if (
      this.context?.query.has('q') &&
      this.context?.query.get('q')?.trim != undefined
    ) {
      let curr = this.context?.query.get('q') ?? '';
      if (curr != undefined) {
        this.current_query = curr;
      }
    }
  }

  /**
   * Handles submitting the query to the api endpoint.
   *
   * @param e The form submit event.
   */
  _submit(e: SubmitEvent): void {
    e.preventDefault();

    if (e.currentTarget instanceof Element) {
      const value = e?.currentTarget?.querySelector('input')?.value?.trim();
      this.current_query = value || '';

      if (this.context?.query != undefined) {
        const query = this.context?.query;
        query.set('q', value || '');
        this.getResults(query);
      } else {
        const query = new URLSearchParams();
        query.set('q', value || '');
        this.getResults(query);
      }
    }
  }

  override render() {
    return html`
      <search>
        <form id="swc-search-box"
          class="search-box s-box-large-h s-box-medium-v c-bg-secondary s-margin-general-medium"
          @submit="${(e: SubmitEvent) => this._submit(e)}"
        >
          <h2 class="t-title-small t-uppercase s-stack-small">
            ${this.componentLabelText}
          </h2>
          <div class="search-box-action-area c-bg-secondary">
            <input
              class="search-box-input t-body-medium c-content-primary c-bg-secondary"
              type="text"
              placeholder="${this.placeHolderText}"
              aria-label="${this.ariaLabelText}"
              value="${this.current_query}"
              id="search-box-input"
              name="search-box-input"
            ></input>
            <button class="search-box-submit" type="submit">
              <div class="sr-only">${this.submitText}</div>
            </button>
          </div>
        </form>
      </search>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'search-box': SearchBox;
  }
}
