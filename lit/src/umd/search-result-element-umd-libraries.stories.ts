import type {Meta, StoryObj} from '@storybook/web-components';
import {html} from 'lit';
import {SearchRoot} from '../search-root/search-root';
import {SearchResultElementUMDLibraries} from './search-result-element-umd-libraries';
import {MockData} from '../MockData';

//@ts-expect-error required import.
const a = SearchResultElementUMDLibraries;
//@ts-expect-error required import.
const b = SearchRoot;

const meta: Meta = {
  title: 'Components/search-result-element-umd-libraries',
  tags: ['autodocs'],
  component: 'search-results-element-umd-libraries',
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
  render: ({data, result_fields}) =>
    html`<search-results-element-umd-libraries
      data="${data}"
    ></search-results-element-umd-libraries>`,
  args: {
    data: JSON.stringify(MockData.data.search_results[0]),
    result_fields: 'object__title__display'
  },
};
