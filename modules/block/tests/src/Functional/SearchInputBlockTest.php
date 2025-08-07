<?php

namespace Drupal\Tests\search_web_components_block\Functional;

/**
 * Tests basic block functionality.
 *
 * @group search_web_components_block
 */
class SearchInputBlockTest extends SearchBlockTestBase {

  /**
   * {@inheritdoc}
   */
  public function getElementTag() {
    return 'search-input';
  }

  /**
   * {@inheritdoc}
   */
  public function getBlockId() {
    return 'swc_search_input';
  }

  /**
   * {@inheritdoc}
   */
  public function getAllAttributes(): array {
    return [
      'labelText' => [
        'value' => 'test',
        'expected' => 'test',
      ],
      'placeHolderText' => [
        'value' => 'test',
        'expected' => 'test',
      ],
      'clearText' => [
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
      'labelText' => [
        'value' => '',
        'expected' => NULL,
      ],
      'placeHolderText' => [
        'value' => '',
        'expected' => NULL,
      ],
      'clearText' => [
        'value' => '',
        'expected' => NULL,
      ],
    ];
  }

}
