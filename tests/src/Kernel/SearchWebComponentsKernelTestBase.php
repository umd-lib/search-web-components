<?php

declare(strict_types=1);

namespace Drupal\Tests\search_web_components\Kernel;

use Drupal\KernelTests\Core\Entity\EntityKernelTestBase;

/**
 * Base test case class for TypedPipelines.
 */
abstract class SearchWebComponentsKernelTestBase extends EntityKernelTestBase {

  /**
   * {@inheritdoc}
   */
  protected static $modules = [
    'search_api_decoupled',
    'search_api_db',
    'search_api_test_example_content',
    'search_web_components',
    'search_web_components_test',
  ];

  /**
   * {@inheritdoc}
   */
  protected function setUp(): void {
    parent::setUp();
    $this->installConfig(['search_web_components']);
  }

}
