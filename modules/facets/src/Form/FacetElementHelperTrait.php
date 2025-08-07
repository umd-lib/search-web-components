<?php

namespace Drupal\search_web_components_facets\Form;

use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\Core\Template\Attribute;

/**
 * A helper trait to provide facet properties available for all swc components.
 *
 * @phpcs:disable Drupal.Semantics.FunctionT.NotLiteralString
 */
trait FacetElementHelperTrait {

  use StringTranslationTrait;

  /**
   * The default values for all the facet form elements.
   */
  public function defaultValues(): array {
    return [
      'showLabel' => '',
      'showCount' => TRUE,
      'showReset' => FALSE,
      'resetText' => 'Reset (@count)',
      'collapsible' => FALSE,
      'closed' => FALSE,
      'showCountInCollapseLabel' => FALSE,
      'preferAttributes' => FALSE,
    ];
  }

  /**
   * The form elements for all the facet elements.
   */
  public function formElements(): array {
    $form = [];

    $form['preferAttributes'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Prefer attribute values configured here over facet configuration'),
      '#default_value' => $this->configuration['preferAttributes'],
      '#weight' => 20,
    ];
    $form['showLabel'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Show the facet label'),
      '#default_value' => $this->configuration['showLabel'],
      '#weight' => 20,
    ];
    $form['showCount'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Show count'),
      '#default_value' => $this->configuration['showCount'],
      '#weight' => 20,
    ];
    $form['showReset'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Show reset button in facet'),
      '#default_value' => $this->configuration['showReset'],
      '#weight' => 20,
    ];
    $form['resetText'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Reset text'),
      '#description' => $this->t('The label to use for the reset/clear facet selection button. `@count` can be used as a token that will be replaced with the number of selected options.'),
      '#default_value' => $this->configuration['resetText'],
      '#weight' => 20,
    ];
    $form['collapsible'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Collapsible'),
      '#default_value' => $this->configuration['collapsible'],
      '#weight' => 20,
    ];
    $form['closed'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Close collapsible facet by default'),
      '#default_value' => $this->configuration['closed'],
      '#weight' => 20,
    ];
    $form['showCountInCollapseLabel'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Show applied options count in collapsible facet label'),
      '#default_value' => $this->configuration['showCountInCollapseLabel'],
      '#weight' => 20,
    ];

    return $form;
  }

  /**
   * Save each form element to the configuration array.
   */
  public function submitElements(FormStateInterface $form_state, array $values): void {
    $boolAttrs = [
      'preferAttributes',
      'showLabel',
      'showCount',
      'showReset',
      'collapsible',
      'closed',
      'showCountInCollapseLabel',
    ];

    foreach ($boolAttrs as $attr) {
      if (isset($values[$attr])) {
        if ($values[$attr]) {
          $values[$attr] = TRUE;
        }
        else {
          $values[$attr] = FALSE;
        }
      }
    }

    $this->configuration['preferAttributes'] = $values['preferAttributes'] ?? NULL;
    $this->configuration['showLabel'] = $values['showLabel'] ?? NULL;
    $this->configuration['showCount'] = $values['showCount'] ?? NULL;
    $this->configuration['showReset'] = $values['showReset'] ?? NULL;
    $this->configuration['resetText'] = $values['resetText'] ?? NULL;
    $this->configuration['collapsible'] = $values['collapsible'] ?? NULL;
    $this->configuration['closed'] = $values['closed'] ?? NULL;
    $this->configuration['showCountInCollapseLabel'] = $values['showCountInCollapseLabel'] ?? NULL;
  }

  /**
   * Get a render array with every facet set or add to an Attribute object.
   */
  public function renderProperties(Attribute $attributes = NULL): array|Attribute {
    $config = $this->configuration;
    $renderArray = [];
    if ($config['preferAttributes'] !== NULL) {
      $renderArray['#preferAttributes'] = $config['preferAttributes'];
    }
    if ($config['showLabel'] !== NULL) {
      $renderArray['#showLabel'] = $config['showLabel'];
    }
    if ($config['showCount'] !== NULL) {
      $renderArray['#showCount'] = $config['showCount'];
    }
    if ($config['showReset'] !== NULL) {
      $renderArray['#showReset'] = $config['showReset'];
    }
    if ($config['resetText'] !== NULL) {
      $renderArray['#resetText'] = $this->t($config['resetText'])->__toString();
    }
    if ($config['collapsible'] !== NULL) {
      $renderArray['#collapsible'] = $config['collapsible'];
    }
    if ($config['closed'] !== NULL) {
      $renderArray['#closed'] = $config['closed'];
    }
    if ($config['showCountInCollapseLabel'] !== NULL) {
      $renderArray['#showCountInCollapseLabel'] = $config['showCountInCollapseLabel'];
    }

    if ($attributes) {
      foreach ($renderArray as $key => $value) {
        $key = ltrim($key, '#');

        if ($value !== FALSE) {
          $attributes->setAttribute($key, $value);
        }
      }

      return $attributes;
    }
    else {
      return $renderArray;
    }
  }

}
