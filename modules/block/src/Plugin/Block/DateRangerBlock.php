<?php

declare(strict_types=1);

namespace Drupal\search_web_components_block\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Template\Attribute;

/**
 * Provides a search component: sort block.
 *
 * @Block(
 *   id = "swc_date_ranger",
 *   admin_label = @Translation("Year Range"),
 *   category = @Translation("Search Components"),
 * )
 * @phpcs:disable Drupal.Semantics.FunctionT.NotLiteralString
 */
final class DateRangerBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration(): array {
    return [
      'facetField' => 'date',
      'labelText' => 'Year Range',
      'placeHolderFromText' => '',
      'placeHolderToText' => '',
      'submitButton' => 'Filter',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function blockForm($form, FormStateInterface $form_state): array {
    $form['submitButton'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Submit Button Text'),
      '#default_value' => $this->configuration['submitButton'],
    ];
    $form['labelText'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Label Text'),
      '#default_value' => $this->configuration['labelText'],
    ];
    $form['placeHolderFromText'] = [
      '#type' => 'textfield',
      '#title' => $this->t('From Placeholder'),
      '#default_value' => $this->configuration['placeHolderFromText'],
    ];
    $form['placeHolderToText'] = [
      '#type' => 'textfield',
      '#title' => $this->t('To Placeholder'),
      '#default_value' => $this->configuration['placeHolderToText'],
    ];
    $form['facetField'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Facet Field'),
      '#default_value' => $this->configuration['facetField'],
    ];
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state): void {
    $this->configuration['facetField'] = $form_state->getValue('facetField');
    $this->configuration['placeHolderFromText'] = $form_state->getValue('placeHolderFromText');
    $this->configuration['placeHolderToText'] = $form_state->getValue('placeHolderToText');
    $this->configuration['labelText'] = $form_state->getValue('labelText');
    $this->configuration['submitButton'] = $form_state->getValue('submitButton');
  }

  /**
   * {@inheritdoc}
   */
  public function build(): array {
    $config = $this->configuration;

    $searchAttributes = new Attribute();

    if ($config['submitButton']) {
      $searchAttributes->setAttribute('submitButton', $config['submitButton']);
    }

    if ($config['labelText']) {
      $searchAttributes->setAttribute('labelText', $config['labelText']);
    }

    if ($config['placeHolderFromText']) {
      $searchAttributes->setAttribute('placeHolderFromText', $config['placeHolderFromText']);
    }

    if ($config['placeHolderToText']) {
      $searchAttributes->setAttribute('placeHolderToText', $config['placeHolderToText']);
    }

    if ($config['facetField']) {
      $searchAttributes->setAttribute('facetField', $config['facetField']);
    }

    return [
      '#theme' => 'swc_date_ranger',
      '#search_attributes' => $searchAttributes,
      '#attached' => [
        'library' => [
          'search_web_components/components',
        ],
      ],
    ];
  }

}
