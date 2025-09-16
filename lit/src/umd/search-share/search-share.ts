import {html, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';

/**
 * A button that copies the current URL to share the search results.
 */
@customElement('search-share')
export class SearchShare extends LitElement {
  @property()
  queryText: string = '';

  override async connectedCallback() {
    super.connectedCallback();

    document.addEventListener('update-context', (e) => {
      //@ts-expect-error This custom event has this property but isn't registered correctly in all tooling.
      this.queryText = decodeURIComponent(e.context.query.toString());
    });
  }

  override render() {
    return html`
      <button @click="${this._copySearchResults}"}>
        ${this.queryText}
      </button>
    `;
  }

  private _copySearchResults(): void {
    const url = new URL(window.location.href);
    url.searchParams.set('q', this.queryText);

    navigator.clipboard.writeText(decodeURIComponent(url.toString()));
  }
}

declare global {
  interface HTMLElementTagNameMap {
      'search-share': SearchShare;
  }
}
