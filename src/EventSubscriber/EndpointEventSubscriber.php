<?php

namespace Drupal\search_web_components\EventSubscriber;

use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\search_api_decoupled\Event\SearchApiEndpointEvents;
use Drupal\search_api_decoupled\Event\SearchApiEndpointResultsAlter;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

/**
 * Add additional endpoint config to the search api endpoint response.
 *
 * @phpcs:disable Drupal.Semantics.FunctionT.NotLiteralString
 */
class EndpointEventSubscriber implements EventSubscriberInterface {

  use StringTranslationTrait;

  /**
   * {@inheritdoc}
   */
  public static function getSubscribedEvents(): array {
    return [
      SearchApiEndpointEvents::SEARCH_RESULTS_ALTER => 'onSearchResultsAlter',
    ];
  }

  /**
   * Change search result response.
   *
   * @param \Drupal\search_api_decoupled\Event\SearchApiEndpointResultsAlter $event
   *   The event.
   */
  public function onSearchResultsAlter(SearchApiEndpointResultsAlter $event) {
    $search_response = $event->getResponse();
    $search_api_endpoint = $event->getSearchApiEndpoint();

    $search_response['default_sort'] = $search_api_endpoint->getDefaultSort();
    $search_response['default_sort_order'] = $search_api_endpoint->getDefaultSortOrder();

    $settings = $search_api_endpoint->getThirdPartySettings('search_web_components');
    foreach ($settings['sorts'] as &$sort) {
      $sort['label'] = $this->t($sort['label']);
    }
    $search_response['swc_sorts'] = $settings['sorts'];

    foreach ($settings['page_sizes'] as &$size) {
      $size['label'] = $this->t($size['label']);
    }
    $search_response['swc_page_sizes'] = $settings['page_sizes'];

    foreach ($settings['displays'] as &$display) {
      $display['label'] = $this->t($display['label']);
    }
    $search_response['swc_displays'] = $settings['displays'];
    $search_response['swc_results'] = $settings['results'];

    $event->setResponse($search_response);
  }

}
