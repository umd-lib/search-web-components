<?php

namespace Drupal\Tests\search_web_components_block\Functional;

/**
 * Tests basic block functionality.
 *
 * @group search_web_components_block
 */
class SearchDialogToggleBlockTest extends SearchBlockTestBase {

  /**
   * {@inheritdoc}
   */
  public function getElementTag() {
    return 'search-dialog-toggle';
  }

  /**
   * {@inheritdoc}
   */
  public function getBlockId() {
    return 'swc_search_dialog_toggle';
  }

  /**
   * {@inheritdoc}
   */
  public function getAllAttributes(): array {
    return [
      'aboveBreakpointText' => [
        'value' => 'test',
        'expected' => 'test',
      ],
      'dialogOpenText' => [
        'value' => 'test',
        'expected' => 'test',
      ],
      'dialogCloseText' => [
        'value' => 'test',
        'expected' => 'test',
      ],
      'showAppliedCount' => [
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
      'aboveBreakpointText' => [
        'value' => '',
        'expected' => NULL,
      ],
      'dialogOpenText' => [
        'value' => '',
        'expected' => NULL,
      ],
      'dialogCloseText' => [
        'value' => '',
        'expected' => NULL,
      ],
      'showAppliedCount' => [
        'value' => FALSE,
        'expected' => NULL,
      ],
    ];
  }

}
