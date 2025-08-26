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
 * Mapping form for results on an endpoint.
 */
class ResultMappingForm extends FormBase {

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
    return 'search_web_components_result_mapping_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state, ?SearchApiEndpoint $endpoint = NULL, ?string $index = NULL): array {
    if ($endpoint === NULL || $index === NULL) {
      return $form;
    }
    if ($index === '_new') {
      $mapping = [];
    }
    else {
      $mappings = $endpoint->getThirdPartySetting('search_web_components', 'results')['mappings'];
      if (!isset($mappings[$index])) {
        return $form;
      }
      $mapping = $mappings[$index];
    }

    $form['index'] = [
      '#type' => 'value',
      '#value' => $index,
    ];
    $form['keys'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Key(s)'),
      '#required' => TRUE,
      '#default_value' => implode(',', $mapping['keys'] ?? []),
      '#description' => $this->t('A comma separated list of values that will render using the configured element. This can be \'default\', any value in the configured "Result field" for the index, or a value appended with the display type {result field}-{display type} i.e. article-grid.'),
    ];
    $form['result_element'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Element'),
      '#required' => TRUE,
      '#default_value' => $mapping['element'] ?? '',
      '#description' => $this->t('The element to render results in.<br/><strong>Search Web Components provides:</strong><br/>search-result-element-default: Render results as pretty printed json<br/>search-result-element-rendered: Render html from a field on the result<br/>search-result-element-umd-libraries: Custom element created by the University of Maryland Libraries'),
    ];
    $form['settings'] = [
      '#type' => 'textarea',
      '#default_value' => isset($mapping['settings']) ? Json::encode($mapping['settings']) : '',
      '#title' => $this->t('Settings'),
      '#description' => $this->t('A JSON string of settings for the specified element.<br/><strong>Search Web Components settings are:</strong><br/>search-result-element-default: No settings available.<br/>search-result-element-rendered: A JSON object containing the field to render. i.e. {"field": "rendered_result"}<br/>search-result-element-default: No settings available.<br/>search-result-element-umd-libraries: A JSON object containing the id, title, thumbnail, fields (comma separated), and base_path. i.e. {"id": "iiif_manifest__id", "title": "object__title__display", "thumbnail": "iiif_thumbnail_sequence__uris", "fields": "field_1,field_2", "base_path": "/results/id/"}'),
    ];
    $form['actions']['#type'] = 'actions';
    $form['actions']['submit'] = [
      '#type' => 'submit',
      '#op' => $index === '_new' ? 'add' : 'update',
      '#value' => $index === '_new' ? $this->t('Add') : $this->t('Update'),
      '#button_type' => 'primary',
    ];
    if ($this->isAjax()) {
      $form['actions']['submit']['#ajax']['callback'] = '::ajaxSubmit';
    }
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state): void {
    $endpoint = $form_state->getBuildInfo()['args'][0];
    assert($endpoint instanceof SearchApiEndpoint);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state): void {
    $endpoint = $form_state->getBuildInfo()['args'][0];
    assert($endpoint instanceof SearchApiEndpoint);
    $rawMapping = $endpoint->getThirdPartySetting('search_web_components', 'results');
    $values = $form_state->cleanValues()->getValues();

    $mapping = [
      'element' => $values['result_element'],
      'keys' => explode(',', $values['keys']),
      'settings' => $values['settings'] && $values['settings'] !== '{}' ? Json::decode($values['settings']) : '',
    ];
    if ($values['index'] === '_new') {
      $rawMapping['mappings'][] = $mapping;
    }
    else {
      $rawMapping['mappings'][$values['index']] = $mapping;
    }
    $endpoint->setThirdPartySetting('search_web_components', 'results', $rawMapping);
    $endpoint->save();
  }

  /**
   * {@inheritdoc}
   */
  protected function successfulAjaxSubmit(array $form, FormStateInterface $form_state): AjaxResponse {
    $endpoint = $form_state->getBuildInfo()['args'][0];
    assert($endpoint instanceof SearchApiEndpoint);
    $endpointForm = $this->entityFormBuilder->getForm($endpoint, 'edit');
    // Reset the pipeline form's action to the `edit-form` route path, not
    // the path of our dialog.
    $endpointForm['#action'] = $endpoint->toUrl('edit-form')->toString();

    $response = new AjaxResponse();
    $response->addCommand(new MessageCommand('Updated mapping.'));
    $response->addCommand(new ReplaceCommand('[data-drupal-selector="search-api-endpoint-edit-form"]', $endpointForm));
    $response->addCommand(new CloseDialogCommand());
    return $response;
  }

}
