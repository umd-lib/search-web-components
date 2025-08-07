<?php

namespace Drupal\Tests\search_web_components_block\Functional;

/**
 * Tests basic block functionality.
 *
 * @group search_web_components_block
 */
class SearchResultsSearchBlockTest extends SearchBlockTestBase {

  /**
   * {@inheritdoc}
   */
  public function getElementTag() {
    return 'search-results';
  }

  /**
   * {@inheritdoc}
   */
  public function getBlockId() {
    return 'swc_search_results';
  }

  /**
   * {@inheritdoc}
   */
  public function getAllAttributes(): array {
    return [
      'resultField' => [
        'value' => 'test',
        'expected' => 'test',
      ],
      'mappings' => [
        'value' => 'test',
        'expected' => 'test',
      ],
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function getNoAttributes(): array {
    return [
      'resultField' => [
        'value' => '',
        'expected' => NULL,
      ],
      'mappings' => [
        'value' => '',
        'expected' => NULL,
      ],
    ];
  }

}
