import {$, expect} from '@wdio/globals';
import '../search-root/search-root.ts';
import './search-simple-pager.ts';

describe( 'search-simple-pager', () => {
  let elem, root, t: HTMLElement;

  it('default should render', async () => {
    root = document.createElement('search-root');
    root.setAttribute('url', 'http://localhost:8181/api/search/mock-index');
    elem = document.createElement('search-simple-pager');
    root.appendChild(elem);

    document.body.appendChild(root);
    const elems = $('search-simple-pager > div');
    await expect(elems).toExist();

    const prev = $('search-simple-pager .prev');
    await expect(prev).not.toExist();

    const current = $('search-simple-pager .current');
    await expect(current).toExist();
    await expect(current).toHaveAttribute('aria-pressed', 'true');
    await expect(current).toHaveText('1');

    const next = $('search-simple-pager .next');
    await expect(next).not.toExist();
  });

  it('label overrides should display', async () => {
    root = document.createElement('search-root');
    root.setAttribute('url', 'http://localhost:8181/api/search/mock-index');
    elem = document.createElement('search-simple-pager');
    const prevLabel = 'Prev label override';
    const nextLabel = 'Next label override';
    const firstLabel = 'First label override';
    const lastLabel = 'Last label override';

    elem.prevLabel = prevLabel;
    elem.nextLabel = nextLabel;
    elem.firstLabel = firstLabel;
    elem.lastLabel = lastLabel;
    elem.showFirstLast = '';
    elem.showNextPrev = '';
    root.appendChild(elem);

    document.body.appendChild(root);

    expect($('search-simple-pager prev.button')).toHaveText(prevLabel);
    expect($('search-simple-pager next.button')).toHaveText(prevLabel);
    expect($('search-simple-pager last.button')).toHaveText(prevLabel);
    expect($('search-simple-pager first.button')).toHaveText(prevLabel);
  });

  it('next and previous buttons should render and work', async () => {
    root = document.createElement('search-root');
    root.setAttribute('url', 'http://localhost:8181/api/search/mock-index');
    elem = document.createElement('search-simple-pager');
    elem.setAttribute('showNextPrev', "")
    root.appendChild(elem);

    document.body.appendChild(root);
    const elems = $('search-simple-pager > div');
    await expect(elems).toExist();

    const prev = $('search-simple-pager .prev');
    await expect(prev).toExist();
    await expect(prev).toHaveAttribute('disabled');
    await expect(prev).toHaveText('<');

    const next = $('search-simple-pager .next');
    await expect(next).toExist();
    await expect(next).not.toHaveAttribute('disabled');
    await expect(next).toHaveText('>');

    await next.click();
    const prevNext = $('search-simple-pager .prev');
    await expect(prevNext).toExist();
    await expect(prevNext).not.toHaveAttribute('disabled');
    await expect(prevNext).toHaveText('<');

    const nextNext = $('search-simple-pager .next');
    await expect(nextNext).toExist();
    await expect(nextNext).not.toHaveAttribute('disabled');
    await expect(nextNext).toHaveText('>');

    // @todo for some reason the param "page=1" persists to the next test. To
    //   work around this just manually navigate back to an empty state.
    await prevNext.click();
  });

  it('first and last buttons should render and work', async () => {
    root = document.createElement('search-root');
    root.setAttribute('url', 'http://localhost:8181/api/search/mock-index');
    elem = document.createElement('search-simple-pager');
    elem.setAttribute('showFirstLast', '')
    root.appendChild(elem);

    document.body.appendChild(root);
    const elems = $('search-simple-pager > div');
    await expect(elems).toExist();

    const first = $('search-simple-pager .first');
    await expect(first).toExist();
    await expect(first).toHaveAttribute('disabled');
    await expect(first).toHaveText('First page');

    const last = $('search-simple-pager .last');
    await expect(last).toExist();
    await expect(last).not.toHaveAttribute('disabled');
    await expect(last).toHaveText('Last page');

    await last.click()

    const firstLast = $('search-simple-pager .first');
    await expect(firstLast).toExist();
    await expect(firstLast).not.toHaveAttribute('disabled');
    await expect(firstLast).toHaveText('First page');

    const lastLast = $('search-simple-pager .last');
    await expect(lastLast).toExist();
    await expect(lastLast).toHaveAttribute('disabled');
    await expect(lastLast).toHaveText('Last page');

    // @todo for some reason the param "page=1" persists to the next test. To
    //   work around this just manually navigate back to an empty state.
    firstLast.click();
  });

  it('pages to display should correctly list available pages', async () => {
    root = document.createElement('search-root');
    root.setAttribute('url', 'http://localhost:8181/api/search/mock-index');
    elem = document.createElement('search-simple-pager');
    elem.setAttribute('showFirstLast', '')
    elem.setAttribute('pagesToDisplay', '2')
    root.appendChild(elem);

    document.body.appendChild(root);

    await $('search-simple-pager .next.page').waitForExist({ timeout: 1000 })

    const last = $('search-simple-pager .last');
    const next = $$('search-simple-pager .next.page');

    await expect(next).toBeElementsArrayOfSize(2);
    await expect($('search-simple-pager .prev.page')).not.toExist();

    await last.click();
    await $('search-simple-pager .prev.page').waitForExist({ timeout: 1000 })

    await expect($$('search-simple-pager .prev.page')).toBeElementsArrayOfSize(2);
    await expect($('search-simple-pager .next.page')).not.toExist();

    // @todo for some reason the param "page=1" persists to the next test. To
    //   work around this just manually navigate back to an empty state.
    $('search-simple-pager .first').click();
  });

  it('first last pages to display should correctly list available pages', async () => {
    root = document.createElement('search-root');
    root.setAttribute('url', 'http://localhost:8181/api/search/mock-index');
    elem = document.createElement('search-simple-pager');
    elem.setAttribute('showFirstLast', '')
    elem.setAttribute('firstLastPagesToDisplay', '1')
    root.appendChild(elem);

    document.body.appendChild(root);

    await $('search-simple-pager .next.page').waitForExist({ timeout: 1000 })

    const last = $('search-simple-pager .last');
    const next = $$('search-simple-pager .next.page');

    await expect(next).toBeElementsArrayOfSize(1);
    await expect($('search-simple-pager .prev.page')).not.toExist();

    await last.click();
    await $('search-simple-pager .prev.page').waitForExist({ timeout: 1000 })

    await expect($$('search-simple-pager .prev.page')).toBeElementsArrayOfSize(1);
    await expect($('search-simple-pager .next.page')).not.toExist();
  });

  afterEach(() => {
    root.remove();
  });
});
