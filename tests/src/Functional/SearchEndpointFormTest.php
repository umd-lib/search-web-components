<?php

namespace Drupal\Test\search_web_components\Functional;

use Drupal\search_api_decoupled\Entity\SearchApiEndpoint;
use Drupal\Tests\search_web_components\Functional\SearchWebComponentsFunctionalTestBase;

/**
 * Test the modifications to the endpoint form.
 */
final class SearchEndpointFormTest extends SearchWebComponentsFunctionalTestBase {

  /**
   * Test the sort, page size, and display sections of the endpoint form.
   */
  public function testForm() {
    $adminUser = $this->drupalCreateUser(['administer search_api_endpoint']);
    $this->drupalLogin($adminUser);

    $this->drupalGet('admin/config/search/search-api/endpoints/add');
    $this->assertSession()->statusCodeEquals(200);

    $edit = [
      'label' => 'test',
      'id' => 'test',
      'index' => 'database_search_index',
    ];

    $this->submitForm($edit, 'Next');

    // Confirm form alters are working.
    $this->assertSession()->pageTextContains('Edit endpoint');
    $this->assertSession()->pageTextContains('Sorts');
    $this->assertSession()->pageTextContains('Page Sizes');
    $this->assertSession()->pageTextContains('Displays');
    $this->assertSession()->pageTextContains('Result mappings');
    $this->assertSession()->pageTextContains('Add new mapping');

    $edit = [
      'swc_sorts' => "field|order|label\ntitle|asc|A-Z",
      'swc_page_sizes' => "5|Five\n10|Ten",
      'swc_displays' => "keytest|Labeltest\ngrid|Grid",
    ];

    $this->submitForm($edit, 'Save');

    // Confirm successful config save.
    $this->assertSession()->pageTextContainsOnce('Saved the test Search page.');

    // Confirm that imploded config values are in the right order.
    $this->assertSession()->fieldValueEquals('swc_sorts', "field|order|label\ntitle|asc|A-Z");
    $this->assertSession()->fieldValueEquals('swc_page_sizes', "5|Five\n10|Ten");
    $this->assertSession()->fieldValueEquals('swc_displays', "keytest|Labeltest\ngrid|Grid");

    // Confirm page options were automatically updated.
    $config = $this->config('search_api_decoupled.search_api_endpoint.test');
    $this->assertTrue(count($config->get('items_per_page_options')) === 2);

    // Confirm values were saved to config.
    $swc_config = $config->get('third_party_settings.search_web_components');
    $this->assertTrue(count($swc_config['sorts']) === 2);
    $this->assertTrue(count($swc_config['page_sizes']) === 2);
    $this->assertTrue(count($swc_config['displays']) === 2);
  }

  /**
   * Test access denied for users without 'administer search_api_endpoint'.
   */
  public function testResultMappingForm() {
    $endpoint = SearchApiEndpoint::create([
      'id' => 'test',
      'label' => 'test',
      'index' => 'database_search_index',
      'items_per_page_options' => [],
    ]);

    $endpoint->save();

    $user = $this->drupalCreateUser(['administer search_api_endpoint']);
    $this->drupalLogin($user);

    // Confirm new mapping route works.
    $this->drupalGet('admin/config/search/search-api/endpoints/test/edit/mapping/_new');
    $this->assertSession()->statusCodeEquals(200);

    $edit = [
      'keys' => 'one,two,three',
      'result_element' => 'test_element',
      'settings' => '{"test_key":"test_value"}',
    ];

    $this->submitForm($edit, 'Add');

    // Confirm edit mapping route works.
    $this->drupalGet('admin/config/search/search-api/endpoints/test/edit');
    $this->assertSession()->statusCodeEquals(200);
    $this->assertSession()->pageTextContains('test_element');

    $config = $this->config('search_api_decoupled.search_api_endpoint.test');
    $swc_config = $config->get('third_party_settings.search_web_components')['results'];

    // Confirm mappings saved correctly.
    $mappings = $swc_config['mappings'];
    $this->assertEquals(count($mappings), 2);
    $this->assertEquals(count($mappings[1]['keys']), 3);
    $this->assertEquals($mappings[1]['element'], 'test_element');
    $this->assertArrayHasKey('test_key', $mappings[1]['settings']);
    $this->assertEquals($mappings[1]['settings']['test_key'], 'test_value');

    // Delete the first mapping.
    $this->drupalGet('admin/config/search/search-api/endpoints/test/delete/mapping/0');
    $this->assertSession()->pageTextContains('Are you sure you want to remove this mapping?');
    $this->submitForm([], 'Delete');

    // Confirm mapping deleted correctly.
    $this->assertSession()->statusCodeEquals(200);
    $this->assertSession()->pageTextNotContains('search-result-element-default');

    // Ensure that the array keys reset to start the index at 0.
    $config = $this->config('search_api_decoupled.search_api_endpoint.test');
    $swc_config = $config->get('third_party_settings.search_web_components')['results'];
    $mappings = $swc_config['mappings'];
    $this->assertEquals(count($mappings), 1);
    $this->assertArrayHasKey(0, $mappings);
  }

  /**
   * Test access denied for users without 'administer search_api_endpoint'.
   */
  public function testAccess() {
    $endpoint = SearchApiEndpoint::create([
      'id' => 'test',
      'label' => 'test',
      'index' => 'database_search_index',
      'items_per_page_options' => [],
    ]);

    $endpoint->save();

    $user = $this->drupalCreateUser(['administer site configuration']);
    $this->drupalLogin($user);

    $this->drupalGet('admin/config/search/search-api/endpoints/add');
    $this->assertSession()->statusCodeEquals(403);

    $this->drupalGet('admin/config/search/search-api/endpoints');
    $this->assertSession()->statusCodeEquals(403);

    $this->drupalGet('/admin/config/search/search-api/endpoints/test/edit/mapping/0');
    $this->assertSession()->statusCodeEquals(403);

    $this->drupalGet('/admin/config/search/search-api/endpoints/test/delete/mapping/0');
    $this->assertSession()->statusCodeEquals(403);
  }

}
