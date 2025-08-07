import {html, PropertyValues} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {BaseSearchElement} from '../BaseSearchElement';

/**
 * A toggle button to control the display of the search-dialog-pane component.
 */
@customElement('search-dialog-toggle')
export class SearchDialogToggle extends BaseSearchElement {
  /**
   * The label to display when the pane is not a toggle.
   */
  @property()
  aboveBreakpointText = 'Filters';

  /**
   * The label to display when the pane is closed.
   */
  @property()
  dialogOpenText = 'Filters';

  /**
   * The label to display when the pane is open.
   */
  @property()
  dialogCloseText = 'Close';

  /**
   * If the label should include the count of currently applied facets.
   */
  @property()
  showAppliedCount = false;

  @state()
  showButton = false;

  /** inheritdoc */
  override connectedCallback() {
    super.connectedCallback();

    window.addEventListener('resize', () => {
      this._handleResize();
    });
  }

  /** inheritdoc */
  override disconnectedCallback() {
    window.removeEventListener('resize', () => {
      this._handleResize();
    });
    super.disconnectedCallback();
  }

  /** inheritdoc */
  protected override updated(_changedProperties: PropertyValues) {
    super.updated(_changedProperties);
    this._handleResize();
  }

  /**
   * Listen to window resizing to determine if the dialog should be a toggle or not.
   */
  _handleResize() {
    if (
      this.context?.dialogBreakpoint &&
      (this.context?.dialogBreakpoint === -1 ||
        window.innerWidth <= this.context.dialogBreakpoint)
    ) {
      this.showButton = true;
    } else {
      this.showButton = false;
    }
  }

  /**
   * Get the text to display.
   */
  _getLabelText() {
    if (this.showButton) {
      return html`${this.context?.dialogOpen
        ? this.dialogCloseText
        : this.dialogOpenText}`;
    }

    return html`${this.aboveBreakpointText}`;
  }

  /** inheritdoc */
  override render() {
    if (this.context === undefined || !this.context.responseReady) {
      return;
    } else {
      if (this.showButton) {
        return html`
          <button
            class="search-dialog-toggle-button"
            @click=${() => {
              if (this.context) {
                const context = this.context;
                context.dialogOpen = !this.context?.dialogOpen;
                this.updateContext(context);
              }
            }}
          >
            ${this._getLabelText()}
          </button>
        `;
      } else {
        return html`<div class="search-dialog-toggle-div">
          ${this._getLabelText()}
        </div>`;
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'search-dialog-toggle': SearchDialogToggle;
  }
}
