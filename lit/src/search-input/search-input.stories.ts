import type {Meta, StoryObj} from '@storybook/web-components';
import {html} from 'lit';
import {SearchRoot} from '../search-root/search-root';
import {SearchInput} from './search-input';

//@ts-expect-error required import.
const a = SearchInput;
//@ts-expect-error required import.
const b = SearchRoot;

const meta: Meta = {
  title: 'Components/search-input',
  tags: ['autodocs'],
  component: 'search-input',
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
  render: ({placeHolderText, labelText, clearText}) =>
    html`<search-input
      placeHolderText="${placeHolderText}"
      labelText="${labelText}"
      clearText="${clearText}"
    ></search-input>`,
  args: {
    placeHolderText: 'Search',
    labelText: 'Search',
    clearText: 'Remove',
  },
};
