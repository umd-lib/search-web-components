<?php

namespace Drupal\Tests\search_web_components_block\Functional;

/**
 * Tests basic block functionality.
 *
 * @group search_web_components_block
 */
class SearchResultsSwitcherSearchBlockTest extends SearchBlockTestBase {

  /**
   * {@inheritdoc}
   */
  public function getElementTag() {
    return 'search-results-switcher';
  }

  /**
   * {@inheritdoc}
   */
  public function getBlockId() {
    return 'swc_search_results_switcher';
  }

  /**
   * {@inheritdoc}
   */
  public function getAllAttributes(): array {
    return [
      'options' => [
        'value' => 'test1|test2',
        'expected' => '[{"key":"test1","label":"test2"}]',
      ],
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function getNoAttributes(): array {
    return [
      'options' => [
        'value' => '',
        'expected' => NULL,
      ],
    ];
  }

}
