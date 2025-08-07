import {Preview, setCustomElementsManifest} from '@storybook/web-components';
import {initialize, mswDecorator} from 'msw-storybook-addon';
import {rest} from 'msw';
import {MockData, MockDataFacetPage, MockNoResults} from '../src/MockData';

initialize(
  {
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: './mockServiceWorker.js',
    },
  },
  [
    rest.get(MockData.url, (_req, res, ctx) => {
      return res(ctx.json(MockData.data));
    }),
    rest.get(MockDataFacetPage.url, (_req, res, ctx) => {
      return res(ctx.json(MockDataFacetPage.data));
    }),
    rest.get(MockNoResults.url, (_req, res, ctx) => {
      return res(ctx.json(MockNoResults.data));
    }),
  ]
);

import customElements from '../custom-elements.json';
setCustomElementsManifest(customElements);

const preview: Preview = {
  parameters: {
    decorators: [mswDecorator],
    actions: {argTypesRegex: '^on[A-Z].*'},
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
        string: /varian$/i,
      },
    },
    options: {
      storySort: {
        order: ['Example', 'Components', 'Facets'],
      },
    },
  },
};

export default preview;
