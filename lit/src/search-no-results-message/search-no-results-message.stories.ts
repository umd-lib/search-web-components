import type {Meta, StoryObj} from '@storybook/web-components';
import {html} from 'lit';
import {SearchRoot} from '../search-root/search-root';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import {SearchNoResultsMessage} from './search-no-results-message';
import {MockData, MockNoResults} from '../MockData';

//@ts-expect-error required import.
const a = SearchNoResultsMessage;
//@ts-expect-error required import.
const b = SearchRoot;

const meta: Meta = {
  title: 'Components/search-no-results-message',
  tags: ['autodocs'],
  component: 'search-no-results-message',
};

export default meta;
type Story = StoryObj;

export const NoSearchResults: Story = {
  render: ({child}) =>
    html`<search-root url=${MockNoResults.url} defaultPerPage="10"
      ><search-no-results-message
        >${unsafeHTML(child)}</search-no-results-message
      ></search-root
    >`,
  args: {
    child: '<h2>There are no search results</h2>',
  },
};

export const WithSearchResults: Story = {
  render: ({child}) =>
    html`<search-root url=${MockData.url} defaultPerPage="10"
      ><search-no-results-message
        >${unsafeHTML(child)}</search-no-results-message
      ></search-root
    >`,
  args: {
    child: '<h2>There are no search results</h2>',
  },
};
