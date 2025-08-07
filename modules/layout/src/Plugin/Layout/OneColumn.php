<?php

namespace Drupal\search_web_components_layout\Plugin\Layout;

use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Layout\LayoutDefault;
use Drupal\Core\Logger\LoggerChannelTrait;
use Drupal\Core\Messenger\MessengerTrait;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\Core\Plugin\PluginFormInterface;
use Drupal\Core\Template\Attribute;
use Drupal\Core\Url;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Configurable one column layout plugin class.
 *
 * @internal
 *   Plugin classes are internal.
 */
class OneColumn extends LayoutDefault implements PluginFormInterface, ContainerFactoryPluginInterface {

  use LoggerChannelTrait;
  use MessengerTrait;

  /**
   * The entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected EntityTypeManagerInterface $entityTypeManager;

  /**
   * Construct new Drupal\search_web_components_layout\Plugin\Layout\OneColumn.
   *
   * @param array $configuration
   *   A configuration array containing information about the plugin instance.
   * @param string $plugin_id
   *   The plugin_id for the plugin instance.
   * @param mixed $plugin_definition
   *   The plugin implementation definition.
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entityTypeManager
   *   The entity type manager.
   */
  public function __construct($configuration, $plugin_id, $plugin_definition, EntityTypeManagerInterface $entityTypeManager) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);

    $this->entityTypeManager = $entityTypeManager;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    // @phpstan-ignore new.static
    return new static($configuration, $plugin_id, $plugin_definition,
      $container->get('entity_type.manager')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration() {
    $configuration = parent::defaultConfiguration();
    return $configuration + [
      'url' => '',
      'defaultPerPage' => '10',
      'defaultResultDisplay' => 'list',
      'updateUrl' => TRUE,
      'additionalParams' => '',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function buildConfigurationForm(array $form, FormStateInterface $form_state) {
    $endpoints = $this->entityTypeManager->getStorage('search_api_endpoint')->loadMultiple();

    $endpointOptions = [];
    foreach ($endpoints as $endpoint) {
      $endpointOptions[$endpoint->id()] = $endpoint->label();
    }

    if (!$endpointOptions && $this->configuration['endpoint'] !== 'manual_entry') {
      $link = Url::fromRoute('entity.search_api_endpoint.collection')->toString();
      $this->messenger()->addWarning($this->t('No Decoupled Search Endpoints configured, you can create one <a href=":url" target="_blank">here</a>.', [':url' => $link]));
      $form['message'] = [
        '#type' => 'status_messages',
      ];
    }

    $endpointOptions['manual_entry'] = 'Remote/Other';

    $form['endpoint'] = [
      '#title' => 'Decoupled Search Endpoint',
      '#type' => 'select',
      '#required' => TRUE,
      '#options' => $endpointOptions,
      '#default_value' => $this->configuration['endpoint'] ?? array_key_first($endpointOptions),
    ];

    $form['url'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Search Endpoint URL'),
      '#default_value' => $this->configuration['url'],
      '#description' => $this->t('The url for the endpoint to use for this search.Usually /api/search/{search_endpoint_name}, if using a remote endpoint make sure to include the full url starting with https://. Initial search query parameters can be added to this url. Search query params added to this url will be used for the initial search if no search query params are present in the page url, they will also be added to the page url on search load, and can be removed by components.'),
      '#states' => [
        'visible' => [
          ':input[name="layout_settings[endpoint]"]' => ['value' => 'manual_entry'],
        ],
      ],
    ];

    $form['additionalParams'] = [
      '#type' => 'textfield',
      '#maxlength' => NULL,
      '#title' => $this->t('Additional search params'),
      '#default_value' => $this->configuration['additionalParams'],
      '#description' => $this->t("A valid search query parameter string starting with '?'. These parameters will be added to all searches but will not be added to the page url."),
    ];

    $form['defaultPerPage'] = [
      '#type' => 'number',
      '#title' => $this->t('Default results per page'),
      '#default_value' => $this->configuration['defaultPerPage'],
      '#description' => $this->t('The default number of results to show per page.'),
    ];

    $form['defaultResultDisplay'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Default result display'),
      '#default_value' => $this->configuration['defaultResultDisplay'],
    ];

    $form['updateUrl'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Update the page url with parameters from the search'),
      '#default_value' => $this->configuration['updateUrl'],
    ];
    return parent::buildConfigurationForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitConfigurationForm(array &$form, FormStateInterface $form_state) {
    parent::submitConfigurationForm($form, $form_state);
    $this->configuration['endpoint'] = $form_state->getValue('endpoint');
    $this->configuration['url'] = $form_state->getValue('url');
    $this->configuration['defaultPerPage'] = $form_state->getValue('defaultPerPage');
    $this->configuration['defaultResultDisplay'] = $form_state->getValue('defaultResultDisplay');
    $this->configuration['updateUrl'] = $form_state->getValue('updateUrl');
    $this->configuration['additionalParams'] = $form_state->getValue('additionalParams');
  }

  /**
   * {@inheritdoc}
   */
  public function build(array $regions) {
    $build = parent::build($regions);

    $url = '';
    if ($this->configuration['endpoint'] === 'manual_entry') {
      $url = $this->configuration['url'];
    }
    else {
      $endpointId = $this->configuration['endpoint'];

      if ($endpointId) {
        $endpoint = $this->entityTypeManager->getStorage('search_api_endpoint')->load($this->configuration['endpoint']);
        if ($endpoint) {
          $url = $endpoint->getBaseUrl()->toString();
        }
        else {
          $this->getLogger('search_web_components_layout')->error('Failed to load Decoupled Search Endpoint @id', ['@id' => $this->configuration['endpoint']]);
        }
      }
      else {
        $this->getLogger('search_web_components_layout')->error('No endpoint provided for search_web_component_layout One Column layout.');
      }
    }

    $build['#settings']['search_root_attributes'] = new Attribute([
      'class' => ['endpoint-' . $this->configuration['endpoint']],
      'url' => $url,
      'defaultPerPage' => $this->configuration['defaultPerPage'],
      'defaultResultDisplay' => $this->configuration['defaultResultDisplay'],
    ]);

    if (!$this->configuration['updateUrl']) {
      $build['#settings']['search_root_attributes']['noPageUrlUpdate'] = !$this->configuration['updateUrl'];
    }

    if ($this->configuration['additionalParams']) {
      $build['#settings']['search_root_attributes']['additionalParams'] = !$this->configuration['additionalParams'];
    }

    return $build;
  }

}
