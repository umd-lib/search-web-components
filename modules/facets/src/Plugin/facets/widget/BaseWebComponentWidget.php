<?php

namespace Drupal\search_web_components_facets\Plugin\facets\widget;

use Drupal\Core\Form\FormStateInterface;
use Drupal\facets\FacetInterface;
use Drupal\facets\Widget\WidgetPluginBase;
use Drupal\search_web_components_facets\Form\FacetElementHelperTrait;

/**
 * Base class for SWC facet components.
 */
abstract class BaseWebComponentWidget extends WidgetPluginBase {

  use FacetElementHelperTrait;

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration() {
    $configuration = $this->defaultValues() + parent::defaultConfiguration();

    return $configuration;
  }

  /**
   * {@inheritdoc}
   */
  public function buildConfigurationForm(array $form, FormStateInterface $form_state, FacetInterface $facet) {
    $form = parent::buildConfigurationForm($form, $form_state, $facet);

    $form['divider'] = [
      '#markup' => '<hr/>',
      '#weight' => 9,
    ];

    $form['show_numbers']['#weight'] = 10;

    $form = array_merge($form, $this->formElements());

    unset($form['showLabel']);
    unset($form['showCount']);

    return $form;
  }

}
