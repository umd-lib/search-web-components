import type {Meta, StoryObj} from '@storybook/web-components';
import {html} from 'lit';
import {SearchRoot} from '../search-root/search-root';
import {SearchSort} from './search-sort';

//@ts-expect-error required import.
const a = SearchSort;
//@ts-expect-error required import.
const b = SearchRoot;

const meta: Meta = {
  title: 'Components/search-sort',
  tags: ['autodocs'],
  component: 'search-sort',
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

export const Select: Story = {
  render: ({type, labelText, sorts}) =>
    html`<search-sort
      type="${type}"
      labelText="${labelText}"
      sorts="${sorts}"
    ></search-sort>`,
  args: {
    type: 'select',
    labelText: 'Sort',
    sorts: JSON.stringify([
      {key: 'search_api_relevance', label: 'Relevance', order: 'desc'},
      {key: 'title', label: 'A-Z', order: 'asc'},
      {key: 'title', label: 'Z-A', order: 'desc'},
    ]),
  },
};

export const List: Story = {
  render: ({type, labelText, sorts}) =>
    html`<search-sort
      type="${type}"
      labelText="${labelText}"
      sorts="${sorts}"
    ></search-sort>`,
  args: {
    type: 'list',
    labelText: 'Sort',
    sorts: JSON.stringify([
      {key: 'search_api_relevance', label: 'Relevance', order: 'desc'},
      {key: 'title', label: 'A-Z', order: 'asc'},
      {key: 'title', label: 'Z-A', order: 'desc'},
    ]),
  },
};

export const HTML: Story = {
  render: ({type, labelText, sorts}) =>
    html`<search-sort
      type="${type}"
      labelText="${labelText}"
      sorts="${sorts}"
    ></search-sort>`,
  args: {
    type: 'html',
    labelText: 'Sort',
    sorts: JSON.stringify([
      {key: 'search_api_relevance', label: 'Relevance', order: 'desc'},
      {key: 'title', label: 'A-Z', order: 'asc'},
      {key: 'title', label: 'Z-A', order: 'desc'},
    ]),
  },
};
