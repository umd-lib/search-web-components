import type {Meta, StoryObj} from '@storybook/web-components';
import {html} from 'lit';
import {SearchRoot} from '../search-root/search-root';
import {SearchDialogPane} from './search-dialog-pane';

//@ts-expect-error required import.
const a = SearchDialogPane;
//@ts-expect-error required import.
const b = SearchRoot;

const meta: Meta = {
  title: 'Components/search-dialog-pane',
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
  render: ({closeText, closePosition, modal}) =>
    html`<search-dialog-pane
      closeText="${closeText}"
      closePosition="${closePosition}"
      ?modal="${modal}"
      ><h1>Some pane content</h1></search-dialog-pane
    >`,
  args: {
    closeText: 'Close',
    closePosition: 'both',
    modal: false,
  },
};
