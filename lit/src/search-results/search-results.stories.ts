import type {Meta, StoryObj} from '@storybook/web-components';
import {html} from 'lit';
import {SearchRoot} from '../search-root/search-root';
import {SearchResults} from './search-results';

//@ts-expect-error required import.
const a = SearchResults;
//@ts-expect-error required import.
const b = SearchRoot;

const meta: Meta = {
  title: 'Components/search-results',
  tags: ['autodocs'],
  component: 'search-results',
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
  render: ({resultField, mappings}) => html` <search-results
    ?resultField="${resultField}"
    ?mappings="${mappings}"
  ></search-results>`,
  args: {
    resultField: '',
    mappings: '',
  },
};
