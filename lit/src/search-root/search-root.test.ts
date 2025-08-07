import {$, expect} from '@wdio/globals';
import './search-root.ts';

describe( 'search-root', () => {
  let elem, root, t: HTMLElement;

  beforeEach(() => {});

  it('default summaryText should render', async () => {
    root = document.createElement('search-root');
    root.setAttribute('url', 'http://localhost:8181/api/search/mock-index');
    elem = document.createElement('search-result-summary');
    root.appendChild(elem);

    document.body.appendChild(root);
    // const summary = $('search-result-summary > div');
    //
    // await expect(summary).toHaveText('1 - 5 of 21');
  });

  afterEach(() => {
    root.remove();
  });
});
