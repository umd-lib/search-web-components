import type {Meta, StoryObj} from '@storybook/web-components';
import {html} from 'lit';
import {SearchRoot} from '../search-root/search-root';
import {SearchResultElementDefault} from './search-result-element-default';
import {MockData} from '../MockData';

//@ts-expect-error required import.
const a = SearchResultElementDefault;
//@ts-expect-error required import.
const b = SearchRoot;

const meta: Meta = {
  title: 'Components/search-result-element-default',
  tags: ['autodocs'],
  component: 'search-result-element-default',
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
  render: ({data}) =>
    html`<search-result-element-default
      data="${data}"
    ></search-result-element-default>`,
  args: {
    data: JSON.stringify(MockData.data.search_results[0]),
  },
};
