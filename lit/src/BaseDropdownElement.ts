import {html, TemplateResult} from 'lit';
import {property} from 'lit/decorators.js';
import {repeat} from 'lit/directives/repeat.js';
import {state} from 'lit/decorators.js';
import {createRef, ref} from 'lit/directives/ref.js';
import {BaseSearchElement} from './BaseSearchElement';

type Constructor<T = {}> = new (...args: any[]) => T;

export declare class DropdownMixinInterface {
  /**
   * The label to display in the input box.
   */
  htmlSelectLabel: string;
  /**
   * If a user can select multiple options.
   */
  multipleSelect: boolean;
  /**
   * Indicates if the dropdown is open or closed.
   */
  dropdownOpen: boolean;
  /**
   * Indicates if the user must select a option.
   */
  required: boolean;
  /**
   * The currently focused HTML element.
   */
  focusedOption: HTMLElement | null;
  /**
   * The label that appears above the field.
   */
  getHtmlLabel(): string | TemplateResult;
  /**
   * Returns the id for an option.
   */
  getOptionId(option: unknown): string;
  /**
   * Returns the key for an option.
   */
  getOptionKey(option: unknown): string;
  /**
   * Returns the value for an option.
   */
  getOptionValue(option: unknown): string;
  /**
   * Returns the label for an option.
   */
  getOptionLabel(option: unknown): string;
  /**
   * Returns all available options.
   */
  getAllOptions(): unknown[];
  /**
   * Determine if an option is currently selected.
   */
  isOptionSelected(option: unknown): boolean;
  /**
   * Determine if there are any selected options.
   */
  hasSelectedOptions(): boolean;
  /**
   * Get the html label that will appear inside the select field.
   */
  getHtmlSelectLabel(): string | TemplateResult;
  /**
   * The action to take when a user clicks on an option.
   */
  optionMouseDown(e: MouseEvent, option: unknown): void;
  /**
   * Clear the currently selected option(s).
   */
  clearSelection(e: MouseEvent): void;
  /**
   * Apple a selection from a keyboard event.
   */
  applySelection(event: KeyboardEvent): void;
  /**
   * Get all the currently selected options.
   */
  getSelectedOptions(): unknown[];
  /**
   * Returns options that match the provided filter string.
   */
  filterOptions(searchString: string): unknown[];
  /**
   * Close the dropdown.
   */
  close(): void;
  /**
   * The HTML element for the label above the field.
   */
  _getHtmlLabelElement(): TemplateResult;
  /**
   * The HTML element for the label/current value inside the select field.
   */
  _getHtmlSelectLabelElement(): TemplateResult;
  /**
   * The HTML element for the list of options.
   */
  _getHtmlSelectElement(): TemplateResult;
}

