<?php

namespace Drupal\search_web_components\Form;

use Drupal\Component\Serialization\Json;
use Drupal\Core\Ajax\AjaxFormHelperTrait;
use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\CloseDialogCommand;
use Drupal\Core\Ajax\MessageCommand;
use Drupal\Core\Ajax\ReplaceCommand;
use Drupal\Core\Entity\EntityFormBuilderInterface;
use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\search_api_decoupled\Entity\SearchApiEndpoint;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Form to delete a result mapping from an endpoint.
 */
class ResultMappingDeleteForm extends FormBase {

  use AjaxFormHelperTrait;

  /**
   * The entity form builder.
   *
   * @var \Drupal\Core\Entity\EntityFormBuilderInterface
   */
  protected EntityFormBuilderInterface $entityFormBuilder;

  /**
   * Constructs a new MappingPropertyForm object.
   *
   * @param \Drupal\Core\Entity\EntityFormBuilderInterface $entity_form_builder
   *   The entity form builder.
   */
  public function __construct(EntityFormBuilderInterface $entity_form_builder) {
    $this->entityFormBuilder = $entity_form_builder;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container): self {
    return new self(
      $container->get('entity.form_builder')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId(): string {
    return 'search_web_components_result_mapping_delete_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state, ?SearchApiEndpoint $endpoint = NULL, ?string $index = NULL) {
    if ($endpoint === NULL || $index === NULL) {
      return $form;
    }
    $mappings = $endpoint->getThirdPartySetting('search_web_components', 'results')['mappings'];
    if (!isset($mappings[$index])) {
      return $form;
    }
    $form['#title'] = $this->t('Are you sure you want to remove this mapping?');
    $form['index'] = [
      '#type' => 'value',
      '#value' => $index,
    ];

    $mapping = $mappings[$index];
    $form['keys'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Key(s)'),
      '#required' => TRUE,
      '#default_value' => $mapping['keys'] ?? '',
      '#disabled' => TRUE,
    ];
    $form['result_element'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Element'),
      '#required' => TRUE,
      '#default_value' => $mapping['element'] ?? '',
      '#disabled' => TRUE,
    ];
    $form['settings'] = [
      '#type' => 'textarea',
      '#default_value' => $mapping['settings'] ? Json::encode($mapping['settings']) : '',
      '#title' => $this->t('Settings'),
      '#disabled' => TRUE,
    ];

    $form['actions'] = ['#type' => 'actions'];
    $form['actions']['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Delete'),
      '#button_type' => 'primary',
    ];
    if ($this->isAjax()) {
      $form['actions']['submit']['#ajax'] = [
        'callback' => '::ajaxSubmit',
      ];
    }
    $form['#theme'] = 'confirm_form';
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $endpoint = $form_state->getBuildInfo()['args'][0];
    assert($endpoint instanceof SearchApiEndpoint);
    $rawMapping = $endpoint->getThirdPartySetting('search_web_components', 'results');
    unset($rawMapping['mappings'][$form_state->getValue('index')]);
    $endpoint->setThirdPartySetting('search_web_components', 'results', $rawMapping);
    $endpoint->save();
  }

  /**
   * {@inheritdoc}
   */
  protected function successfulAjaxSubmit(array $form, FormStateInterface $form_state) {
    $endpoint = $form_state->getBuildInfo()['args'][0];
    assert($endpoint instanceof SearchApiEndpoint);
    $endpointForm = $this->entityFormBuilder->getForm($endpoint, 'edit');

    $response = new AjaxResponse();
    $response->addCommand(new MessageCommand('Removed mapping.'));
    $response->addCommand(new ReplaceCommand('[data-drupal-selector="search-api-endpoint-edit-form"]', $endpointForm));
    $response->addCommand(new CloseDialogCommand());
    return $response;
  }

}
