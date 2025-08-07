<?php

declare(strict_types=1);

namespace Drupal\search_web_components_block\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Template\Attribute;

/**
 * Provides a search component: results display switcher block.
 *
 * @Block(
 *   id = "swc_search_results_switcher",
 *   admin_label = @Translation("Results display switcher"),
 *   category = @Translation("Search Components"),
 * )
 * @phpcs:disable Drupal.Semantics.FunctionT.NotLiteralString
 */
final class SearchResultsSwitcher extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration(): array {
    return [
      'options' => NULL,
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function blockForm($form, FormStateInterface $form_state): array {
    $form['options'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Override available options'),
      '#description' => $this->t('Override the available result display options. One display per line. Each line should have a display name and label by a | i.e. list|List'),
      '#default_value' => $this->configuration['options'],
    ];
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state): void {
    $this->configuration['options'] = $form_state->getValue('options');
  }

  /**
   * {@inheritdoc}
   */
  public function build(): array {
    $config = $this->configuration;
    $searchAttributes = new Attribute([]);

    $sourcePageSizes = $config['options'] ?? '';
    $sourcePageSizes = explode("\n", $sourcePageSizes);
    $sourcePageSizes = array_filter($sourcePageSizes);
    $sizes = [];
    foreach ($sourcePageSizes as $page_size) {
      if (substr_count($page_size, '|') !== 1) {
        continue;
      }
      [$key, $label] = explode('|', $page_size);
      $sizes[] = [
        'key' => trim($key),
        'label' => $this->t(trim($label))->__toString(),
      ];
    }

    if ($sizes) {
      $searchAttributes->setAttribute('options', json_encode($sizes));
    }

    return [
      '#theme' => 'swc_search_results_switcher',
      '#search_attributes' => $searchAttributes,
      '#attached' => [
        'library' => [
          'search_web_components/components',
        ],
      ],
    ];
  }

}
