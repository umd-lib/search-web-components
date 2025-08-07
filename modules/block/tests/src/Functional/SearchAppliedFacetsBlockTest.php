<?php

namespace Drupal\Tests\search_web_components_block\Functional;

/**
 * Tests basic block functionality.
 *
 * @group search_web_components_block
 */
class SearchAppliedFacetsBlockTest extends SearchBlockTestBase {

  /**
   * {@inheritdoc}
   */
  public function getElementTag() {
    return 'search-applied-facets';
  }

  /**
   * {@inheritdoc}
   */
  public function getBlockId() {
    return 'swc_search_applied_facets';
  }

  /**
   * {@inheritdoc}
   */
  public function getAllAttributes(): array {
    return [
      'removeText' => [
        'value' => 'test',
        'expected' => 'test',
      ],
      'resetText' => [
        'value' => 'test',
        'expected' => 'test',
      ],
      'showReset' => [
        'value' => TRUE,
        'expected' => '',
      ],
      'showIndividual' => [
        'value' => TRUE,
        'expected' => '',
      ],
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function getNoAttributes(): array {
    return [
      'removeText' => [
        'value' => '',
        'expected' => NULL,
      ],
      'resetText' => [
        'value' => '',
        'expected' => NULL,
      ],
      'showReset' => [
        'value' => FALSE,
        'expected' => NULL,
      ],
      'showIndividual' => [
        'value' => FALSE,
        'expected' => NULL,
      ],
    ];
  }

}
