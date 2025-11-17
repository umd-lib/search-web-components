import {html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {BaseSearchElement} from '../../BaseSearchElement.js';

/**
 * A button that copies the current URL to share the search results.
 */
@customElement('search-share')
export class SearchShare extends BaseSearchElement {
  @property()
  queryText: string = '';

  initialQuery: string = '';

  override connectedCallback() {
    super.connectedCallback();


    document.addEventListener('update-context', (e) => {
      //@ts-expect-error
      this.queryText = decodeURIComponent(e.context.query.toString());
      if (this.queryText === 'q=') this.queryText = '';
      if (this.queryText.startsWith('q=&'))
        this.queryText = this.queryText.replace('q=&', '');
    });

    if (this.context?.query?.toString() != undefined) {
      this.initialQuery = this.context.query.toString() ?? undefined;
    }

    setTimeout(() => {
      // @ts-ignore: ClipboardJS is loaded globally by the theme
      if (window.ClipboardJS) {
        const clipboard = new window.ClipboardJS('.share-button');
        const alert_id = this.renderRoot.querySelector('#clipboardjs-alert');
        const error_id = this.renderRoot.querySelector('#copy-error');

        clipboard.on('success', function () {
          if (alert_id) {
            alert_id.innerHTML = `
              <div class="clipboardjs-alert-content s-margin-general-small" aria-label="Copy Alert" role="alert">
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M11.6663 3.5L5.24967 9.91667L2.33301 7" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="t-label">Share Link Copied</span>
              </div>
            `;
            setTimeout(() => {
              alert_id.innerHTML = '';
            }, 5000);
          }
        });

        clipboard.on('error', function (e: any) {
          let actionMsg = '';
          let actionKey = e.action === 'cut' ? 'X' : 'C';
          if (/iPhone|iPad/i.test(navigator.userAgent)) {
            actionMsg =
              'This device does not support HTML5 Clipboard Copying. Please copy manually.';
          } else {
            if (/Mac/i.test(navigator.userAgent)) {
              actionMsg = `Press ⌘-${actionKey} to ${e.action}`;
            } else {
              actionMsg = `Press Ctrl-${actionKey} to ${e.action}`;
            }
          }
          if (error_id) {
            error_id.innerHTML = `
              <div class="clipboardjs-alert-content s-margin-general-small" aria-label="Copy Error" role="alert">
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M6.00245 2.25179L1.06162 10.5001C0.959749 10.6765 0.905848 10.8765 0.905278 11.0803C0.904708 11.284 0.957487 11.4843 1.05837 11.6613C1.15925 11.8382 1.30471 11.9857 1.48028 12.089C1.65585 12.1923 1.85542 12.2479 2.05912 12.2501H11.9408C12.1445 12.2479 12.344 12.1923 12.5196 12.089C12.6952 11.9857 12.8407 11.8382 12.9415 11.6613C13.0424 11.4843 13.0952 11.284 13.0946 11.0803C13.0941 10.8765 13.0402 10.6765 12.9383 10.5001L7.99745 2.25179C7.89346 2.08035 7.74704 1.93861 7.57232 1.84024C7.39759 1.74186 7.20046 1.69019 6.99995 1.69019C6.79944 1.69019 6.60231 1.74186 6.42759 1.84024C6.25286 1.93861 6.10644 2.08035 6.00245 2.25179Z" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M7 5.25V7.58333" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M7 9.91675H7.00583" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="t-label">${actionMsg}</span>
              </div>
            `;
            setTimeout(() => {
              error_id.innerHTML = '';
            }, 5000);
          }
        });
      }
    }, 0);
  }

  private getShareUrl(): string {
    const baseUrl = window.location.href.replace(/(\?.*)$/, '');
    let qs = this.queryText ? this.queryText : this.initialQuery;
    return (
      baseUrl + (qs ? '?' + decodeURIComponent(qs) : '')
    );
  }

  override render() {
    return html`
      <div class="share-container">
        <div class="action-function">
          Share this search results?
          <button
            class="share-button umd-lib button secondary"
            aria-label="Share search results"
            data-clipboard-text="${this.getShareUrl()}"
          >
            Copy Link
          </button>
        </div>
        <div class="action-feedback" aria-live="polite" aria-atomic="true">
          <div id="clipboardjs-alert"></div>
          <div id="copy-error"></div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface Window {
    ClipboardJS: any;
  }
  interface HTMLElementTagNameMap {
    'search-share': SearchShare;
  }
}
