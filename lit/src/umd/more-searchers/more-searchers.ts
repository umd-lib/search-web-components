import {customElement, property} from 'lit/decorators.js';
import { BaseSearchElement } from '../../BaseSearchElement';
import {html, TemplateResult} from 'lit';

/**
 * The root container for a component based search experience. All search components on the search page must be a child of this component to work correctly.
 */
@customElement('more-searchers')
export class MoreSearchers extends BaseSearchElement {

  @property()
  blockTitle = '';

  @property()
  blockDescription = '';

  @property({type: Object})
  blockUrls: {
    title?: string;
    [key: string]: any;
  } = {};

  @property()
  blockIcon = '';

  /**
   * Override the base Lit render root to disable shadow dom.
   *
   * @protected
   */
  protected override createRenderRoot(): HTMLElement | DocumentFragment {
    this.style.display = 'block';
    return this;
  }

  override render() {
    let current_query: any = undefined;
    if (
      this.context?.query &&
      this.context?.query.has('q') &&
      this.context?.query.get('q')?.trim != undefined
    ) {
      let curr = this.context?.query.get('q') ?? '';
      if (curr != undefined) {
        current_query = curr;
      }
    }

    const urls: TemplateResult[] = [];
    Object.entries(this.blockUrls)
      .map(([title, url]) => {
        urls.push(
        html`
          <li class="bento-search-result-item s-box-small-v s-box-small-h
                           result-default">
            <h3 class="item-title t-title-small s-stack-small">
              <a href="${url}${current_query}">${title}</a>
            </h3>
          </li>`);
      });

    return html`
      <div>
        <section class="bento-search c-border-tertiary s-margin-general-medium">
          <div
            class="bento-search-header dark-theme c-content-primary c-bg-primary s-box-small-v s-box-small-h"
          >
            <div class="bento-search-header-icon-container" aria-hidden="true">
              <i
                data-lucide="${this.blockIcon}"
                class="bento-search-header-icon"
              ></i>
            </div>
            <h2 class="t-title-medium">
              ${this.blockTitle}
            </h2>
          </div>
          <p
            class="description t-label c-content-secondary c-bg-tertiary s-box-small-h"
          >
            ${this.blockDescription} 
          </p>
          <ul id="block-more-searchers">
            ${urls}
          </ul>
        </section>
      </div>
    `;
  }
}