<?php

namespace Drupal\search_web_components_facets\Plugin\facets\widget;

use Drupal\Core\Form\FormStateInterface;
use Drupal\facets\FacetInterface;

/**
 * Provides a facet widget for facet-dropdown components.
 *
 * @FacetsWidget(
 *   id = "swc_dropdown",
 *   label = @Translation("Search Web Components: Dropdown"),
 *   description = @Translation("Configuration options for a dropdown facet."),
 * )
 */
class DropdownWidget extends BaseWebComponentWidget {

  /**
   * {@inheritdoc}
   */
  public function buildConfigurationForm(array $form, FormStateInterface $form_state, FacetInterface $facet) {
    $form = parent::buildConfigurationForm($form, $form_state, $facet);

    $form['selectLabel'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Select label'),
      '#description' => $this->t('The label text to display inside the select box.'),
      '#default_value' => $this->configuration['selectLabel'],
    ];

    return $form;
  }

}
