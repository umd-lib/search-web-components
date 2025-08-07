import type {Meta, StoryObj} from '@storybook/web-components';
import {html} from 'lit';
import {SearchRoot} from './search-root';

const meta: Meta = {
  title: 'Components/search-root',
  tags: ['autodocs'],
  component: 'search-root',
};

//@ts-expect-error required import.
const b = SearchRoot;

export default meta;
type Story = StoryObj;

export const Primary: Story = {
  render: ({
    url,
    additionalParams,
    defaultPerPage,
    defaultResultDisplay,
    noPageUrlUpdate,
  }) =>
    html`<search-root
      url="${url}"
      ?additionalParams="${additionalParams}"
      ?defaultPerPage="${defaultPerPage}"
      ?defaultResultDisplay="${defaultResultDisplay}"
      ?noPageUrlUpdate="${noPageUrlUpdate}"
    ></search-root>`,
  args: {
    url: '/mock/api/search/mock-index',
    additionalParams: '',
    defaultPerPage: 10,
    defaultResultDisplay: '',
    noPageUrlUpdate: false,
  },
};
