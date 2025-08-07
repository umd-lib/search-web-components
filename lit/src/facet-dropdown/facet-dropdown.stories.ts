import type {Meta, StoryObj} from '@storybook/web-components';
import {html} from 'lit';
import {SearchRoot} from '../search-root/search-root';
import {FacetDropdown} from './facet-dropdown';

//@ts-expect-error required import.
const a = FacetDropdown;
//@ts-expect-error required import.
const b = SearchRoot;

const meta: Meta = {
  title: 'Facets/facet-dropdown',
  tags: ['autodocs'],
  component: 'facet-dropdown',
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
    selectLabel,
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
  }) =>
    html`<facet-dropdown
      selectLabel="${selectLabel}"
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
    ></facet-dropdown>`,
  args: {
    selectLabel: 'Select an option',
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
  },
};

export const Collapsible: Story = {
  render: ({
    selectLabel,
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
  }) =>
    html`<facet-dropdown
      selectLabel="${selectLabel}"
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
    ></facet-dropdown>`,
  args: {
    selectLabel: 'Select an option',
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
  },
};
