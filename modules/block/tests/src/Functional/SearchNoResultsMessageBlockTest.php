<?php

namespace Drupal\Tests\search_web_components_block\Functional;

use Drupal\block\Entity\Block;

/**
 * Tests basic block functionality.
 *
 * @group search_web_components_block
 */
class SearchNoResultsMessageBlockTest extends SearchBlockTestBase {

  /**
   * {@inheritdoc}
   */
  public function getElementTag() {
    return 'search-no-results-message';
  }

  /**
   * {@inheritdoc}
   */
  public function getBlockId() {
    return 'swc_search_no_results_message';
  }

  /**
   * {@inheritdoc}
   */
  public function getAllAttributes(): array {
    return [];
  }

  /**
   * {@inheritdoc}
   */
  public function getNoAttributes(): array {
    return [];
  }

  /**
   * Tests configuring and moving a module-define block to specific regions.
   */
  public function testAllAttributes() {
    $block = Block::create([
      'id' => 'test',
      'plugin' => $this->getBlockId(),
      'theme' => 'claro',
      'weight' => 00,
      'status' => TRUE,
      'region' => 'content',
      'settings' => [
        'noResultsContent' => [
          'value' => '<div id="test"></div>',
          'format' => filter_default_format(),
        ],
      ],
    ]);
    $block->save();

    // Confirm that the block instance title and markup are not displayed.
    $this->drupalGet('<front>');

    $xpath = $this->assertSession()->buildXPathQuery('//' . $this->getElementTag());
    $this->assertSession()->elementContains('xpath', $xpath, '<div id="test"></div>');
  }

  /**
   * Tests configuring and moving a module-define block to specific regions.
   */
  public function testNoAttributes() {
    $block = Block::create([
      'id' => 'test',
      'plugin' => $this->getBlockId(),
      'theme' => 'claro',
      'weight' => 00,
      'status' => TRUE,
      'region' => 'content',
      'settings' => [
        'noResultsContent' => [
          'value' => "",
          'format' => filter_default_format(),
        ],
      ],
    ]);
    $block->save();

    // Confirm that the block instance title and markup are not displayed.
    $this->drupalGet('<front>');

    $xpath = $this->assertSession()->buildXPathQuery('//' . $this->getElementTag());
    $this->assertSession()->elementsCount('xpath', $xpath, 1);

    $xpath = $this->assertSession()->buildXPathQuery('//' . $this->getElementTag() . '/*');
    $this->assertSession()->elementsCount('xpath', $xpath, 0);
  }

}
