export interface SearchResponseType {
  search_results: SearchResultType[];
  search_results_count: number;
  search_results_page: number;
  search_results_pages: number;
  search_results_per_page: number;
  default_sort: string;
  default_sort_order: string;
  facets: SearchFacetsType[];
  took: number;
  max_score: number;
  swc_sorts: SortOption[];
  swc_page_sizes: SimpleValue[];
  swc_displays: SimpleValue[];
  swc_results: {
    field: string;
    mappings: SearchResultMappingType[];
  };
}

export interface SearchResultType {
  rendered_result: string;
  rendered_result_card?: string;
  rendered_source: string;
  url: string;
  nid: string;
  preview_image?: string;
  preview_text?: string;
  title: string;
  type: string;
  category?: string;
  id: string;
  score: number;
  created: string;
  excerpt: string | null;
  [key: string]: any;
}

export interface SearchFacetsType {
  active_values?: string[];
  label: string;
  key: string;
  count: number;
  results: ResultsType[];
  settings: {
    [key: string]: unknown;
    widget: {[key: string]: any};
    url_alias: string;
    show_title: boolean;
  };
}

export interface ResultsType {
  active?: boolean;
  label: string;
  count: number;
  key: string;
  children: ResultsType[];
  in_active_trail: boolean;
  children_expanded: boolean;
}

export interface SearchResultMappingType {
  element: string;
  keys: string[];
  settings: {
    [key: string]: any;
  };
}

export interface SearchContext {
  url?: string;
  defaultPerPage: string;
  responseReady?: boolean;
  query?: URLSearchParams;
  response?: SearchResponseType;
  updateUrl: boolean;
  resultDisplay: 'list' | 'grid' | string;
  additionalParams: string;
  dialogOpen: boolean;
  dialogBreakpoint: number;
  thirdPartySettings: {
    [key: string]: any;
  };
}

export interface FacetValue {
  key: string;
  facetKey: string;
  value: string;
}

export interface SimpleValue {
  label: string | number;
  value: string | number;
  key?: string | number;
}

export interface SortOption {
  label: string | number;
  key: string;
  order: string;
}

export interface UMDSort {
  sort_by: Array<string>;
  order: Array<string>;
  results_per: Array<string>;
  post: boolean;
}

declare global {
  interface GlobalEventHandlersEventMap {
    'update-context': CustomEvent<{context: SearchContext}>;
  }
}
