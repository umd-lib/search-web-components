<?php

namespace Drupal\search_web_components_facets\Form;

use Drupal\Component\Utility\NestedArray;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Form\SubformState;
use Drupal\facets\Form\FacetForm as SourceFacetForm;
use Drupal\facets\Processor\SortProcessorInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;

/**
 * Provides a form for configuring the processors of a facet.
 */
class FacetForm extends SourceFacetForm {

  const NONSWC_SETTINGS = ['settings'];
  const INTERFACE_SETTINGS = ['settings', 'interface_settings'];
  const INTERFACE_FACET_SETTINGS = ['settings', 'interface_settings', 'facet_settings'];

  const PROCESSING_SETTINGS = ['settings', 'processing_settings'];
  const UNSUPPORTED_SETTINGS = ['settings', 'unsupported_settings'];
  const ADVANCED_SETTINGS = ['settings', 'advanced_settings'];

  /**
   * Map each facet field to a new home in the vertical tabs.
   *
   * @var array[]
   */
  protected $fieldMetaData = [
    'widget_config' => [
      'parents' => self::INTERFACE_SETTINGS,
    ],
    'show_title' => [
      'parents' => self::INTERFACE_FACET_SETTINGS,
    ],
    'url_alias' => [
      'parents' => self::INTERFACE_FACET_SETTINGS,
    ],
    'hide_active_items_processor' => [
      'parents' => self::INTERFACE_FACET_SETTINGS,
    ],
    'hide_non_narrowing_result_processor' => [
      'parents' => self::INTERFACE_FACET_SETTINGS,
    ],
    'show_only_one_result' => [
      'parents' => self::INTERFACE_FACET_SETTINGS,
    ],
    'query_operator' => [
      'parents' => self::INTERFACE_FACET_SETTINGS,
    ],
    'hard_limit' => [
      'parents' => self::INTERFACE_FACET_SETTINGS,
    ],
    'empty_behavior' => [
      'parents' => self::INTERFACE_FACET_SETTINGS,
    ],
    'empty_behavior_container' => [
      'parents' => self::INTERFACE_FACET_SETTINGS,
    ],
    'missing' => [
      'parents' => self::INTERFACE_FACET_SETTINGS,
    ],
    'missing_label' => [
      'parents' => self::INTERFACE_FACET_SETTINGS,
    ],
    'use_hierarchy' => [
      'parents' => self::INTERFACE_FACET_SETTINGS,
    ],
    'hierarchy' => [
      'parents' => self::INTERFACE_FACET_SETTINGS,
    ],
    'keep_hierarchy_parents_active' => [
      'parents' => self::INTERFACE_FACET_SETTINGS,
    ],
    'expand_hierarchy' => [
      'parents' => self::INTERFACE_FACET_SETTINGS,
    ],
    'enable_parent_when_child_gets_disabled' => [
      'parents' => self::INTERFACE_FACET_SETTINGS,
    ],
    'hide_inactive_siblings_processor' => [
      'parents' => self::INTERFACE_FACET_SETTINGS,
    ],
    'facet_sorting' => [
      'parents' => self::INTERFACE_SETTINGS,
    ],

    'boolean_item' => [
      'parents' => self::PROCESSING_SETTINGS,
    ],
    'combine_processor' => [
      'parents' => self::PROCESSING_SETTINGS,
    ],
    'count_limit' => [
      'parents' => self::PROCESSING_SETTINGS,
    ],
    'dependent_processor' => [
      'parents' => self::PROCESSING_SETTINGS,
    ],
    'exclude_specified_items' => [
      'parents' => self::PROCESSING_SETTINGS,
    ],
    'granularity_item' => [
      'parents' => self::PROCESSING_SETTINGS,
    ],
    'hide_1_result_facet' => [
      'parents' => self::PROCESSING_SETTINGS,
    ],
    'list_item' => [
      'parents' => self::PROCESSING_SETTINGS,
    ],
    'replace' => [
      'parents' => self::PROCESSING_SETTINGS,
    ],
    'show_only_deepest_level_items_processor' => [
      'parents' => self::PROCESSING_SETTINGS,
    ],
    'show_siblings_processor' => [
      'parents' => self::PROCESSING_SETTINGS,
    ],
    'translate_entity' => [
      'parents' => self::PROCESSING_SETTINGS,
    ],
    'translate_entity_aggregated_fields' => [
      'parents' => self::PROCESSING_SETTINGS,
    ],
    'exclude' => [
      'parents' => self::PROCESSING_SETTINGS,
    ],
    'min_count' => [
      'parents' => self::PROCESSING_SETTINGS,
    ],
    'uid_to_username_callback' => [
      'parents' => self::PROCESSING_SETTINGS,
    ],

    'date_item' => [
      'parents' => self::UNSUPPORTED_SETTINGS,
    ],
    'only_visible_when_facet_source_is_visible' => [
      'parents' => self::UNSUPPORTED_SETTINGS,
    ],
    'weight' => [
      'parents' => self::UNSUPPORTED_SETTINGS,
    ],
    'hierarchy_processor' => [
      'parents' => self::UNSUPPORTED_SETTINGS,
    ],
    'url_processor_handler' => [
      'parents' => self::UNSUPPORTED_SETTINGS,
    ],

    'weights' => [
      'parents' => self::ADVANCED_SETTINGS,
    ],
  ];

