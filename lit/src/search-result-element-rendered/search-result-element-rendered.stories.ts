import type {Meta, StoryObj} from '@storybook/web-components';
import {html} from 'lit';
import {SearchRoot} from '../search-root/search-root';
import {SearchResultElementRendered} from './search-result-element-rendered';
import {MockData} from '../MockData';

//@ts-expect-error required import.
const a = SearchResultElementRendered;
//@ts-expect-error required import.
const b = SearchRoot;

const meta: Meta = {
  title: 'Components/search-result-element-rendered',
  tags: ['autodocs'],
  component: 'search-result-element-rendered',
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
  render: ({data, settings}) =>
    html`<search-result-element-rendered
      data="${data}"
      settings="${settings}"
    ></search-result-element-rendered>`,
  args: {
    data: JSON.stringify(MockData.data.search_results[0]),
    settings: JSON.stringify({field: 'rendered_item'}),
  },
};
