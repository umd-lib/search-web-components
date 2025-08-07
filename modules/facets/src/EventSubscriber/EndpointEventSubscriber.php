<?php

namespace Drupal\search_web_components_facets\EventSubscriber;

use Drupal\Component\Plugin\Factory\FactoryInterface;
use Drupal\facets\FacetInterface;
use Drupal\facets\FacetManager\DefaultFacetManager;
use Drupal\search_api_decoupled\Event\SearchApiEndpointEvents;
use Drupal\search_api_decoupled\Event\SearchApiEndpointResultsAlter;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

/**
 * Add facet config to the search api endpoint.
 */
class EndpointEventSubscriber implements EventSubscriberInterface {

  /**
   * The facet manager.
   *
   * @var \Drupal\facets\FacetManager\DefaultFacetManager
   */
  protected $facetManager;

  /**
   * The facets query type manager.
   *
   * @var \Drupal\Component\Plugin\Factory\FactoryInterface
   */
  protected $queryTypeManager;

  /**
   * Constructs a new SearchApiEndpointEventSubscriber object.
   *
   * @param \Drupal\facets\FacetManager\DefaultFacetManager $facet_manager
   *   The facets manager.
   * @param \Drupal\Component\Plugin\Factory\FactoryInterface $query_type_manager
   *   The query type manager.
   */
  public function __construct(DefaultFacetManager $facet_manager, FactoryInterface $query_type_manager) {
    $this->facetManager = $facet_manager;
    $this->queryTypeManager = $query_type_manager;
  }

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
    $facets = $this->facetManager->getFacetsByFacetSourceId('search_api:search_api_endpoint__' . $search_api_endpoint->id());

    $search_response['facets'] = [];
    foreach ($facets as $facet) {
      $query_type_plugin_config = [
        'facet' => $facet,
        'query' => $event->getResult()->getQuery(),
      ];
      // Perform query type specific operations.
      $this->queryTypeManager->createInstance($facet->getQueryType(), $query_type_plugin_config)
        ->build();
      // Build the facet and run all processors.
      $built_facet = $this->facetManager->returnBuiltFacet($facet);
      // Process built facet results including hierarchy.
      $built_results = [];
      $this->processFacetResults($built_facet->getResults(), $built_results, $facet);
      $settings = $this->getExposedSettings($facet);
      $search_response['facets'][] = [
        'label' => $facet->label(),
        'key' => $facet->id(),
        'count' => count($built_facet->getResults()),
        'active_values' => $facet->getActiveItems(),
        'results' => $built_results,
        'settings' => $settings,
      ];
    }

    $event->setResponse($search_response);
  }

  /**
   * Get the exposed settings for the facet.
   *
   * @param \Drupal\facets\FacetInterface $facet
   *   The facet to get settings for.
   *
   * @return array
   *   The exposed settings for the facet.
   */
  public function getExposedSettings(FacetInterface $facet): array {
    $include = [
      'widget',
      'show_title',
      'empty_behavior',
      'url_alias',
      'show_only_one_result',
      'hard_limit',
      'missing',
      'missing_label',
    ];

    $settings = [];
    foreach ($include as $key) {
      if ($key === 'widget') {
        $settings[$key] = $facet->get($key)['config'];
      }
      else {
        $settings[$key] = $facet->get($key);
      }
    }

    return $settings;
  }

  /**
   * Process facets results.
   *
   * @param \Drupal\facets\Result\Result[] $facet_results
   *   The facet results.
   * @param array $built_results
   *   Processed facet results.
   * @param \Drupal\facets\FacetInterface $facet
   *   The facet to get results for.
   */
  protected function processFacetResults(array $facet_results, array &$built_results, FacetInterface $facet) {
    /** @var \Drupal\facets\Result\Result $facet_result */
    foreach ($facet_results as $facet_result) {
      $children_expanded = $facet_result->getChildren() && ($facet->getExpandHierarchy() || $facet_result->isActive() || $facet_result->hasActiveChildren());
      $built_result = [
        'label' => $facet_result->getDisplayValue(),
        'count' => $facet_result->getCount(),
        'key' => $facet_result->getRawValue(),
        'active' => $facet_result->isActive(),
        'in_active_trail' => $facet_result->hasActiveChildren(),
        'children_expanded' => $children_expanded,
        'children' => [],
      ];
      $children = $facet_result->getChildren();
      if ($children_expanded) {
        $this->processFacetResults($children, $built_result['children'], $facet);
      }
      $built_results[] = $built_result;
    }
  }

}
