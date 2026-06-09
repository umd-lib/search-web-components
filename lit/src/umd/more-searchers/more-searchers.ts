import {customElement, property} from 'lit/decorators.js';
import { BaseSearchElement } from '../../BaseSearchElement';
import {html, TemplateResult} from 'lit';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';

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

  @property({type: Object})
  Urls: {
    [title: string]: {
      url: string;
      no_query?: string;
      description?: string;
      format?: string;
    }
  } = {};

  @property()
  blockIcon = '';

  @property()
  blockID = '';

  /**
   * The decoupled search api endpoint to query for results. Search query params added to this url will be used for the initial search if no search query params are present in the page url, they will also be added to the page url on search load, and can be removed by components.
   */
  @property()
  localQuery = '';

  @property()
  isCollapsible = false;

  @property()
  startsCollapsed = false;

  /**
   * Override the base Lit render root to disable shadow dom.
   *
   * @protected
   */
  protected override createRenderRoot(): HTMLElement | DocumentFragment {
    this.style.display = 'block';
    return this;
  }

  override async connectedCallback() {
    super.connectedCallback();

    const context = {...this.context};

    if (!context?.query || !context?.query.has('q') || context?.query.get('q')?.trim == undefined) {
      const rawQuery = new URLSearchParams(window.location.search);
      if (rawQuery.has('q') && rawQuery.get('q')?.trim() != undefined) {
        this.localQuery = rawQuery.get('q') ?? '';
      }
    } else if (context?.query && context?.query.has('q') && context?.query.get('q')?.trim() != undefined) {
      this.localQuery = context.query.get('q') ?? '';
    }

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

    if (current_query == undefined && this.localQuery != undefined) {
      current_query = this.localQuery; 
    }

    // Determine which URLs to use: prefer Urls, fallback to blockUrls
    const urlsToUse = Object.keys(this.Urls).length > 0 ? this.Urls : this.blockUrls;
    const isNewFormat = Object.keys(this.Urls).length > 0;

    const urls: TemplateResult[] = [];
    Object.entries(urlsToUse)
      .map(([title, urlData]) => {
        let url: string;
        let no_query: string | undefined;
        let description: string | undefined;
        let format: string | undefined;

        if (isNewFormat) {
          // New format: urlData is {url, no_query?, description?, format?}
          url = (urlData as any).url || '';
          no_query = (urlData as any).no_query;
          description = (urlData as any).description;
          format = (urlData as any).format;
        } else {
          // Old format: urlData is just the URL string
          url = urlData;
        }

        // Determine finalUrl: if no query, use no_query URL if available, otherwise use regular url logic
        let finalUrl: string;
        if (!current_query || current_query.trim() === '') {
          finalUrl = no_query || url;
        } else {
          finalUrl = url.includes('%placeholder%') ? url.replace('%placeholder%', current_query) : url + current_query;
        }

        urls.push(
        html`
          <li class="bento-search-result-item s-box-small-v s-box-small-h
                           result-default">
            <h3 class="item-title t-title-small s-stack-small">
              <a href="${finalUrl}">${title}</a>
            </h3>
            ${description ? html`
              <p class="sr-only">description</p>
              <p class="t-body-small s-stack-small">${description}</p>` : ''}
            ${format ? html`
              <dl class="item-fields">
                <div class="t-label">
                  <dt class="t-bold">Item format:</dt>
                  <dd>${format}</dd>
                </div>
              </dl>` : ''}
          </li>`);
      });

    return html`
      <div>
        <section id="${this.blockID}" class="bento-search c-border-tertiary s-margin-general-medium ${this.isCollapsible ? 'collapsible' : ''} ${this.startsCollapsed ? 'collapsed' : ''}" aria-label="${this.blockTitle}">
          <div
            class="bento-search-header dark-theme c-content-primary c-bg-primary s-box-small-v s-box-small-h"
          >
            <div class="bento-search-header-icon-container" aria-hidden="true">
              ${this.blockIcon && this.blockIcon.trim() != '' ? html`
                <i
                  data-lucide="${this.blockIcon}"
                  class="bento-search-header-icon"
                ></i>
                ` : html``}
            </div>
            <h2 class="t-title-medium">
              ${this.blockTitle}
            </h2>
          </div>
          ${this.blockDescription && this.blockDescription.trim() != '' ? html`
          <p
            class="description t-label c-content-secondary c-bg-tertiary s-box-small-h"
          >
            ${unsafeHTML(this.blockDescription)} 
          </p>` : ''}
          <ul id="block-more-searchers">
            ${urls}
          </ul>
        </section>
      </div>
    `;
  }
}