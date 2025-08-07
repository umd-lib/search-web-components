import {$, expect} from '@wdio/globals';
import '../search-root/search-root.ts';
import './search-results-switcher.ts';

describe( 'search-results-switcher', () => {
  let elem, root, t: HTMLElement;

  beforeEach(() => {});

  it('response options should render', async () => {
    root = document.createElement('search-root');
    root.setAttribute('url', 'http://localhost:8181/api/search/mock-index');
    elem = document.createElement('search-results-switcher');
    root.appendChild(elem);

    document.body.appendChild(root);
    const options = $('search-results-switcher > ul');
    await expect(options).toExist();
    await expect(options).toHaveChildren(2);
    await expect($('search-results-switcher button[name="list"]')).toExist();
    await expect($('search-results-switcher button[name="list"]')).toHaveText('List');
  });

  it('override options should render', async () => {
    const newOptions = [{
      key: 'testKey',
      label: 'Test Key',
    }]
    root = document.createElement('search-root');
    root.setAttribute('url', 'http://localhost:8181/api/search/mock-index');
    elem = document.createElement('search-results-switcher');
    elem.setAttribute('options', JSON.stringify(newOptions));
    root.appendChild(elem);

    document.body.appendChild(root);
    const options = $('search-results-switcher > ul');
    await expect(options).toExist();
    await expect(options).toHaveChildren(1);
  });

  it('click should update button', async () => {
    root = document.createElement('search-root');
    root.setAttribute('url', 'http://localhost:8181/api/search/mock-index');
    elem = document.createElement('search-results-switcher');
    root.appendChild(elem);

    document.body.appendChild(root);
    const option = $('search-results-switcher button[name="grid"]');
    await expect(option).toExist();
    await option.click();

    await expect(option).toHaveAttribute('aria-pressed', 'true');
  });

  afterEach(() => {
    root.remove();
  });
});
