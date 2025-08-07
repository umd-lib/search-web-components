import {customElement} from 'lit/decorators.js';
import {BaseSearchElement} from '../BaseSearchElement';

/**
 * A container that only displays its children when the search returns no results.
 */
@customElement('search-no-results-message')
export class SearchNoResultsMessage extends BaseSearchElement {
  protected override createRenderRoot(): HTMLElement | DocumentFragment {
    this.style.display = 'none';
    return this;
  }

  override render() {
    if (!this.context?.responseReady) {
      return null;
    }

    const results = this.context?.response?.search_results_count;

    if (results) {
      this.classList.add('no-results-hidden');
      this.classList.remove('no-results-visible');
      this.style.setProperty('display', 'none');
    } else {
      this.classList.add('no-results-visible');
      this.classList.remove('no-results-hidden');
      this.style.removeProperty('display');
    }

    return '';
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'search-no-results-message': SearchNoResultsMessage;
  }
}