export const DropdownMixin = <T extends Constructor<BaseSearchElement>>(
  superClass: T
) => {
  class Dropdown extends superClass {
    /**
     * The label to display in the input box.
     */
    @property()
    htmlSelectLabel = 'Choose an option';

    /**
     * If a user can select multiple options.
     */
    @property({type: Boolean})
    multipleSelect = false;

    /**
     * If the dropdown is open.
     */
    @state()
    dropdownOpen = false;

    /**
     * Indicates if the user must select a option.
     */
    @property({type: Boolean})
    required: boolean = false;

    /**
     * Private: The current option that is focused.
     */
    @state()
    focusedOption: HTMLElement | null = null;

    /**
     * Private: If focus should be applied to the focusedOption when the dropdown is next opened.
     */
    @state()
    private focusOnOpen = false;

    /**
     * Private: The type search timeout.
     */
    @state()
    private searchTimeout: number | undefined;

    /**
     * Private: The type search string.
     */
    @state()
    private searchTerm = '';

    /**
     * Private: A ref to the element that displays the current value.
     */
    private inputRef = createRef<HTMLElement>();

    /**
     * Private: A Ref to the listbox element containing the available options.
     */
    private listboxRef = createRef<HTMLElement>();

    /**
     * Private: A mapping of actions to the applicable key input code.
     */
    private selectActions = {
      Close: 0,
      CloseSelect: 1,
      First: 2,
      Last: 3,
      Next: 4,
      Open: 5,
      PageDown: 6,
      PageUp: 7,
      Previous: 8,
      Select: 9,
      Type: 10,
    };

    /**
     * Ensure the focusElement is focused when the dropdown is opened.
     */
    override updated(changedProperties: Map<string, any>) {
      super.updated(changedProperties);

      if (this.focusOnOpen) {
        this._setOptionFocus(this._getNextOption(this.selectActions.First));
        this.focusOnOpen = false;
      }
    }

    /** HELPERS */
    getHtmlLabel(): string | TemplateResult {
      // Replace me with logic to get the label for the field.
      return '';
    }

    getOptionId(option: unknown): string {
      const cleanKey = this.safeIdentifier(this.getOptionKey(option));
      return `option-${this.uid}-${cleanKey}`;
    }

    getOptionKey(_option: unknown): string {
      // Replace me with logic to get the key for an option.
      return '';
    }

    getOptionValue(_option: unknown): string {
      // Replace me with logic to get the key for on option.
      return '';
    }

    getOptionLabel(_option: unknown): string {
      // Replace me with logic to get the key for an option.
      return '';
    }

    getAllOptions(): unknown[] {
      // Replace me with logic to get all the available options.
      return [];
    }

    isOptionSelected(_option: unknown): boolean {
      // Replace me with logic to determine is an option is selected.
      return true;
    }

    hasSelectedOptions(): boolean {
      // Replace me with logic to determine if this element has any selected options.
      return false;
    }

    /**
     * Get the select field label.
     */
    getHtmlSelectLabel(): TemplateResult | string {
      //Replace me with logic to update the value with selected values.
      return this.htmlSelectLabel;
    }

    optionMouseDown(e: MouseEvent, _option: unknown): void {
      e.preventDefault();
      // Replace this. Do something here.
    }

    clearSelection(e: MouseEvent): void {
      e.preventDefault();
      // Replace me with logic to reset the selection.
    }

    applySelection(_event: KeyboardEvent): void {
      // Replace me with logic to apply a selection.
    }

    getSelectedOptions(): unknown[] {
      // Replace me with logic to get an array of selected options.
      return [];
    }

    filterOptions(_searchString: string): unknown[] {
      // Replace me with logic to filter options by a search string.
      return [];
    }

    /** HELPERS */

    /** HTML ELEMENTS */
    /**
     * The label element for the field.
     */
    _getHtmlLabelElement(): TemplateResult {
      return this.getHtmlLabel()
        ? html`<label id="combo-label-${this.uid}" class="combo-label"
            >${this.getHtmlLabel()}</label
          >`
        : html``;
    }

    /**
     * Render a single dropdown option.
     *
     * @param option The option data to render.
     */
    _getOptionElement(option: unknown): TemplateResult {
      return html`
        <div
          role="option"
          id=${this.getOptionId(option)}
          class="combo-option ${this.isOptionSelected(option)
            ? 'selected'
            : null}"
          aria-selected="${this.isOptionSelected(option)}"
          @mousedown=${(e: MouseEvent) => this.optionMouseDown(e, option)}
          data-value="${this.getOptionValue(option)}"
        >
          ${this.getOptionLabel(option)}
        </div>
      `;
    }

    /**
     * Get all the option elements.
     */
    _getAllOptionsElements(): TemplateResult {
      return html`
        <div
          role="option"
          id="select-label-${this.uid}"
          class="combo-option combo-option-label${this.required
            ? ' disabled'
            : null}"
          aria-selected=${!this.hasSelectedOptions()}
          @mousedown=${this.required ? null : this.clearSelection}
          aria-disabled="${this.required}"
        >
          ${this.htmlSelectLabel}
        </div>
        ${repeat(
          this.getAllOptions(),
          (option) => this.getOptionId(option),
          (option) => {
            return this._getOptionElement(option);
          }
        )}
      `;
    }

    /**
     * Get the select field label element.
     */
    _getHtmlSelectLabelElement(): TemplateResult {
      return html`
        <div
          ${ref(this.inputRef)}
          id="combo-input-${this.uid}"
          role="combobox"
          tabindex="0"
          class="combo-input ${this.dropdownOpen ? 'open' : null}"
          aria-controls="combo-listbox-${this.uid}"
          aria-expanded="${this.dropdownOpen}"
          aria-haspopup="listbox"
          aria-labelledby="combo-label-${this.uid}"
          @blur=${this.close}
          @focusout=${this.close}
          @click=${this.toggleDropdown}
          @keydown=${(e: KeyboardEvent) => this.onSelectKeyDown(e)}
        >
          ${this.getHtmlSelectLabel()}
        </div>
      `;
    }

    /**
     * Get the select field element.
     */
    _getHtmlSelectElement(): TemplateResult {
      return html`
        <div
          ${ref(this.listboxRef)}
          class="combo-options ${this.dropdownOpen ? 'open' : null}"
          role="listbox"
          id="combo-listbox-${this.uid}"
          aria-labelledby="combo-label-${this.uid}"
          tabindex="-1"
        >
          ${this.dropdownOpen ? this._getAllOptionsElements() : null}
        </div>
      `;
    }

    /**
     * Close the dropdown.
     */
    close(): void {
      this.dropdownOpen = false;
      this.focusedOption = null;
    }

    /**
     * Map a key press to an action.
     *
     * @param event
     */
    _getActionFromKey(event: KeyboardEvent): number {
      const {key, altKey, ctrlKey, metaKey} = event;

      // Keys that can open the dropdown.
      const openKeys = ['ArrowDown', 'ArrowUp', 'Enter', ' '];
      if (!this.dropdownOpen && openKeys.includes(key)) {
        return this.selectActions.Open;
      }

      // Home and end move the selected option when open or closed
      if (key === 'Home') {
        return this.selectActions.First;
      }
      if (key === 'End') {
        return this.selectActions.Last;
      }

      // Handle typing characters when open or closed
      if (
        key === 'Backspace' ||
        key === 'Clear' ||
        (key.length === 1 && key !== ' ' && !altKey && !ctrlKey && !metaKey)
      ) {
        return this.selectActions.Type;
      }

      if (this.dropdownOpen) {
        if (key === 'ArrowUp' && altKey) {
          return this.selectActions.CloseSelect;
        } else if (key === 'ArrowDown' && !altKey) {
          return this.selectActions.Next;
        } else if (key === 'ArrowUp') {
          return this.selectActions.Previous;
        } else if (key === 'PageUp') {
          return this.selectActions.PageUp;
        } else if (key === 'PageDown') {
          return this.selectActions.PageDown;
        } else if (key === 'Escape') {
          return this.selectActions.Close;
        } else if (key === 'Enter' || key === ' ') {
          return this.selectActions.CloseSelect;
        }
      }

      return -1;
    }

    /**
     * Map a key press to an action and update element.
     *
     * @param event
     */
    onSelectKeyDown(event: KeyboardEvent): void {
      const {key} = event;
      const action = this._getActionFromKey(event);

      switch (action) {
        case this.selectActions.Last:
        case this.selectActions.First:
        case this.selectActions.Next:
        case this.selectActions.Previous:
        case this.selectActions.PageUp:
        case this.selectActions.PageDown:
          event.preventDefault();
          this._setOptionFocus(this._getNextOption(action));
          break;
        case this.selectActions.CloseSelect:
          event.preventDefault();
          this.applySelection(event);
          if (!this.multipleSelect) {
            this.close();
          }
          break;
        case this.selectActions.Close:
          event.preventDefault();
          this.dropdownOpen = false;
          break;
        case this.selectActions.Type:
          this._typeSearch(key);
          break;
        case this.selectActions.Open:
          event.preventDefault();
          this.focusOnOpen = true;
          this.dropdownOpen = true;
          break;
      }
    }

    /**
     * Toggle the dropdown open or closed.
     */
    toggleDropdown(): void {
      const selectedOptions = this.getSelectedOptions();

      this.dropdownOpen = !this.dropdownOpen;
      if (this.dropdownOpen) {
        if (selectedOptions.length > 0) {
          this.inputRef.value?.setAttribute(
            'aria-activedescendant',
            this.getOptionId(selectedOptions[0])
          );
        }
      } else {
        this.inputRef.value?.removeAttribute('aria-activedescendant');
      }
    }

    /**
     * Search available options based on the entered string.
     *
     * @param letter
     */
    _typeSearch(letter: string): void {
      this.dropdownOpen = true;

      const searchTerm = this._getSearchTerm(letter);
      const result = this._searchOptions(searchTerm);

      if (!result) {
        window.clearTimeout(this.searchTimeout);
        this.searchTerm = '';
        return;
      }

      this._setOptionFocus(result);
    }

    /**
     * Search the options by the given search term. If the search term repeats the same letter
     * it will cycle through options starting with that letter.
     */
    _searchOptions(searchTerm: string): string | undefined {
      const matchedOptions = this.filterOptions(searchTerm);

      const input = searchTerm.split('');
      const allSameLetter = input.every((l) => l === input[0]);

      if (matchedOptions.length === 0 && !allSameLetter) {
        return undefined;
      }

      if (matchedOptions[0]) {
        return this.getOptionId(matchedOptions[0]);
      }

      if (allSameLetter) {
        const firstLetterMatch = this.filterOptions(input[0]);

        if (firstLetterMatch.length === 0) {
          return undefined;
        }

        return this.getOptionId(
          firstLetterMatch[(input.length - 1) % firstLetterMatch.length]
        );
      }

      return undefined;
    }

    /**
     * Get the next option to focus on based on the given action.
     */
    _getNextOption(action: number) {
      const pageSize = 10; // used for page up/page down
      const options = this.getAllOptions();

      const labelId = `select-label-${this.uid}`;

      if (!this.focusedOption) {
        return labelId;
      }

      let current = options.findIndex((o) => {
        return this.focusedOption?.id === this.getOptionId(o);
      });

      current = current === -1 ? 0 : current + 1;

      // Add one to account for the select label being displayed as part of the list.
      const maxIndex = options.length + 1;
      let next: number;
      switch (action) {
        case this.selectActions.First:
          next = 0;
          break;
        case this.selectActions.Last:
          next = maxIndex - 1;
          break;
        case this.selectActions.Previous:
          next = Math.max(0, current - 1);
          break;
        case this.selectActions.Next:
          next = Math.min(maxIndex, current + 1);
          break;
        case this.selectActions.PageUp:
          next = Math.max(0, current - pageSize);
          break;
        case this.selectActions.PageDown:
          next = Math.min(maxIndex - 1, current + pageSize);
          break;
        default:
          next = current;
          break;
      }

      return next === 0 ? labelId : this.getOptionId(options[next - 1]);
    }

    /**
     * Get the search term input
     */
    _getSearchTerm(char: string): string {
      if (typeof this.searchTimeout === 'number') {
        window.clearTimeout(this.searchTimeout);
      }

      this.searchTimeout = window.setTimeout(() => {
        this.searchTerm = '';
      }, 500);

      // Add most recent letter to saved search term.
      this.searchTerm += char;

      return this.searchTerm;
    }

    /**
     * Determine if an DOM element is visible on the screen.
     */
    _elementInView(id: string): boolean {
      const element = this.querySelector(`#${id}`);

      if (!element) {
        return true;
      }
      var bounding = element.getBoundingClientRect();

      return (
        bounding.top >= 0 &&
        bounding.left >= 0 &&
        bounding.bottom <=
          (window.innerHeight || document.documentElement.clientHeight) &&
        bounding.right <=
          (window.innerWidth || document.documentElement.clientWidth)
      );
    }

    /**
     * Determine if the options listbox is scrollable.
     */
    _isScrollable(): boolean {
      const listbox = this.listboxRef.value;
      return (
        listbox !== undefined && listbox.clientHeight < listbox.scrollHeight
      );
    }

    /**
     * Scroll to the given element.
     */
    _maintainScrollVisibility(id: string): void {
      const element = this.querySelector(`#${id}`) as HTMLElement;
      const listbox = this.listboxRef.value;

      if (!listbox) {
        return;
      }

      const {offsetHeight, offsetTop} = element;
      const {offsetHeight: parentOffsetHeight, scrollTop} = listbox;

      const isAbove = offsetTop < scrollTop;
      const isBelow = offsetTop + offsetHeight > scrollTop + parentOffsetHeight;

      if (isAbove) {
        listbox.scrollTo(0, offsetTop);
      } else if (isBelow) {
        listbox.scrollTo(0, offsetTop - parentOffsetHeight + offsetHeight);
      }
    }

    /**
     * Focus on an option in the listbox and remove focus from all other options.
     */
    _setOptionFocus(id: string) {
      this.focusedOption = this.querySelector(`#${id}`);

      this.inputRef.value?.setAttribute('aria-activedescendant', id);
      this.listboxRef.value?.querySelectorAll('.focused')?.forEach((option) => {
        option.classList.remove('focused');
      });
      this.focusedOption?.classList.add('focused');

      if (this._isScrollable()) {
        this._maintainScrollVisibility(id);
      }

      if (!this._elementInView(id)) {
        this.focusedOption?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }

      this.inputRef.value?.focus();
    }
  }

  return Dropdown as Constructor<DropdownMixinInterface> & T;
};
