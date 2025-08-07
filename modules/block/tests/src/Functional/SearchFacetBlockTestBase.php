<?php

namespace Drupal\Tests\search_web_components_block\Functional;

/**
 * Tests basic block functionality.
 *
 * @group search_web_components_block
 */
abstract class SearchFacetBlockTestBase extends SearchBoxBlockTest {

  /**
   * {@inheritdoc}
   */
  public function getAllAttributes(): array {
    return [
      'endpoint' => [
        'value' => 'test',
        'expected' => NULL,
      ],
      'facet' => [
        'value' => 'test',
        'expected' => NULL,
      ],
      'key' => [
        'value' => 'test',
        'expected' => 'test',
      ],
      'overrideLabel' => [
        'value' => 'test',
        'expected' => 'test',
      ],
      'showLabel' => [
        'value' => TRUE,
        'expected' => '',
      ],
      'showCount' => [
        'value' => TRUE,
        'expected' => '',
      ],
      'showReset' => [
        'value' => TRUE,
        'expected' => '',
      ],
      'resetText' => [
        'value' => 'test',
        'expected' => 'test',
      ],
      'collapsible' => [
        'value' => TRUE,
        'expected' => '',
      ],
      'closed' => [
        'value' => TRUE,
        'expected' => '',
      ],
      'showCountInCollapseLabel' => [
        'value' => TRUE,
        'expected' => '',
      ],
      'preferAttributes' => [
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
      'endpoint' => [
        'value' => '',
        'expected' => NULL,
      ],
      'facet' => [
        'value' => '',
        'expected' => NULL,
      ],
      'key' => [
        'value' => '',
        'expected' => NULL,
      ],
      'overrideLabel' => [
        'value' => '',
        'expected' => NULL,
      ],
      'showLabel' => [
        'value' => FALSE,
        'expected' => NULL,
      ],
      'showCount' => [
        'value' => FALSE,
        'expected' => NULL,
      ],
      'showReset' => [
        'value' => FALSE,
        'expected' => NULL,
      ],
      'resetText' => [
        'value' => '',
        'expected' => NULL,
      ],
      'collapsible' => [
        'value' => FALSE,
        'expected' => NULL,
      ],
      'closed' => [
        'value' => FALSE,
        'expected' => NULL,
      ],
      'showCountInCollapseLabel' => [
        'value' => FALSE,
        'expected' => NULL,
      ],
      'preferAttributes' => [
        'value' => FALSE,
        'expected' => NULL,
      ],
    ];
  }

}
