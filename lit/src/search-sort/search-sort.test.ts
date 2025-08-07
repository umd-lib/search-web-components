import {expect, $} from '@wdio/globals';
import {Key} from 'webdriverio';
import '../search-root/search-root.ts';
import './search-sort.ts';

describe('search-sort', () => {
  let elem, root, t: HTMLElement;

  beforeEach(() => {
    root = document.createElement('search-root');
    root.setAttribute('url', 'http://localhost:8181/api/search/mock-index');
  });

  it('select should render', async () => {
    elem = document.createElement('search-sort');
    elem.setAttribute('type', 'select');
    root.appendChild(elem);

    document.body.appendChild(root);
    const select = $('search-sort select');

    await expect(select).toExist();
    await expect(select).toHaveChildren(3);
  });

  it('select should update url', async () => {
    elem = document.createElement('search-sort');
    elem.setAttribute('type', 'select');
    root.appendChild(elem);

    document.body.appendChild(root);
    const select = $('search-sort select');
    await expect(select).toExist();

    await select.click();

    const option = $('search-sort select option[value="title|asc"]');
    await expect(option).toExist();
    await option.click();
    await expect(browser).toHaveUrl(expect.stringContaining('sort=title'));
    await expect(browser).toHaveUrl(expect.stringContaining('order=asc'));
  });

  it('list should render', async () => {
    elem = document.createElement('search-sort');
    elem.setAttribute('type', 'list');
    root.appendChild(elem);

    document.body.appendChild(root);
    const list = $('search-sort ul');

    await expect(list).toExist();
    await expect(list).toHaveChildren(3);
  });

  it('list should update url', async () => {
    elem = document.createElement('search-sort');
    elem.setAttribute('type', 'list');
    root.appendChild(elem);

    document.body.appendChild(root);
    const list = $('search-sort ul');
    await expect(list).toExist();
    const option = $('search-sort ul button[value="title|asc"]');
    await expect(option).toExist();
    await option.click();
    await expect(browser).toHaveUrl(expect.stringContaining('sort=title'));
    await expect(browser).toHaveUrl(expect.stringContaining('order=asc'));
  });

  it('default sort should be removed from url', async () => {
    elem = document.createElement('search-sort');
    elem.setAttribute('type', 'list');
    root.appendChild(elem);

    document.body.appendChild(root);
    const list = $('search-sort ul');
    await expect(list).toExist();
    const option = $('search-sort ul button[value="title|asc"]');
    await expect(option).toExist();
    await option.click();
    await expect(browser).toHaveUrl(expect.stringContaining('sort=title'));
    await expect(browser).toHaveUrl(expect.stringContaining('order=asc'));
    const optionDefault = $('search-sort ul button[value="search_api_relevance|desc"]');
    await expect(optionDefault).toExist();
    await optionDefault.click();
    await expect(browser).not.toHaveUrl(expect.stringContaining('sort='));
    await expect(browser).not.toHaveUrl(expect.stringContaining('order='));
  });

  it('html dropdown should render', async () => {
    elem = document.createElement('search-sort');
    elem.setAttribute('type', 'html');
    root.appendChild(elem);

    document.body.appendChild(root);
    const select = $('search-sort .combo-input');
    await expect(select).toExist();

    await select.click();
    const options = $('search-sort .combo-options');
    expect(options).toExist();
    await expect(options).toHaveChildren(4);
  });

  it('html should update url', async () => {
    elem = document.createElement('search-sort');
    elem.setAttribute('type', 'html');
    root.appendChild(elem);

    document.body.appendChild(root);
    const select = $('search-sort .combo-input');
    await expect(select).toExist();

    await select.click();
    const option = $('search-sort .combo-options div[data-value="title|asc"]');
    await expect(option).toExist();
    await option.click();
    await expect(browser).toHaveUrl(expect.stringContaining('sort=title'));
    await expect(browser).toHaveUrl(expect.stringContaining('order=asc'));
    await root.click();
    await expect($('search-sort .combo-input')).toHaveText('A-Z');
  });

  it('html htmlSelectLabel attribute', async () => {
    elem = document.createElement('search-sort');
    elem.setAttribute('type', 'html');
    elem.setAttribute('htmlSelectLabel', 'Test text');
    root.appendChild(elem);

    document.body.appendChild(root);
    await $('search-sort .combo-input').click();
    await expect($('search-sort .combo-option-label')).toHaveText('Test text');
  });

  it('select empty labelText attribute', async () => {
    elem = document.createElement('search-sort');
    elem.setAttribute('type', 'select');
    elem.setAttribute('labelText', '');
    root.appendChild(elem);

    document.body.appendChild(root);
    await expect($('search-sort > label')).not.toExist();
  });

  it('list empty labelText attribute', async () => {
    elem = document.createElement('search-sort');
    elem.setAttribute('type', 'list');
    elem.setAttribute('labelText', '');
    root.appendChild(elem);

    document.body.appendChild(root);
    await expect($('search-sort > label')).not.toExist();
  });

  it('select labelText attribute', async () => {
    elem = document.createElement('search-sort');
    elem.setAttribute('type', 'select');
    elem.setAttribute('labelText', 'Test text');
    root.appendChild(elem);

    document.body.appendChild(root);
    await expect($('search-sort > label')).toHaveText('Test text');
  });

  it('list labelText attribute', async () => {
    elem = document.createElement('search-sort');
    elem.setAttribute('type', 'list');
    elem.setAttribute('labelText', 'Test text');
    root.appendChild(elem);

    document.body.appendChild(root);
    await expect($('search-sort > label')).toHaveText('Test text');
  });

  it('html labelText attribute', async () => {
    elem = document.createElement('search-sort');
    elem.setAttribute('type', 'html');
    elem.setAttribute('labelText', 'Test text');
    root.appendChild(elem);

    document.body.appendChild(root);
    await expect($('search-sort > label')).toHaveText('Test text');
  });

  it('passed sorts should override', async () => {
    const newSorts = [
      {
        key: 'example_field',
        label: 'Example',
        order: 'asc or desc',
      },
    ];

    elem = document.createElement('search-sort');
    elem.setAttribute('type', 'select');
    elem.setAttribute('sorts', JSON.stringify(newSorts));
    root.appendChild(elem);

    document.body.appendChild(root);
    const select = $('search-sort select');

    await expect(select).toExist();
    await expect(select).toHaveChildren(1);
  });

  it('html should support keyboard inputs', async () => {
    const newSorts = [
      {
        key: 'example_field_enter',
        label: 'Example Enter',
        order: 'asc',
      },
      {
        key: 'example_field1',
        label: 'Example1',
        order: 'asc',
      },
      {
        key: 'example_field_repeat',
        label: 'Example Repeat',
        order: 'asc',
      },
      {
        key: 'example_field3',
        label: 'Example3',
        order: 'asc',
      },
    ];

    elem = document.createElement('search-sort');
    elem.setAttribute('type', 'html');
    elem.setAttribute('sorts', JSON.stringify(newSorts));
    root.appendChild(elem);

    document.body.appendChild(root);
    const select = $('search-sort .combo-input');
    await expect(select).toExist();

    await select.click();
    await browser.keys([Key.ArrowDown, Key.ArrowDown]);

    const option = $('search-sort .combo-option.focused');
    expect(option).toHaveAttribute('data-value', 'example_field_enter|asc');
    await browser.keys(Key.Enter);
    await expect(browser).toHaveUrl(
      expect.stringContaining('sort=example_field_enter')
    );
    await expect(browser).toHaveUrl(expect.stringContaining('order=asc'));

    await select.click();
    await browser.keys(['e', 'e', 'e']);
    const option2 = $('search-sort .combo-option.focused');
    expect(option2).toHaveAttribute('data-value', 'example_field_repeat|asc');
    await browser.keys(Key.Enter);

    await expect(browser).toHaveUrl(
      expect.stringContaining('sort=example_field_repeat')
    );
    await expect(browser).toHaveUrl(expect.stringContaining('order=asc'));
  });

  afterEach(() => {
    root.remove();
  });
});
