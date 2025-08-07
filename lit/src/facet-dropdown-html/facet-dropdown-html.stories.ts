import type {Meta, StoryObj} from '@storybook/web-components';
import {html} from 'lit';
import {SearchRoot} from '../search-root/search-root';
import {FacetDropdownHtml} from './facet-dropdown-html';

//@ts-expect-error required import.
const a = FacetDropdownHtml;
//@ts-expect-error required import.
const b = SearchRoot;

const meta: Meta = {
  title: 'Facets/facet-dropdown-html',
  tags: ['autodocs'],
  component: 'facet-dropdown-html',
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
    htmlSelectLabel,
    required,
    multipleSelect,
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
    html`<facet-dropdown-html
      ?htmlSelectLabel="${htmlSelectLabel}"
      ?required="${required}"
      ?multipleSelect="${multipleSelect}"
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
    ></facet-dropdown-html>`,
  args: {
    htmlSelectLabel: '',
    required: false,
    multipleSelect: false,
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
    htmlSelectLabel,
    required,
    multipleSelect,
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
    html`<facet-dropdown-html
      ?htmlSelectLabel="${htmlSelectLabel}"
      ?required="${required}"
      ?multipleSelect="${multipleSelect}"
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
    ></facet-dropdown-html>`,
  args: {
    htmlSelectLabel: '',
    required: false,
    multipleSelect: false,
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
