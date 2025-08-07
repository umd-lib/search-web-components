<?php

namespace Drupal\Tests\search_web_components_block\Functional;

/**
 * Tests basic block functionality.
 *
 * @group search_web_components_block
 */
class FacetButtonBlockTest extends SearchFacetBlockTestBase {

  /**
   * {@inheritdoc}
   */
  public function getElementTag() {
    return 'facet-button';
  }

  /**
   * {@inheritdoc}
   */
  public function getBlockId() {
    return 'swc_facet_button';
  }

  /**
   * {@inheritdoc}
   */
  public function getAllAttributes(): array {
    return [] + parent::getAllAttributes();
  }

  /**
   * {@inheritdoc}
   */
  public function getNoAttributes(): array {
    return [] + parent::getAllAttributes();
  }

}
