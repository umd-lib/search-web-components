import type {Meta, StoryObj} from '@storybook/web-components';
import {html} from 'lit';
import {SearchRoot} from '../search-root/search-root';
import {SearchAppliedFacets} from './search-applied-facets';

//@ts-expect-error required import.
const a = SearchAppliedFacets;
//@ts-expect-error required import.
const b = SearchRoot;

const meta: Meta = {
  title: 'Facets/search-applied-facets',
  tags: ['autodocs'],
  component: 'search-applied-facets',
  decorators: [
    (story) =>
      html`
        <search-root
          url="/mock/api/search/mock-index?f[0]=type:page"
          defaultPerPage="10"
        >
          ${story()}
        </search-root>
      `,
  ],
  parameters: {
    query: {
      'f:type': 'page',
    },
  },
};

export default meta;
type Story = StoryObj;

export const Primary: Story = {
  render: ({
    removeText,
    resetText,
    showReset,
    showIndividual,
  }) => html` <search-applied-facets
    removeText="${removeText}"
    resetText="${resetText}"
    ?showReset="${showReset}"
    ?showIndividual="${showIndividual}"
  ></search-applied-facets>`,
  args: {
    removeText: '',
    resetText: '',
    showReset: true,
    showIndividual: true,
  },
};
