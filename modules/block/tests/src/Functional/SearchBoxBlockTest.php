<?php

namespace Drupal\Tests\search_web_components_block\Functional;

/**
 * Tests basic block functionality.
 *
 * @group search_web_components_block
 */
class SearchBoxBlockTest extends SearchBlockTestBase {

  /**
   * {@inheritdoc}
   */
  public function getElementTag() {
    return 'search-box';
  }

  /**
   * {@inheritdoc}
   */
  public function getBlockId() {
    return 'swc_search_box';
  }

  /**
   * {@inheritdoc}
   */
  public function getAllAttributes(): array {
    return [
      'url' => [
        'value' => 'test',
        'expected' => 'test',
      ],
      'submitText' => [
        'value' => 'test',
        'expected' => 'test',
      ],
      'ariaLabelText' => [
        'value' => 'test',
        'expected' => 'test',
      ],
      'placeHolderText' => [
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
      'url' => [
        'value' => '',
        'expected' => NULL,
      ],
      'submitText' => [
        'value' => '',
        'expected' => NULL,
      ],
      'ariaLabelText' => [
        'value' => '',
        'expected' => NULL,
      ],
      'placeHolderText' => [
        'value' => '',
        'expected' => NULL,
      ],
    ];
  }

}
