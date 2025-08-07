import type {Meta, StoryObj} from '@storybook/web-components';
import {html} from 'lit';
import {SearchRoot} from '../search-root/search-root';
import {SearchResultsPerPage} from './search-results-per-page';

//@ts-expect-error required import.
const a = SearchResultsPerPage;
//@ts-expect-error required import.
const b = SearchRoot;

const meta: Meta = {
  title: 'Components/search-results-per-page',
  tags: ['autodocs'],
  component: 'search-results-per-page',
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
  render: ({type, labelText, options}) =>
    html`<search-results-per-page
      type="${type}"
      labelText="${labelText}"
      options="${options}"
    ></search-results-per-page>`,
  args: {
    type: 'select',
    labelText: 'Per page',
    options: JSON.stringify([
      {key: '10', label: '10'},
      {key: '20', label: '20'},
      {key: '50', label: '50'},
    ]),
  },
};

export const List: Story = {
  render: ({type, labelText, options}) =>
    html`<search-results-per-page
      type="${type}"
      labelText="${labelText}"
      options="${options}"
    ></search-results-per-page>`,
  args: {
    type: 'list',
    labelText: 'Per page',
    options: JSON.stringify([
      {key: '10', label: '10'},
      {key: '20', label: '20'},
      {key: '50', label: '50'},
    ]),
  },
};

export const HTML: Story = {
  render: ({type, labelText, options}) =>
    html`<search-results-per-page
      type="${type}"
      labelText="${labelText}"
      options="${options}"
    ></search-results-per-page>`,
  args: {
    type: 'html',
    labelText: 'Per page',
    options: JSON.stringify([
      {key: '10', label: '10'},
      {key: '20', label: '20'},
      {key: '50', label: '50'},
    ]),
  },
};
