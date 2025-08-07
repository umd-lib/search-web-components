import {$, expect} from '@wdio/globals';
import '../search-root/search-root.ts';
import './search-result-summary.ts';

describe('search-result-summary', () => {
  let elem, root, t: HTMLElement;

  beforeEach(() => {});

  it('default summaryText should render', async () => {
    root = document.createElement('search-root');
    root.setAttribute('url', 'http://localhost:8181/api/search/mock-index');
    elem = document.createElement('search-result-summary');
    root.appendChild(elem);

    document.body.appendChild(root);
    const summary = $('search-result-summary > div');

    await expect(summary).toHaveText('1 - 5 of 22');
  });

  it('variable replacement should render', async () => {
    root = document.createElement('search-root');
    root.setAttribute('url', 'http://localhost:8181/api/search/mock-index');
    elem = document.createElement('search-result-summary');
    elem.setAttribute('summaryText', '@start|@end|@total|@searchQuery|@time');
    root.appendChild(elem);

    document.body.appendChild(root);
    const summary = $('search-result-summary > div');

    await expect(summary).toHaveText('1|5|22||0.0', {atStart: true});
  });

  it('no results variable replacement should render', async () => {
    root = document.createElement('search-root');
    root.setAttribute('url', 'http://localhost:8181/api/search/no-results');
    elem = document.createElement('search-result-summary');
    elem.setAttribute('summaryText', '@start|@end|@total|@searchQuery|@time');
    root.appendChild(elem);

    document.body.appendChild(root);
    const summary = $('search-result-summary > div');

    await expect(summary).toHaveText('0|0|0||0.0', {atStart: true});
  });

  it('empty response variable replacement should render', async () => {
    root = document.createElement('search-root');
    root.setAttribute('url', 'http://localhost:8181/api/search/empty-body');
    elem = document.createElement('search-result-summary');
    elem.setAttribute('summaryText', '@start|@end|@total|@searchQuery|@time');
    root.appendChild(elem);

    document.body.appendChild(root);
    const summary = $('search-result-summary > div');

    await expect(summary).toHaveText('1|10|undefined||');
  });

  afterEach(() => {
    root.remove();
  });
});
