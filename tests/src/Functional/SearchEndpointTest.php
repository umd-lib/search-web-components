<?php

namespace Drupal\Test\search_web_components\Functional;

use Drupal\search_api_decoupled\Entity\SearchApiEndpoint;
use Drupal\Tests\search_web_components\Functional\SearchWebComponentsFunctionalTestBase;

/**
 * Test the modifications to the endpoint response.
 */
final class SearchEndpointTest extends SearchWebComponentsFunctionalTestBase {

  /**
   * Ensure the api endpoint contains SWC properties.
   */
  public function testEndpointResponse() {
    $endpoint = SearchApiEndpoint::create([
      'id' => 'test',
      'label' => 'test',
      'index' => 'database_search_index',
      'items_per_page_options' => [],
    ]);

    $endpoint->save();

    $user = $this->drupalCreateUser(['administer search_api_endpoint']);
    $this->drupalLogin($user);

    $response = $this->drupalGet('api/search/test');
    $this->assertSession()->statusCodeEquals(200);

    $response = json_decode($response, TRUE);
    $this->assertIsArray($response);

    $this->assertArrayHasKey('swc_sorts', $response);
    $this->assertArrayHasKey('swc_page_sizes', $response);
    $this->assertArrayHasKey('swc_displays', $response);
    $this->assertArrayHasKey('swc_results', $response);
  }

}
