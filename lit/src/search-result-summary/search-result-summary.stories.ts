import type {Meta, StoryObj} from '@storybook/web-components';
import {html} from 'lit';

import {SearchResultSummary} from './search-result-summary';
import {SearchRoot} from '../search-root/search-root';

//@ts-expect-error required import.
const a = SearchResultSummary;
//@ts-expect-error required import.
const b = SearchRoot;

const meta: Meta = {
  title: 'Components/search-result-summary',
  tags: ['autodocs'],
  component: 'search-result-summary',
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
  render: ({summaryText}) =>
    html`<search-result-summary
      summaryText="${summaryText}"
    ></search-result-summary>`,
  args: {
    summaryText: '@start - @end of @total',
  },
};

export const WithTime: Story = {
  render: ({summaryText}) =>
    html`<search-result-summary
      summaryText="${summaryText}"
    ></search-result-summary>`,
  args: {
    summaryText: 'Found @total results in @times',
  },
};
