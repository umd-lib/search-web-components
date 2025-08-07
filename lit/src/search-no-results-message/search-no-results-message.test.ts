import {$, expect} from '@wdio/globals';
import '../search-root/search-root.ts';
import './search-no-results-message.ts';

describe( 'search-no-results-message', () => {
  let elem, root, t: HTMLElement;

  beforeEach(() => {});

  it('When there are results No results should not display', async () => {
    root = document.createElement('search-root');
    root.setAttribute('url', 'http://localhost:8181/api/search/mock-index');
    elem = document.createElement('search-no-results-message');
    elem.innerHTML = '<p>This is the no results message</p>'
    root.appendChild(elem);

    document.body.appendChild(root);
    const noResultsMessage = $('search-no-results-message > p');

    await expect(noResultsMessage).not.toBeDisplayed();
  });

  it('When there are no results No results should display', async () => {
    root = document.createElement('search-root');
    root.setAttribute('url', 'http://localhost:8181/api/search/no-results');
    elem = document.createElement('search-no-results-message');
    elem.innerHTML = '<p>This is the no results message</p>'
    root.appendChild(elem);

    document.body.appendChild(root);
    const noResultsMessage = $('search-no-results-message > p');

    await expect(noResultsMessage).toBeDisplayed();
  });

  afterEach(() => {
    root.remove();
  });
});
