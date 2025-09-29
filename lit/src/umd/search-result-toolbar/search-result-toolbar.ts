import {html} from 'lit';
import {customElement} from 'lit/decorators.js';
import {BaseSearchElement} from '../../BaseSearchElement.js';

import '../search-share/search-share.js';
import '../../search-result-summary/search-result-summary.js';

@customElement('search-result-toolbar')
export class SearchResultToolbar extends BaseSearchElement {
  override render() {
    return html`
      <div class="search-result-toolbar s-margin-general-medium">
        <search-result-summary></search-result-summary>
        <search-share></search-share>
      </div>
    `;
  }
}
