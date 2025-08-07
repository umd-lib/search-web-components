<?php

namespace Drupal\Tests\search_web_components_block\Functional;

/**
 * Tests basic block functionality.
 *
 * @group search_web_components_block
 */
class SearchSortSearchBlockTest extends SearchBlockTestBase {

  /**
   * {@inheritdoc}
   */
  public function getElementTag() {
    return 'search-sort';
  }

  /**
   * {@inheritdoc}
   */
  public function getBlockId() {
    return 'swc_search_sort';
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
      'sorts' => [
        'value' => 'test1|test2|test3',
        'expected' => '[{"key":"test1","order":"test2","label":"test3"}]',
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
      'sorts' => [
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
