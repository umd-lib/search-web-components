<?php

namespace Drupal\Tests\search_web_components_block\Functional;

/**
 * Tests basic block functionality.
 *
 * @group search_web_components_block
 */
class FacetDropdownBlockTest extends SearchFacetBlockTestBase {

  /**
   * {@inheritdoc}
   */
  public function getElementTag() {
    return 'facet-dropdown';
  }

  /**
   * {@inheritdoc}
   */
  public function getBlockId() {
    return 'swc_facet_dropdown';
  }

  /**
   * {@inheritdoc}
   */
  public function getAllAttributes(): array {
    return [
      'selectLabel' => [
        'value' => 'test',
        'expected' => 'test',
      ],
    ] + parent::getAllAttributes();
  }

  /**
   * {@inheritdoc}
   */
  public function getNoAttributes(): array {
    return [
      'selectLabel' => [
        'value' => '',
        'expected' => NULL,
      ],
    ] + parent::getAllAttributes();
  }

}
