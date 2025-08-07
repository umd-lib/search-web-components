import type {Meta, StoryObj} from '@storybook/web-components';
import {html} from 'lit';
import {SearchRoot} from '../search-root/search-root';
import {SearchResultsSwitcher} from './search-results-switcher';

//@ts-expect-error required import.
const a = SearchResultsSwitcher;
//@ts-expect-error required import.
const b = SearchRoot;

const meta: Meta = {
  title: 'Components/search-results-switcher',
  tags: ['autodocs'],
  component: 'search-results-switcher',
  decorators: [
    (story) =>
      html`
        <search-root url="/mock/api/search/mock-index" defaultPerPage="10">
          ${story()}
        </search-root>
      `,
  ],
};

export default meta;
type Story = StoryObj;

export const Primary: Story = {
  render: ({options}) =>
    html`<search-results-switcher
      options=${options}
    ></search-results-switcher>`,
  args: {
    options: JSON.stringify([
      {
        key: 'list',
        label: 'List',
      },
      {
        key: 'grid',
        label: 'Grid',
      },
    ]),
  },
};
