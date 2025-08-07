import {ContextRoot, createContext} from '@lit/context';
import {SearchContext} from './types';

let hasContextRoot = false;
export const ensureContextRoot = () => {
  if (hasContextRoot) {
    return;
  }
  hasContextRoot = true;
  const root = new ContextRoot();
  root.attach(document.body);
};

export const searchContext = createContext<SearchContext>(
  Symbol('search-context')
);
