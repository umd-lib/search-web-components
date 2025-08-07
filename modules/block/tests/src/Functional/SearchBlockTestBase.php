<?php

namespace Drupal\Tests\search_web_components_block\Functional;

use Drupal\block\Entity\Block;
use Drupal\Tests\block\Functional\BlockTestBase;

/**
 * Tests basic block functionality.
 *
 * @group search_web_components_block
 */
abstract class SearchBlockTestBase extends BlockTestBase {

  /**
   * {@inheritdoc}
   */
  protected static $modules = [
    'search_web_components_block',
    'search_web_components_facets',
  ];

  /**
   * {@inheritdoc}
   */
  protected $defaultTheme = 'claro';

  /**
   * Get the block id to test.
   */
  abstract public function getBlockId();

  /**
   * Get the expected html tag to test.
   */
  abstract public function getElementTag();

  /**
   * Get all attributes with populate values/turned on.
   *
   * @return array
   *   Array of attributes keyed by the attribute name with value and expected.
   */
  abstract public function getAllAttributes(): array;

  /**
   * Get all attributes with empty values/turned off.
   *
   * @return array
   *   Array of attributes keyed by the attribute name with value and expected.
   */
  abstract public function getNoAttributes(): array;

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
      'settings' => array_map(function ($attr) {
        return $attr['value'];
      }, $this->getAllAttributes()),
    ]);

    $block->save();

    // Confirm that the block instance title and markup are not displayed.
    $this->drupalGet('<front>');

    foreach ($this->getAllAttributes() as $attr => $testValues) {
      $xpath = $this->assertSession()->buildXPathQuery('//' . $this->getElementTag());

      if (is_null($testValues['expected'])) {
        $this->assertSession()->elementAttributeNotExists('xpath', $xpath, strtolower($attr));
      }
      else {
        $this->assertSession()->elementAttributeContains('xpath', $xpath, strtolower($attr), $testValues['expected']);
      }
    }
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
      'settings' => array_map(function ($attr) {
        return $attr['value'];
      }, $this->getNoAttributes()),
    ]);
    $block->save();

    // Confirm that the block instance title and markup are not displayed.
    $this->drupalGet('<front>');

    foreach ($this->getNoAttributes() as $attr => $testValues) {
      $xpath = $this->assertSession()->buildXPathQuery('//' . $this->getElementTag());

      if (is_null($testValues['expected'])) {
        $this->assertSession()->elementAttributeNotExists('xpath', $xpath, strtolower($attr));
      }
      else {
        $this->assertSession()->elementAttributeContains('xpath', $xpath, strtolower($attr), $testValues['expected']);
      }
    }
  }

}
