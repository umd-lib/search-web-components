<?php

namespace Drupal\Tests\search_web_components_block\Functional;

/**
 * Tests basic block functionality.
 *
 * @group search_web_components_block
 */
class FacetDropdownHtmlBlockTest extends SearchFacetBlockTestBase {

  /**
   * {@inheritdoc}
   */
  public function getElementTag() {
    return 'facet-dropdown-html';
  }

  /**
   * {@inheritdoc}
   */
  public function getBlockId() {
    return 'swc_facet_dropdown_html';
  }

  /**
   * {@inheritdoc}
   */
  public function getAllAttributes(): array {
    return [
      'required' => [
        'value' => TRUE,
        'expected' => '',
      ],
      'htmlSelectLabel' => [
        'value' => 'test',
        'expected' => 'test',
      ],
      'multipleSelect' => [
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
      'required' => [
        'value' => FALSE,
        'expected' => NULL,
      ],
      'htmlSelectLabel' => [
        'value' => '',
        'expected' => NULL,
      ],
      'multipleSelect' => [
        'value' => FALSE,
        'expected' => NULL,
      ],
    ] + parent::getAllAttributes();
  }

}
