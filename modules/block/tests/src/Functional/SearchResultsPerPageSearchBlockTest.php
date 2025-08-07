<?php

namespace Drupal\Tests\search_web_components_block\Functional;

/**
 * Tests basic block functionality.
 *
 * @group search_web_components_block
 */
class SearchResultsPerPageSearchBlockTest extends SearchBlockTestBase {

  /**
   * {@inheritdoc}
   */
  public function getElementTag() {
    return 'search-results-per-page';
  }

  /**
   * {@inheritdoc}
   */
  public function getBlockId() {
    return 'swc_search_results_per_page';
  }

  /**
   * {@inheritdoc}
   */
  public function getAllAttributes(): array {
    return [
      'type' => [
        'value' => 'test',
        'expected' => 'test',
      ],
      'labelText' => [
        'value' => 'test',
        'expected' => 'test',
      ],
      'options' => [
        'value' => 'test1|test2',
        'expected' => '[{"key":"test1","label":"test2"}]',
      ],
      'htmlSelectLabel' => [
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
      'type' => [
        'value' => '',
        'expected' => '',
      ],
      'labelText' => [
        'value' => '',
        'expected' => NULL,
      ],
      'options' => [
        'value' => '',
        'expected' => NULL,
      ],
      'htmlSelectLabel' => [
        'value' => '',
        'expected' => NULL,
      ],
    ];
  }

}
