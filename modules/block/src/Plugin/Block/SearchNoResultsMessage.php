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
 *   id = "swc_search_no_results_message",
 *   admin_label = @Translation("No Results Message"),
 *   category = @Translation("Search Components"),
 * )
 */
final class SearchNoResultsMessage extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration(): array {
    return [
      'noResultsContent' => NULL,
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function blockForm($form, FormStateInterface $form_state): array {
    $form['noResultsContent'] = [
      '#type' => 'text_format',
      '#title' => $this->t('No results message'),
      '#description' => $this->t('Text to display when there are no search results.'),
      '#default_value' => $this->configuration['noResultsContent']['value'],
      '#format' => $this->options['noResultsContent']['format'] ?? filter_default_format(),
    ];
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state): void {
    $this->configuration['noResultsContent'] = $form_state->getValue('noResultsContent');
  }

  /**
   * {@inheritdoc}
   */
  public function build(): array {
    $config = $this->configuration;
    return [
      '#theme' => 'swc_search_no_results_message',
      '#search_attributes' => new Attribute(),
      '#noResultsContent' => [
        '#type' => 'processed_text',
        '#text' => $config['noResultsContent']['value'],
        '#format' => $config['noResultsContent']['format'],
      ],
      '#attached' => [
        'library' => [
          'search_web_components/components',
        ],
      ],
    ];
  }

}
