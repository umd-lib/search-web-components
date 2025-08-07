import type {Meta, StoryObj} from '@storybook/web-components';
import {html} from 'lit';
import {SearchRoot} from '../search-root/search-root';
import {SearchDialogToggle} from './search-dialog-toggle';

//@ts-expect-error required import.
const a = SearchDialogToggle;
//@ts-expect-error required import.
const b = SearchRoot;

const meta: Meta = {
  title: 'Components/search-dialog-toggle',
  tags: ['autodocs'],
  component: 'search-sort',
  decorators: [
    (story) =>
      html`
        <search-root
          url="/mock/api/search/mock-index"
          dialogBreakpoint="800"
          defaultPerPage="10"
        >
          ${story()}
        </search-root>
      `,
  ],
};

export default meta;
type Story = StoryObj;

export const Primary: Story = {
  render: ({dialogOpenText, dialogCloseText, showAppliedCount}) =>
    html`<search-dialog-toggle
      dialogOpenText="${dialogOpenText}"
      dialogCloseText="${dialogCloseText}"
      ?showAppliedCount="${showAppliedCount}"
    ></search-dialog-toggle>`,
  args: {
    dialogOpenText: 'Filters',
    dialogCloseText: 'Close',
    showAppliedCount: false,
  },
};
