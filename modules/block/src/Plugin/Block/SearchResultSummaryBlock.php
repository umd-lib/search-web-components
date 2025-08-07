<?php

declare(strict_types=1);

namespace Drupal\search_web_components_block\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Template\Attribute;

/**
 * Provides a search component: result summary block.
 *
 * @Block(
 *   id = "swc_search_result_summary",
 *   admin_label = @Translation("Result Summary"),
 *   category = @Translation("Search Components"),
 * )
 * @phpcs:disable Drupal.Semantics.FunctionT.NotLiteralString
 */
final class SearchResultSummaryBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration(): array {
    return [
      'summaryText' => '',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function blockForm($form, FormStateInterface $form_state): array {
    $form['summaryText'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Result summary text'),
      '#description' => $this->t('@start, @end, @total, @searchQuery, and @time tokens will be replaced with results from the search.'),
      '#default_value' => $this->configuration['summaryText'],
    ];
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state): void {
    $this->configuration['summaryText'] = $form_state->getValue('summaryText');
  }

  /**
   * {@inheritdoc}
   */
  public function build(): array {
    $config = $this->configuration;
    $searchAttributes = new Attribute();

    if ($config['summaryText']) {
      $searchAttributes->setAttribute('summaryText', $this->t($config['summaryText'])->__toString());
    }

    return [
      '#theme' => 'swc_search_result_summary',
      '#search_attributes' => $searchAttributes,
      '#attached' => [
        'library' => [
          'search_web_components/components',
        ],
      ],
    ];
  }

}
