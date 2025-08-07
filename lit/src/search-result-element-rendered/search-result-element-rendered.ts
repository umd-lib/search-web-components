import {html} from 'lit';
import {property, customElement} from 'lit/decorators.js';
import {BaseSearchElement} from '../BaseSearchElement';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';

/**
 * A result render element that renders an HTML field from the result.
 */
@customElement('search-result-element-rendered')
export class SearchResultElementRendered extends BaseSearchElement {
  /**
   * The settings for this element type. This should contain a `key` property with the name of the field to render HTML from.
   */
  @property({type: Object})
  settings: {
    field?: string;
    [key: string]: any;
  } = {};

  /**
   * The result data.
   */
  @property({type: Object})
  data: {[key: string]: any} = {};

  override render() {
    if (
      !this?.settings?.field ||
      !this.data ||
      !this.data[this?.settings?.field]
    ) {
      return null;
    }

    return html`${unsafeHTML(this.data[this?.settings.field])}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'search-result-element-rendered': SearchResultElementRendered;
  }
}
