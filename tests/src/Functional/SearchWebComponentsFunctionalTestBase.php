<?php

declare(strict_types=1);

namespace Drupal\Tests\search_web_components\Functional;

use Drupal\Tests\BrowserTestBase;

/**
 * Base test case class for TypedPipelines.
 */
abstract class SearchWebComponentsFunctionalTestBase extends BrowserTestBase {

  /**
   * {@inheritdoc}
   */
  protected $defaultTheme = 'claro';

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

}
