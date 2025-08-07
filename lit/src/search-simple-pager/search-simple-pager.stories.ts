import type {Meta, StoryObj} from '@storybook/web-components';
import {html} from 'lit';
import {SearchRoot} from '../search-root/search-root';
import {SearchSimplePager} from './search-simple-pager';

//@ts-expect-error required import.
const a = SearchSimplePager;
//@ts-expect-error required import.
const b = SearchRoot;

const meta: Meta = {
  title: 'Components/search-simple-pager',
  tags: ['autodocs'],
  component: 'search-simple-pager',
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

export const Simple: Story = {
  render: ({
    pagesToDisplay,
    firstLastPagesToDisplay,
    prevLabel,
    nextLabel,
    firstLabel,
    lastLabel,
    showNextPrev,
    showFirstLast,
  }) =>
    html`<search-simple-pager
      pagesToDisplay="${pagesToDisplay}"
      ?firstLastPagesToDisplay="${firstLastPagesToDisplay}"
      prevLabel="${prevLabel}"
      nextLabel="${nextLabel}"
      firstLabel="${firstLabel}"
      lastLabel="${lastLabel}"
      ?showNextPrev=${showNextPrev}
      ?showFirstLast=${showFirstLast}
    ></search-simple-pager>`,
  args: {
    pagesToDisplay: 0,
    firstLastPagesToDisplay: 0,
    prevLabel: '<',
    nextLabel: '>',
    firstLabel: 'First',
    lastLabel: 'Last',
    showNextPrev: true,
    showFirstLast: false,
  },
};

export const Everything: Story = {
  render: ({
    pagesToDisplay,
    firstLastPagesToDisplay,
    prevLabel,
    nextLabel,
    firstLabel,
    lastLabel,
    showNextPrev,
    showFirstLast,
  }) =>
    html`<search-simple-pager
      pagesToDisplay="${pagesToDisplay}"
      ?firstLastPagesToDisplay="${firstLastPagesToDisplay}"
      prevLabel="${prevLabel}"
      nextLabel="${nextLabel}"
      firstLabel="${firstLabel}"
      lastLabel="${lastLabel}"
      ?showNextPrev=${showNextPrev}
      ?showFirstLast=${showFirstLast}
    ></search-simple-pager>`,
  args: {
    pagesToDisplay: 2,
    firstLastPagesToDisplay: 0,
    prevLabel: '<',
    nextLabel: '>',
    firstLabel: 'First',
    lastLabel: 'Last',
    showNextPrev: true,
    showFirstLast: true,
  },
};
