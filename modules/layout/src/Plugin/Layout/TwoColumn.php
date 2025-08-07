<?php

namespace Drupal\search_web_components_layout\Plugin\Layout;

use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Logger\LoggerChannelTrait;
use Drupal\Core\Messenger\MessengerTrait;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\Core\Template\Attribute;
use Drupal\Core\Url;
use Drupal\layout_builder\Plugin\Layout\MultiWidthLayoutBase;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Configurable two column layout plugin class.
 *
 * @phpcs:disable Drupal.Semantics.FunctionT.NotLiteralString
 */
class TwoColumn extends MultiWidthLayoutBase implements ContainerFactoryPluginInterface {

  use LoggerChannelTrait;
  use MessengerTrait;

  /**
   * The entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected EntityTypeManagerInterface $entityTypeManager;

  /**
   * Construct new Drupal\search_web_components_layout\Plugin\Layout\TwoColumn.
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
      'endpoint' => NULL,
      'url' => '',
      'defaultPerPage' => '10',
      'defaultResultDisplay' => 'list',
      'updateUrl' => TRUE,
      'additionalParams' => '',
      'enableDialog' => FALSE,
      'dialogBreakpoint' => 0,
      'dialogCloseText' => NULL,
      'dialogClosePosition' => NULL,
      'dialogModal' => NULL,
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
      '#title' => $this->t('Additional search params'),
      '#maxlength' => NULL,
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

    $form['enableDialog'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Use the third section in the left column as a toggleable dialog'),
      '#default_value' => $this->configuration['enableDialog'],
    ];

    $form['dialogBreakpoint'] = [
      '#type' => 'number',
      '#title' => $this->t('Dialog breakpoint'),
      '#description' => $this->t('The maximum screen width where the search-dialog-pane/button will act as a toggle. Set -1 to always apply.'),
      '#min' => -1,
      '#default_value' => $this->configuration['dialogBreakpoint'] ?? 0,
      '#states' => [
        'visible' => [
          ':input[name="layout_settings[enableDialog]"]' => ['checked' => TRUE],
        ],
      ],
    ];
    $form['dialogCloseText'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Dialog close button text'),
      '#default_value' => $this->configuration['dialogCloseText'] ?? 'Close',
      '#states' => [
        'visible' => [
          ':input[name="layout_settings[enableDialog]"]' => ['checked' => TRUE],
        ],
      ],
    ];
    $form['dialogClosePosition'] = [
      '#type' => 'select',
      '#title' => $this->t('Dialog close button position'),
      '#options' => [
        'top' => $this->t('top'),
        'bottom' => $this->t('bottom'),
        'none' => $this->t('none'),
        'both' => $this->t('both'),
      ],
      '#default_value' => $this->configuration['dialogClosePosition'] ?? 'top',
      '#states' => [
        'visible' => [
          ':input[name="layout_settings[enableDialog]"]' => ['checked' => TRUE],
        ],
      ],
    ];
    $form['dialogModal'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Render dialog as a modal'),
      '#default_value' => $this->configuration['dialogModal'] ?? FALSE,
      '#states' => [
        'visible' => [
          ':input[name="layout_settings[enableDialog]"]' => ['checked' => TRUE],
        ],
      ],
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
    $this->configuration['enableDialog'] = $form_state->getValue('enableDialog');
    $this->configuration['dialogBreakpoint'] = $form_state->getValue('dialogBreakpoint');
    $this->configuration['dialogCloseText'] = $form_state->getValue('dialogCloseText');
    $this->configuration['dialogClosePosition'] = $form_state->getValue('dialogClosePosition');
    $this->configuration['dialogModal'] = $form_state->getValue('dialogModal');
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
        $this->getLogger('search_web_components_layout')->error('No endpoint provided for search_web_component_layout Two Column layout.');
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
      $build['#settings']['search_root_attributes']['additionalParams'] = $this->configuration['additionalParams'];
    }

    $build['#settings']['use_dialog'] = $this->configuration['enableDialog'];
    $build['#settings']['search_dialog'] = new Attribute();
    if ($this->configuration['enableDialog']) {
      $build['#settings']['search_root_attributes']['dialogBreakpoint'] = $this->configuration['dialogBreakpoint'];
      $build['#settings']['search_dialog']['closePosition'] = $this->configuration['dialogClosePosition'];
      $build['#settings']['search_dialog']['closeText'] = $this->configuration['dialogCloseText'] ? $this->t($this->configuration['dialogCloseText'])->__toString() : '';
      if ($this->configuration['dialogModal']) {
        $build['#settings']['search_dialog']['modal'] = TRUE;
      }
    }

    return $build;
  }

  /**
   * {@inheritdoc}
   */
  protected function getWidthOptions() {
    return [
      '15-85' => '15%/85%',
      '20-80' => '20%/80%',
      '25-75' => '25%/75%',
      '33-67' => '33%/67%',
      '50-50' => '50%/50%',
      '67-33' => '67%/33%',
      '75-25' => '75%/25%',
      '80-20' => '80%/20%',
      '85-15' => '85%/15%',
    ];
  }

  /**
   * {@inheritdoc}
   */
  protected function getDefaultWidth() {
    return '25-75';
  }

}
