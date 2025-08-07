import type {Meta, StoryObj} from '@storybook/web-components';
import {html} from 'lit';
import {SearchRoot} from '../search-root/search-root';
import {FacetButton} from './facet-button';

//@ts-expect-error required import.
const a = FacetButton;
//@ts-expect-error required import.
const b = SearchRoot;

const meta: Meta = {
  title: 'Facets/facet-button',
  tags: ['autodocs'],
  component: 'facet-button',
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
  render: ({
    key,
    overrideLabel,
    showCount,
    showLabel,
    showReset,
    resetText,
    collapsible,
    closed,
    showCountInCollapseLabel,
    preferAttributes,
    softLimit,
    softLimitLessLabel,
    softLimitMoreLabel,
  }) =>
    html`<facet-button
      key="${key}"
      overrideLabel="${overrideLabel}"
      ?showLabel="${showLabel}"
      ?showCount="${showCount}"
      ?showReset="${showReset}"
      ?resetText="${resetText}"
      ?collapsible="${collapsible}"
      ?closed="${closed}"
      ?showCountInCollapseLabel="${showCountInCollapseLabel}"
      ?preferAttributes="${preferAttributes}"
      ?softLimit="${softLimit}"
      ?softLimitLessLabel="${softLimitLessLabel}"
      ?softLimitMoreLabel="${softLimitMoreLabel}"
    ></facet-button>`,
  args: {
    key: 'type',
    overrideLabel: '',
    showCount: true,
    showLabel: true,
    showReset: true,
    resetText: '',
    collapsible: false,
    closed: false,
    showCountInCollapseLabel: false,
    preferAttributes: false,
    softLimit: 0,
    softLimitLessLabel: 'Show Less',
    softLimitMoreLabel: 'Show More',
  },
};

export const Collapsible: Story = {
  render: ({
    key,
    overrideLabel,
    showCount,
    showLabel,
    showReset,
    resetText,
    collapsible,
    closed,
    showCountInCollapseLabel,
    preferAttributes,
    softLimit,
    softLimitLessLabel,
    softLimitMoreLabel,
  }) =>
    html`<facet-button
      key="${key}"
      overrideLabel="${overrideLabel}"
      ?showLabel="${showLabel}"
      ?showCount="${showCount}"
      ?showReset="${showReset}"
      ?resetText="${resetText}"
      ?collapsible="${collapsible}"
      ?closed="${closed}"
      ?showCountInCollapseLabel="${showCountInCollapseLabel}"
      ?preferAttributes="${preferAttributes}"
      ?softLimit="${softLimit}"
      ?softLimitLessLabel="${softLimitLessLabel}"
      ?softLimitMoreLabel="${softLimitMoreLabel}"
    ></facet-button>`,
  args: {
    key: 'type',
    overrideLabel: '',
    showCount: true,
    showLabel: true,
    showReset: true,
    resetText: '',
    collapsible: true,
    closed: true,
    showCountInCollapseLabel: true,
    preferAttributes: false,
    softLimit: 0,
    softLimitLessLabel: 'Show Less',
    softLimitMoreLabel: 'Show More',
  },
};
