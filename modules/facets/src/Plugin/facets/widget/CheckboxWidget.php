<?php

namespace Drupal\search_web_components_facets\Plugin\facets\widget;

use Drupal\Core\Form\FormStateInterface;
use Drupal\facets\FacetInterface;

/**
 * Provides a facet widget for facet-checkbox components.
 *
 * @FacetsWidget(
 *   id = "swc_checkbox",
 *   label = @Translation("Search Web Components: Checkbox"),
 *   description = @Translation("Configuration options for a checkbox facet."),
 * )
 */
class CheckboxWidget extends BaseWebComponentWidget {

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration() {
    return [
      'useRadios' => FALSE,
      'soft_limit' => [
        'limit' => 0,
        'less_label' => 'Show less',
        'more_label' => 'Show more',
      ],
    ] + parent::defaultConfiguration();
  }

  /**
   * {@inheritdoc}
   */
  public function buildConfigurationForm(array $form, FormStateInterface $form_state, FacetInterface $facet) {
    $form = parent::buildConfigurationForm($form, $form_state, $facet);

    $form['useRadios'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Use radio inputs'),
      '#default_value' => $this->configuration['useRadios'],
    ];

    $form['soft_limit'] = [
      '#type' => 'details',
      '#title' => $this->t('Soft limit settings'),
    ];

    $form['soft_limit']['limit'] = [
      '#type' => 'number',
      '#title' => $this->t('Limit'),
      '#description' => $this->t('The number of initial first level results to show. Set 0 to show all results.'),
      '#min' => 0,
      '#default_value' => $this->configuration['soft_limit']['limit'] ?? $this->defaultConfiguration()['soft_limit']['limit'],
    ];

    $form['soft_limit']['less_label'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Show less label'),
      '#description' => $this->t('This text will be used for "Show less" button.'),
      '#default_value' => $this->configuration['soft_limit']['less_label'] ?? $this->defaultConfiguration()['soft_limit']['less_label'],
    ];

    $form['soft_limit']['more_label'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Show more label'),
      '#description' => $this->t('This text will be used for "Show more" button.'),
      '#default_value' => $this->configuration['soft_limit']['more_label'] ?? $this->defaultConfiguration()['soft_limit']['more_label'],
    ];

    return $form;
  }

}
