<?php

declare(strict_types=1);

namespace Drupal\search_web_components_block\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Extension\ModuleHandlerInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Form\SubformStateInterface;
use Drupal\Core\Logger\LoggerChannelTrait;
use Drupal\Core\Messenger\MessengerTrait;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\Core\Template\Attribute;
use Drupal\Core\Url;
use Drupal\search_web_components_facets\Form\FacetElementHelperTrait;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Defines a base facet block implementation that facet plugins can extend.
 *
 * This abstract class provides the generic block configuration form and default
 * facet settings included in the build method.
 *
 * @phpcs:disable Drupal.Semantics.FunctionT.NotLiteralString
 */
abstract class FacetBlockBase extends BlockBase implements ContainerFactoryPluginInterface {

  use LoggerChannelTrait;
  use MessengerTrait;
  use FacetElementHelperTrait;

  /**
   * The entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected EntityTypeManagerInterface $entityTypeManager;

  /**
   * The module handler.
   *
   * @var \Drupal\Core\Extension\ModuleHandlerInterface
   */
  protected ModuleHandlerInterface $moduleHandler;

  /**
   * Construct Drupal\search_web_components_block\Plugin\Block\FacetBlockBase.
   *
   * @param array $configuration
   *   A configuration array containing information about the plugin instance.
   * @param string $plugin_id
   *   The plugin_id for the plugin instance.
   * @param mixed $plugin_definition
   *   The plugin implementation definition.
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entityTypeManager
   *   The entity type manager.
   * @param \Drupal\Core\Extension\ModuleHandlerInterface $moduleHandler
   *   The module handler.
   */
  public function __construct($configuration, $plugin_id, $plugin_definition, EntityTypeManagerInterface $entityTypeManager, ModuleHandlerInterface $moduleHandler) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);

    $this->entityTypeManager = $entityTypeManager;
    $this->moduleHandler = $moduleHandler;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    // @phpstan-ignore new.static
    return new static($configuration, $plugin_id, $plugin_definition,
      $container->get('entity_type.manager'),
      $container->get('module_handler')
    );
  }

  /**
   * The facet widgets that this block supports.
   *
   * @return string[]
   *   An array of facet widget ids that are supported.
   */
  public function supportedWidgets(): array {
    return [];
  }

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration(): array {
    return [
      'endpoint' => NULL,
      'facet' => NULL,
      'key' => '',
      'overrideLabel' => '',
    ] + $this->defaultValues();
  }

  /**
   * {@inheritdoc}
   */
  public function blockForm($form, FormStateInterface $form_state): array {
    $endpoints = $this->entityTypeManager->getStorage('search_api_endpoint')->loadMultiple();

    $endpointOptions = [];
    foreach ($endpoints as $endpoint) {
      $endpointOptions[$endpoint->id()] = $endpoint->label();
    }

    if (!$endpointOptions && $this->configuration['endpoint'] !== 'manual_entry') {
      $link = Url::fromRoute('entity.search_api_endpoint.collection')->toString();
      $this->messenger()->addWarning($this->t(
        'No Decoupled Search Endpoints configured, you can create one <a href=":url" target="_blank">here</a>.',
        [':url' => $link])
      );
      $form['message'] = [
        '#type' => 'status_messages',
        '#weight' => -10,
      ];
    }

    $endpointOptions['manual_entry'] = 'Remote/Other';

    $form['endpoint'] = [
      '#title' => 'Decoupled Search Endpoint',
      '#type' => 'select',
      '#required' => TRUE,
      '#options' => $endpointOptions,
      '#default_value' => $this->configuration['endpoint'] ?? array_key_first($endpointOptions),
      '#ajax' => [
        'callback' => [$this, 'buildAjaxSettingsForm'],
        'wrapper' => 'swc-settings-container',
        'method' => 'replace',
        'effect' => 'fade',
      ],
    ];

    $form['settings'] = [
      '#type' => 'container',
      '#id' => 'swc-settings-container',
    ];

    $complete_form_state = $form_state instanceof SubformStateInterface ? $form_state->getCompleteFormState() : $form_state;

    $endpointId = $complete_form_state->getValue(['settings', 'endpoint'], $this->configuration['endpoint'] ?? array_key_first($endpointOptions));
    if ($endpointId !== 'manual_entry') {
      $endpoint = $this->entityTypeManager->getStorage('search_api_endpoint')->load($endpointId);
      if ($endpoint) {
        $facets = $endpoint->getFacets();
        $facetOptions = [];
        $supported = $this->supportedWidgets();
        foreach ($facets as $option) {
          if (empty($supported) || in_array($option->getWidget()['type'], $supported)) {
            $facetOptions[$option->id()] = $option->getName();
          }
        }

        if (!$facetOptions) {
          if (!$this->moduleHandler->moduleExists('facets')) {
            $this->messenger()->addWarning($this->t(
              'The facets module is not enabled.',
            ));
          }
          else {
            $link = Url::fromRoute('entity.facets_facet.collection')->toString();
            $this->messenger()->addWarning($this->t(
              'No @type facets are configured, you can create some <a href=":url" target="_blank">here</a>.',
              ['@type' => implode(' ,', $this->supportedWidgets()), ':url' => $link])
            );
          }
          $form['message'] = [
            '#type' => 'status_messages',
            '#weight' => -10,
          ];
        }

        $facetValue = $complete_form_state->getValue(['settings', 'facet'], $this->configuration['facet'] ?? array_key_first($facetOptions));
        $facetValue = isset($facetOptions[$facetValue]) ? $facetValue : NULL;
        $form['settings']['facet'] = [
          '#title' => $this->t('Facet'),
          '#type' => 'select',
          '#required' => TRUE,
          '#default_value' => $facetValue,
          '#options' => $facetOptions,
        ];
      }
      else {
        $this->getLogger('search_web_components_block')->error(
          'Failed to load Decoupled Search Endpoint @id for block @block',
          ['@id' => $this->configuration['endpoint'], '@block' => $this->getPluginId()]
        );
      }
    }
    else {
      $form['settings']['key'] = [
        '#type' => 'textfield',
        '#title' => $this->t('Facet to display'),
        '#description' => $this->t('Machine name of the facet to display'),
        '#default_value' => $this->configuration['key'],
      ];
      $form['settings'] = array_merge($form['settings'], $this->formElements());
    }

    $form['settings']['overrideLabel'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Override the facet label'),
      '#default_value' => $this->configuration['overrideLabel'],
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state): void {
    $this->configuration['endpoint'] = $form_state->getValue('endpoint');
    $this->configuration['facet'] = $form_state->getValue(['settings', 'facet']);
    $this->configuration['key'] = $form_state->getValue(['settings', 'key']);
    $this->configuration['overrideLabel'] = $form_state->getValue(['settings', 'overrideLabel']);
    $this->submitElements($form_state, $form_state->getValue(['settings']));
  }

  /**
   * {@inheritdoc}
   */
  public function build(): array {
    $config = $this->configuration;
    $searchAttributes = new Attribute();

    $key = $config['facet'];
    if ($config['endpoint'] === 'manual_entry') {
      $key = $config['key'];
    }
    $searchAttributes->setAttribute('key', $key);

    if ($config['overrideLabel'] !== NULL) {
      $searchAttributes->setAttribute('overrideLabel', $this->t($config['overrideLabel'])->__toString());
    }

    return [
      '#search_attributes' => $this->renderProperties($searchAttributes),
      '#attached' => [
        'library' => [
          'search_web_components/components',
        ],
      ],
    ];
  }

  /**
   * Handles changes to the settings when the source changes.
   */
  public static function buildAjaxSettingsForm(array $form, FormStateInterface $form_state) {
    return $form['settings']['settings'];
  }

}
