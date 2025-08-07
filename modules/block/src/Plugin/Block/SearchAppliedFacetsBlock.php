<?php

declare(strict_types=1);

namespace Drupal\search_web_components_block\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Template\Attribute;

/**
 * Provides a search component: applied facets block.
 *
 * @Block(
 *   id = "swc_search_applied_facets",
 *   admin_label = @Translation("Applied Facets"),
 *   category = @Translation("Search Components"),
 * )
 * @phpcs:disable Drupal.Semantics.FunctionT.NotLiteralString
 */
final class SearchAppliedFacetsBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration(): array {
    return [
      'removeText' => 'Remove @value',
      'resetText' => 'Reset',
      'showReset' => FALSE,
      'showIndividual' => FALSE,
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function blockForm($form, FormStateInterface $form_state): array {
    $form['showIndividual'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Show individual remove buttons'),
      '#default_value' => $this->configuration['showIndividual'],
    ];
    $form['removeText'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Remove text for individual facets'),
      '#description' => $this->t('@value can be used to use the facet value in the text.'),
      '#default_value' => $this->configuration['removeText'],
    ];
    $form['showReset'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Show reset/clear button'),
      '#default_value' => $this->configuration['showReset'],
    ];
    $form['resetText'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Text to show on the clear/reset button'),
      '#default_value' => $this->configuration['resetText'],
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state): void {
    $this->configuration['removeText'] = $form_state->getValue('removeText');
    $this->configuration['resetText'] = $form_state->getValue('resetText');
    $this->configuration['showReset'] = $form_state->getValue('showReset');
    $this->configuration['showIndividual'] = $form_state->getValue('showIndividual');
  }

  /**
   * {@inheritdoc}
   */
  public function build(): array {
    $config = $this->configuration;
    $searchAttributes = new Attribute();

    if ($config['removeText']) {
      $searchAttributes->setAttribute('removeText', $this->t($config['removeText'])->__toString());
    }
    if ($config['resetText']) {
      $searchAttributes->setAttribute('resetText', $this->t($config['resetText'])->__toString());
    }
    if ($config['showReset']) {
      $searchAttributes->setAttribute('showReset', $config['showReset']);
    }
    if ($config['showIndividual']) {
      $searchAttributes->setAttribute('showIndividual', $config['showIndividual']);
    }

    return [
      '#theme' => 'swc_search_applied_facets',
      '#search_attributes' => $searchAttributes,
      '#attached' => [
        'library' => [
          'search_web_components/components',
        ],
      ],
    ];
  }

}
