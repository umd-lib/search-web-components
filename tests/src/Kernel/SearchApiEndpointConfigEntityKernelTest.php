<?php

declare(strict_types=1);

namespace Drupal\Tests\search_web_components\Kernel;

/**
 * Tests the endpoint configuration entity.
 *
 * @group search_web_components
 */
final class SearchApiEndpointConfigEntityKernelTest extends SearchWebComponentsKernelTestBase {

  /**
   * Test the entity.
   */
  public function testEntity(): void {
    $etm = $this->container->get('entity_type.manager');
    self::assertTrue($etm->hasDefinition('search_api_endpoint'));
  }

}
