<?php

namespace Drupal\search_web_components_block\EventSubscriber;

use Drupal\search_api_solr\Event\PostConvertedQueryEvent;
use Drupal\search_api_solr\Event\SearchApiSolrEvents;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

/**
 * @package Drupal\search_web_components_block\EventSubscriber
 */
class SearchQueryEventSubscriber implements EventSubscriberInterface {
  /**
   * {@inheritdoc}
   */
  public static function getSubscribedEvents(): array {
    return [
      SearchApiSolrEvents::POST_CONVERT_QUERY => 'postQuery',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function postQuery(PostConvertedQueryEvent $event): void {
    $search_query = $event->getSearchApiQuery();
    $search_index = $search_query->getIndex();
    if (empty($search_index)) {
      return;
    }
    $featured_field = $search_index->getField('featured');
    if ($search_index->id() === 'spaces' && !empty($featured_field) && $featured_field->getType() === 'boolean') {
      $query = $event->getSolariumQuery();
      $sorts = $query->getSorts();
      $query->setSorts([
        'bs_featured' => 'desc',
      ] + $sorts);
    }
  }
}