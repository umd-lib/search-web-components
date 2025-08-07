<?php

namespace Drupal\Tests\search_web_components_block\Functional;

/**
 * Tests basic block functionality.
 *
 * @group search_web_components_block
 */
class SearchSimplePagerSearchBlockTest extends SearchBlockTestBase {

  /**
   * {@inheritdoc}
   */
  public function getElementTag() {
    return 'search-simple-pager';
  }

  /**
   * {@inheritdoc}
   */
  public function getBlockId() {
    return 'swc_search_simple_pager';
  }

  /**
   * {@inheritdoc}
   */
  public function getAllAttributes(): array {
    return [
      'prevLabel' => [
        'value' => 'test',
        'expected' => 'test',
      ],
      'nextLabel' => [
        'value' => 'test',
        'expected' => 'test',
      ],
      'firstLabel' => [
        'value' => 'test',
        'expected' => 'test',
      ],
      'lastLabel' => [
        'value' => 'test',
        'expected' => 'test',
      ],
      'showNextPrev' => [
        'value' => TRUE,
        'expected' => '',
      ],
      'showFirstLast' => [
        'value' => TRUE,
        'expected' => '',
      ],
      'pagesToDisplay' => [
        'value' => 1,
        'expected' => '1',
      ],
      'firstLastPagesToDisplay' => [
        'value' => 1,
        'expected' => '1',
      ],
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function getNoAttributes(): array {
    return [
      'prevLabel' => [
        'value' => '',
        'expected' => NULL,
      ],
      'nextLabel' => [
        'value' => '',
        'expected' => NULL,
      ],
      'firstLabel' => [
        'value' => '',
        'expected' => NULL,
      ],
      'lastLabel' => [
        'value' => '',
        'expected' => NULL,
      ],
      'showNextPrev' => [
        'value' => FALSE,
        'expected' => NULL,
      ],
      'showFirstLast' => [
        'value' => FALSE,
        'expected' => NULL,
      ],
      'pagesToDisplay' => [
        'value' => 0,
        'expected' => NULL,
      ],
      'firstLastPagesToDisplay' => [
        'value' => 0,
        'expected' => NULL,
      ],
    ];
  }

}
