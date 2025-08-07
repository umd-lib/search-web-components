<?php

namespace Drupal\search_web_components_facets\Plugin\facets\widget;

use Drupal\Core\Form\FormStateInterface;
use Drupal\facets\FacetInterface;

/**
 * Provides a facet widget for facet-dropdown-html components.
 *
 * @FacetsWidget(
 *   id = "swc_dropdown_html",
 *   label = @Translation("Search Web Components: Dropdown HTML"),
 *   description = @Translation("Configuration options for a button facet."),
 * )
 */
class DropdownHtmlWidget extends BaseWebComponentWidget {

  /**
   * {@inheritdoc}
   */
  public function buildConfigurationForm(array $form, FormStateInterface $form_state, FacetInterface $facet) {
    $form = parent::buildConfigurationForm($form, $form_state, $facet);

    $form['htmlSelectLabel'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Select label'),
      '#description' => $this->t('The label text to display inside the select box.'),
      '#default_value' => $this->configuration['htmlSelectLabel'],
      '#weight' => 0,
    ];
    $form['required'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Required'),
      '#description' => $this->t('When checked a user will have to choose a value for this field.'),
      '#default_value' => $this->configuration['required'],
      '#weight' => 0,
    ];
    $form['multipleSelect'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Allow selecting multiple values'),
      '#default_value' => $this->configuration['multipleSelect'],
      '#weight' => 0,
    ];

    return $form;
  }

}
