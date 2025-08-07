import type {Meta, StoryObj} from '@storybook/web-components';
import {html} from 'lit';
import {SearchRoot} from './search-root';
import {SearchBox} from './search-box';

const meta: Meta = {
  title: 'Components/search-box',
  tags: ['autodocs'],
  component: 'search-box',
};

//@ts-expect-error required import.
const b = SearchBox;

export default meta;
type Story = StoryObj;

export const Primary: Story = {
  render: ({url, submitText, ariaLabelText, placeHolderText}) =>
    html`<search-box
      url="${url}"
      submitText="${submitText}"
      ariaLabelText="${ariaLabelText}"
      placeHolderText="${placeHolderText}"
    ></search-box>`,
  args: {
    url: '#',
    submitText: 'Search',
    ariaLabelText: 'Search',
    placeHolderText: 'Search',
  },
};
