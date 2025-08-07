<?php

namespace Drupal\Tests\search_web_components_block\Functional;

/**
 * Tests basic block functionality.
 *
 * @group search_web_components_block
 */
class FacetCheckboxBlockTest extends SearchFacetBlockTestBase {

  /**
   * {@inheritdoc}
   */
  public function getElementTag() {
    return 'facet-checkbox';
  }

  /**
   * {@inheritdoc}
   */
  public function getBlockId() {
    return 'swc_facet_checkbox';
  }

  /**
   * {@inheritdoc}
   */
  public function getAllAttributes(): array {
    return [
      'useRadios' => [
        'value' => TRUE,
        'expected' => '',
      ],
    ] + parent::getAllAttributes();
  }

  /**
   * {@inheritdoc}
   */
  public function getNoAttributes(): array {
    return [
      'useRadios' => [
        'value' => FALSE,
        'expected' => NULL,
      ],
    ] + parent::getAllAttributes();
  }

}
