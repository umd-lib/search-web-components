import type {Meta, StoryObj} from '@storybook/web-components';
import {html} from 'lit';
import {FacetCheckbox} from '../facet-checkbox/facet-checkbox';
import {SearchAppliedFacets} from '../search-applied-facets/search-applied-facets';
import {SearchNoResultsMessage} from '../search-no-results-message/search-no-results-message';
import {SearchResultElementDefault} from '../search-result-element-default/search-result-element-default';
import {SearchResultSummary} from '../search-result-summary/search-result-summary';
import {SearchResultsPerPage} from '../search-results-per-page/search-results-per-page';
import {SearchSimplePager} from '../search-simple-pager/search-simple-pager';
import {SearchSort} from '../search-sort/search-sort';
import {SearchInput} from '../search-input/search-input';
import {SearchRoot} from '../search-root/search-root';
import {SearchResultElementRendered} from '../search-result-element-rendered/search-result-element-rendered';
import {MockData} from '../MockData';
import {SearchResults} from '../search-results/search-results';
import {FacetDropdown} from '../facet-dropdown/facet-dropdown';
import {SearchResultsSwitcher} from '../search-results-switcher/search-results-switcher';

//@ts-expect-error required import.
const a = FacetCheckbox;
const m = FacetDropdown;
const b = SearchAppliedFacets;
const c = SearchInput;
const d = SearchNoResultsMessage;
const e = SearchResultElementDefault;
const f = SearchResultElementRendered;
const g = SearchResultSummary;
const n = SearchResultsSwitcher;
const h = SearchResultsPerPage;
const i = SearchSimplePager;
const j = SearchSort;
const k = SearchRoot;
const l = SearchResults;

const meta: Meta = {
  title: 'Example/Page',
  component: 'example-page',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Primary: Story = {
  render: ({placeHolderText, labelText, clearText}) => html` <search-root
    url=${MockData.url}
    defaultPerPage="10"
  >
    <div style="display: flex; flex-direction: column">
      <div style="display: flex; flex-direction: row">
        <div style="width: 25%">
          <div style="margin-bottom: 1rem">
            <search-result-summary></search-result-summary>
          </div>
          <facet-checkbox showLabel key="type"></facet-checkbox>
          <facet-dropdown showLabel key="type"></facet-dropdown>
        </div>
        <div style="width: 75%">
          <div style="width: 100%">
            <div
              style="display: flex; flex-direction: row; justify-content: space-between"
            >
              <search-input
                labelText="Search"
                placeHolderText="Search"
              ></search-input>
              <search-sort></search-sort>
              <search-results-per-page></search-results-per-page>
              <search-results-switcher></search-results-switcher>
            </div>
            <div>
              <search-applied-facets
                showReset
                showIndividual
              ></search-applied-facets>
            </div>
          </div>
          <search-results></search-results>
          <search-no-results-message>
            <div>There are no results.</div>
          </search-no-results-message>
          <search-simple-pager
            prevLabel="<"
            nextLabel=">"
          ></search-simple-pager>
        </div>
      </div>
    </div>
  </search-root>`,
  args: {
    placeHolderText: 'Search',
    labelText: 'Search',
    clearText: 'Remove',
  },
};
