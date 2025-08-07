import {customElement, property, state} from 'lit/decorators.js';
import {BaseSearchElement} from '../BaseSearchElement';
import {PropertyValues} from 'lit';

/**
 * A dropdown element to choose how to sort the search results.
 */
@customElement('search-dialog-pane')
export class SearchDialogPane extends BaseSearchElement {
  /**
   * The label for the close button in the dialog.
   */
  @property()
  closeText = 'Close';

  /**
   * The position of the close button within the dialog.
   */
  @property()
  closePosition: 'top' | 'bottom' | 'none' | 'both' = 'top';

  /**
   * If the dialog should be a modal.
   */
  @property({type: Boolean})
  modal = false;

  @state()
  useDialog = false;

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

  /**
   * Listen to window resizing to determine if the pane should a dialog or not.
   */
  _handleResize() {
    if (
      this.context?.dialogBreakpoint &&
      (this.context?.dialogBreakpoint === -1 ||
        window.innerWidth <= this.context.dialogBreakpoint)
    ) {
      this.useDialog = true;
    } else {
      this.useDialog = false;
    }
  }

  /** inheritdoc */
  protected override updated(_changedProperties: PropertyValues) {
    super.updated(_changedProperties);
    this._handleResize();
  }

  /**
   * Open or close the dialog.
   */
  public _toggleDialog(dialog: HTMLDialogElement, state: 'open' | 'close') {
    if (state === 'open') {
      if (this.modal) {
        dialog.showModal();
      } else {
        dialog.show();
      }
    }

    if (state === 'close') {
      dialog.close();
    }
  }

  /**
   * Close the dialog.
   */
  _closeDialog() {
    if (this.context) {
      this.context.dialogOpen = false;
      this.updateContext(this.context);
    }
  }

  /** inheritdoc */
  override render() {
    if (!this.context?.responseReady) {
      return null;
    }
    if (this.context.dialogOpen) {
      this.classList.add('search-dialog-pane-visible');
      this.classList.remove('search-dialog-pane-hidden');
    } else {
      this.classList.add('search-dialog-pane-hidden');
      this.classList.remove('search-dialog-pane-visible');
    }

    const dialog = this.querySelector(
      ':scope > dialog'
    ) as HTMLDialogElement | null;
    if (this.useDialog && !dialog) {
      const newDialog = document.createElement('dialog');
      newDialog.addEventListener('cancel', () => this._closeDialog());
      newDialog.addEventListener('close', () => this._closeDialog());
      while (this.children.length > 0) {
        if (this.firstChild) {
          newDialog.appendChild(this.firstChild);
        }
      }
      const button = document.createElement('button');
      button.innerText = this.closeText;
      button.classList.add('close-button');

      if (this.closePosition === 'top' || this.closePosition === 'both') {
        const b = button.cloneNode(true) as HTMLButtonElement;
        b.addEventListener('click', () =>
          this._toggleDialog(newDialog, 'close')
        );
        b.classList.add('top');
        newDialog.prepend(b);
      }
      if (this.closePosition === 'bottom' || this.closePosition === 'both') {
        const b = button.cloneNode(true) as HTMLButtonElement;
        b.addEventListener('click', () =>
          this._toggleDialog(newDialog, 'close')
        );
        b.classList.add('bottom');
        newDialog.append(b);
      }

      this.appendChild(newDialog);
      if (this.context.dialogOpen) {
        this._toggleDialog(newDialog, 'open');
      } else {
        this._toggleDialog(newDialog, 'close');
      }
    } else if (this.useDialog && dialog) {
      if (this.context.dialogOpen) {
        this._toggleDialog(dialog, 'open');
      } else {
        this._toggleDialog(dialog, 'close');
      }
    } else if (!this.useDialog && dialog) {
      dialog.querySelectorAll(':scope > .close-button').forEach((b) => {
        dialog.removeChild(b);
      });
      while (dialog.children.length > 0) {
        if (dialog.firstChild) {
          this.insertBefore(dialog.firstChild, dialog);
        }
      }
      this.removeChild(dialog);
      this.context.dialogOpen = false;
      this.updateContext(this.context);
    }

    return null;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'search-dialog-pane': SearchDialogPane;
  }
}