  /**
   * The current route.
   *
   * @var \Drupal\Core\Routing\CurrentRouteMatch
   */
  protected $routeMatch;

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    $instance = parent::create($container);
    $instance->injectServices($container);

    return $instance;
  }

  /**
   * Inject additional required services.
   *
   * @param \Symfony\Component\DependencyInjection\ContainerInterface $container
   *   The container to pull out services used in the plugin.
   */
  public function injectServices(ContainerInterface $container): void {
    $this->routeMatch = $container->get('current_route_match');
  }

  /**
   * {@inheritdoc}
   */
  public function buildWidgetConfigForm(array &$form, FormStateInterface $form_state) {
    parent::buildWidgetConfigForm($form, $form_state);
    // Tweak widget config settings to better fit the new structure.
    $form['widget_config']['#type'] = 'details';
    $form['widget_config']['#open'] = TRUE;
    $form['widget_config']['#description'] = $this->t('Settings specific to this widget.');

    // Update the AJAX config to replace the whole form when a widget is
    // changed.
    $form['widget']['#ajax']['callback'] = '::buildAjaxSettingsForm';
    $form['widget']['#ajax']['wrapper'] = 'facets-settings-form';

    $form['widget_configure_button']['#ajax']['callback'] = '::buildAjaxSettingsForm';
    $form['widget_configure_button']['#ajax']['wrapper'] = 'facets-settings-form';
  }

  /**
   * {@inheritdoc}
   */
  public function form(array $form, FormStateInterface $form_state) {
    $form = parent::form($form, $form_state);
    // Redirect to facets settings page if Field Identifier is not set.
    if ($facets = $this->routeMatch->getParameter('facets_facet')) {
      if ($facets->getFieldIdentifier() === NULL) {
        $facet_settings_path = $facets->toUrl('settings-form')->toString();
        $response = new RedirectResponse($facet_settings_path);
        $response->send();
        return [];
      }
    }

    /** @var \Drupal\facets\FacetInterface $facet */
    $facet = $this->entity;

    // Add a new container to target with AJAX.
    $form['settings'] = [
      '#id' => 'facets-settings-form',
      '#type' => 'container',
    ];

    // Move non SWC provided forms to support AJAX replacing of the entire form
    // instead of just widgets.
    if (!str_contains($facet->getWidget()['type'], 'swc_')) {
      foreach ($form['facet_settings'] as &$element) {
        if (is_array($element)) {
          $this->updateStateConditions($element, array_merge(self::NONSWC_SETTINGS, ['facet_settings']));
        }
      }
      $form['settings']['widget_config'] = $form['widget_config'];
      $form['settings']['facet_settings'] = $form['facet_settings'];
      $form['settings']['facet_sorting'] = $form['facet_sorting'];
      $form['settings']['weights'] = $form['weights'];
      $form['settings']['processor_settings'] = $form['processor_settings'];

      unset($form['widget_config']);
      unset($form['facet_settings']);
      unset($form['facet_sorting']);
      unset($form['weights']);
      unset($form['processor_settings']);

      $form_state->set('swcForm', FALSE);
      return $form;
    }
    $form_state->set('swcForm', TRUE);
    $source_facet_settings = [];

    // Setup all the vertical tab containers.
    $form['settings']['settings_tabs'] = [
      '#type' => 'vertical_tabs',
      '#attributes' => [
        'class' => [
          'search-api-status-wrapper',
        ],
      ],
    ];
    $form['settings']['interface_settings'] = [
      '#type' => 'details',
      '#group' => 'settings][settings_tabs',
      '#title' => $this->t('Interface settings'),
      '#description' => $this->t('These settings relate to how the facet displays or how a user can interact with the facet.'),
    ];
    $form['settings']['processing_settings'] = [
      '#type' => 'details',
      '#group' => 'settings][settings_tabs',
      '#title' => $this->t('Processing settings'),
      '#description' => $this->t('These settings relate to when a facet is displayed and how a facet is processed by the server before responding to a search query.'),
    ];
    $form['settings']['advanced_settings'] = [
      '#type' => 'details',
      '#group' => 'settings][settings_tabs',
      '#title' => $this->t('Advanced settings'),
    ];
    $form['settings']['unsupported_settings'] = [
      '#type' => 'details',
      '#group' => 'settings][settings_tabs',
      '#title' => $this->t('Unsupported settings'),
    ];

    // Add containers inside interface settings to ensure the right order and
    // so individual values can be grouped.
    $form['settings']['interface_settings']['widget_config'] = [];
    $form['settings']['interface_settings']['facet_settings'] = [
      '#type' => 'details',
      '#open' => TRUE,
      '#title' => $this->t('Additional settings'),
      '#description' => $this->t('Additional facet settings that are available to all facets.'),
    ];

    // Tweak processor ordering to better fit the new structure.
    $form['weights']['#title'] = $this->t('Processor order');
    $form['weights']['#type'] = 'details';
    $form['weights']['#open'] = TRUE;
    unset($form['weights']['order']);

    // Tweak facet sorting to better fit the new structure.
    $form['facet_sorting']['#type'] = 'details';
    $form['facet_sorting']['#description'] = $this->t('Change how the facet options are ordered when displayed to the user.');
    $form['facet_sorting']['#open'] = TRUE;

    // Move all the elements to their correct tab and remove the original
    // element definition.
    foreach ($this->fieldMetaData as $element => $metadata) {
      $form_element = NULL;
      if (isset($form[$element])) {
        $form_element = $form[$element];
        unset($form[$element]);
      }
      elseif (isset($form['facet_settings'][$element])) {
        $source_facet_settings[] = $element;
        $form_element = $form['facet_settings'][$element];
        unset($form['facet_settings'][$element]);
      }

      if ($form_element) {
        $parents = array_merge($metadata['parents'], [$element]);
        $this->updateStateConditions($form_element, $metadata['parents']);
        NestedArray::setValue($form, $parents, $form_element, TRUE);
      }

    }
    $form_state->set('source_facet_settings', $source_facet_settings);

    $form['facet_settings']['#type'] = 'container';

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    /** @var \Drupal\facets\FacetInterface $facet */
    $facet = $this->entity;

    $values = $form_state->getValues();
    /** @var \Drupal\facets\Processor\ProcessorInterface[] $processors */
    $processors = $facet->getProcessors(FALSE);

    // Locate and iterate over all processors.
    if ($form_state->get('swcForm')) {
      $facet_settings = $form_state->get('source_facet_settings');
    }
    else {
      $facet_settings = array_keys($form['settings']['facet_settings']);
    }
    foreach ($facet_settings as $pid) {
      $processor_id = $pid;

      if (empty($values['processors'][$processor_id])) {
        continue;
      }

      if ($form_state->get('swcForm')) {
        $path = array_merge($this->fieldMetaData[$pid]['parents'], [$pid]);
      }
      else {
        $path = array_merge(self::NONSWC_SETTINGS, [$pid]);
      }

      $processor_form = NestedArray::getValue($form, $path);
      $value = $form_state->getValue($path);

      if (!empty($value)) {
        $processor_form_state = SubformState::createForSubform($processor_form['settings'], $form, $form_state);
        $processors[$processor_id]->validateConfigurationForm($processor_form, $processor_form_state, $facet);
      }
    }

    // Locate and iterate over all sorting processors that have a form and
    // are enabled.
    if ($form_state->get('swcForm')) {
      $facet_sorting = NestedArray::getValue($form, array_merge($this->fieldMetaData['facet_sorting']['parents'], ['facet_sorting']));
    }
    else {
      $facet_sorting = NestedArray::getValue($form, array_merge(self::NONSWC_SETTINGS, ['facet_sorting']));
    }
    foreach ($facet_sorting as $processor_id => $processor_form) {
      if (!empty($values['processors'][$processor_id])) {
        $processor_form_state = SubformState::createForSubform($facet_sorting[$processor_id]['settings'], $form, $form_state);
        $processors[$processor_id]->validateConfigurationForm($facet_sorting[$processor_id], $processor_form_state, $facet);
      }
    }

    // Validate url alias.
    if ($form_state->get('swcForm')) {
      $url_alias = NestedArray::getValue($values, array_merge($this->fieldMetaData['url_alias']['parents'], ['url_alias']));
    }
    else {
      $url_alias = NestedArray::getValue($values, array_merge(self::NONSWC_SETTINGS, ['facet_settings', 'url_alias']));
    }

    if ($url_alias === 'page') {
      $form_state->setErrorByName('url_alias', $this->t('This URL alias is not allowed.'));
    }
    elseif (preg_match('/[^a-zA-Z0-9_~.\-]/', $url_alias)) {
      $form_state->setErrorByName('url_alias', $this->t('The URL alias contains characters that are not allowed.'));
    }
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $values = $form_state->getValues();

    if ($form_state->get('swcForm')) {
      $form_state->setValue('processor_settings', $values['processor_settings']);
      $source_facet_settings = $form_state->get('source_facet_settings');
      $facet_settings_values = [];
      foreach ($this->fieldMetaData as $field => $metadata) {
        if (in_array($field, $source_facet_settings)) {
          $facet_settings_values[$field] = NestedArray::getValue($values, array_merge($metadata['parents'], [$field]));
        }
        else {
          $form_state->setValue($field, NestedArray::getValue($values, array_merge($metadata['parents'], [$field])));
        }
      }
      $form_state->setValue('facet_settings', $facet_settings_values);

    }
    else {
      $form_state->setValue('widget_config', $values['settings']['widget_config']);
      $form_state->setValue('facet_settings', $values['settings']['facet_settings']);
      $form_state->setValue('facet_sorting', $values['settings']['facet_sorting']);
      $form_state->setValue('weights', $values['settings']['weights']);
      $form_state->setValue('processor_settings', $values['settings']['processor_settings']);
    }
    // Let the facets class do the majority of the saving work.
    parent::submitForm($form, $form_state);
    $values = $form_state->getValues();

    // Store processor settings.
    /** @var \Drupal\facets\FacetInterface $facet */
    $facet = $this->entity;

    /** @var \Drupal\facets\Processor\ProcessorInterface $processor */
    $processors = $facet->getProcessors(FALSE);
    foreach ($processors as $processor_id => $processor) {
      $form_container_key = $processor instanceof SortProcessorInterface ? 'facet_sorting' : 'facet_settings';

      $path = '';
      if ($form_state->get('swcForm')) {
        if ($form_container_key === 'facet_sorting') {
          $path = array_merge($this->fieldMetaData['facet_sorting']['parents'], ['facet_sorting', $processor_id]);
        }
        elseif (isset($this->fieldMetaData[$processor_id]['parents'])) {
          $path = array_merge($this->fieldMetaData[$processor_id]['parents'] ?? [], [$processor_id]);
        }
      }
      else {
        $path = array_merge(self::NONSWC_SETTINGS, [$form_container_key, $processor_id]);
      }

      if (!$path || empty(NestedArray::getValue($values, array_merge($path, ['status'])))) {
        $facet->removeProcessor($processor_id);
        continue;
      }
      $new_settings = [
        'processor_id' => $processor_id,
        'weights' => [],
        'settings' => [],
      ];
      if (!empty($values['processors'][$processor_id]['weights'])) {
        $new_settings['weights'] = $values['processors'][$processor_id]['weights'];
      }

      $element = NestedArray::getValue($form, array_merge($path, ['settings']));
      if ($element) {
        $processor_form_state = SubformState::createForSubform($element, $form, $form_state);
        $processor->submitConfigurationForm($element, $processor_form_state, $facet);
        $new_settings['settings'] = $processor->getConfiguration();
      }
      $facet->addProcessor($new_settings);
    }

    $facet->save();
  }

  /**
   * Handles changes to the settings when the widget changes.
   */
  public function buildAjaxSettingsForm(array $form, FormStateInterface $form_state) {
    return $form['settings'];
  }

  /**
   * Recursively update the #states attribute with the provided parent path.
   */
  protected function updateStateConditions(array &$element, array $parents): void {
    $p = $parents;
    if (count($parents) === 1) {
      $new_parents = reset($p);
    }
    else {
      $new_parents = array_shift($p) . '[';
      $new_parents .= implode("][", $p) . ']';
    }

    foreach ($element as $key => &$item) {
      if ($key === '#states') {
        foreach ($item as $state => &$conditions) {
          foreach ($conditions as $condition => $value) {
            $new_condition = str_replace(
              'name="facet_settings',
              'name="' . $new_parents,
              $condition,
            );
            $conditions[$new_condition] = $value;
            unset($element[$key][$state][$condition]);
          }
        }
      }
      elseif (is_array($item)) {
        $this->updateStateConditions($item, $parents);
      }
    }
  }

}
