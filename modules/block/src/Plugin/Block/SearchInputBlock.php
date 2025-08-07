<?php

declare(strict_types=1);

namespace Drupal\search_web_components_block\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Template\Attribute;

/**
 * Provides a search component: input block.
 *
 * @Block(
 *   id = "swc_search_input",
 *   admin_label = @Translation("Search Input"),
 *   category = @Translation("Search Components"),
 * )
 * @phpcs:disable Drupal.Semantics.FunctionT.NotLiteralString
 */
final class SearchInputBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration(): array {
    return [
      'labelText' => 'Search',
      'placeHolderText' => 'Search',
      'clearText' => 'Remove',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function blockForm($form, FormStateInterface $form_state): array {
    $form['labelText'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Button label text'),
      '#default_value' => $this->configuration['labelText'],
    ];
    $form['placeHolderText'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Placeholder text'),
      '#default_value' => $this->configuration['placeHolderText'],
    ];
    $form['clearText'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Clear search text'),
      '#default_value' => $this->configuration['clearText'],
    ];
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state): void {
    $this->configuration['labelText'] = $form_state->getValue('labelText');
    $this->configuration['placeHolderText'] = $form_state->getValue('placeHolderText');
    $this->configuration['clearText'] = $form_state->getValue('clearText');
  }

  /**
   * {@inheritdoc}
   */
  public function build(): array {
    $config = $this->configuration;
    $searchAttributes = new Attribute();

    if ($config['labelText']) {
      $searchAttributes->setAttribute('labelText', $this->t($config['labelText'])->__toString());
    }
    if ($config['placeHolderText']) {
      $searchAttributes->setAttribute('placeHolderText', $this->t($config['placeHolderText'])->__toString());
    }
    if ($config['clearText']) {
      $searchAttributes->setAttribute('clearText', $this->t($config['clearText'])->__toString());
    }

    return [
      '#theme' => 'swc_search_input',
      '#search_attributes' => $searchAttributes,
      '#attached' => [
        'library' => [
          'search_web_components/components',
        ],
      ],
    ];
  }

}
