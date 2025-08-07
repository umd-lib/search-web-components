import {$, expect} from '@wdio/globals';
import '../search-root/search-root.ts';
import './search-input.ts';

describe( 'search-input', () => {
  let elem, root, t: HTMLElement;

  beforeEach(() => {});

  it('should render', async () => {
    root = document.createElement('search-root');
    root.setAttribute('url', 'http://localhost:8181/api/search/mock-index');
    elem = document.createElement('search-input');
    elem.setAttribute('placeHolderText', 'place text');
    elem.setAttribute('labelText', 'label text');
    elem.setAttribute('clearText', 'remove text');
    root.appendChild(elem);

    document.body.appendChild(root);
    const form = $('search-input form');
    await expect(form).toExist();
    const input = $('search-input input');
    await expect(input).toExist();
    const submit = $('search-input button[type="submit"]');
    await expect(submit).toExist();

    await expect($('search-input input[placeholder="place text"]')).toExist();
    await expect(submit).toHaveText('label text');

    await input.click();
    await browser.keys(['t','e','s','t',])

    await submit.click();
    await expect(browser).toHaveUrl(expect.stringContaining('q=test'))

    const clear = $('search-input .search-input-clear');
    await expect(clear).toExist();
    await clear.click();
    await expect(browser).not.toHaveUrl(expect.stringContaining('q=test'))
  });

  it('no query should render', async () => {
    root = document.createElement('search-root');
    root.setAttribute('url', 'http://localhost:8181/api/search/mock-index');
    elem = document.createElement('search-input');
    elem.setAttribute('placeHolderText', 'place text');
    elem.setAttribute('labelText', 'label text');
    elem.setAttribute('clearText', 'remove text');
    root.appendChild(elem);

    document.body.appendChild(root);
    const submit = $('search-input button[type="submit"]');

    await submit.click();
    await expect(browser).not.toHaveUrl(expect.stringContaining('q='))
  });

  afterEach(() => {
    root.remove();
  });
});
