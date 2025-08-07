<?php

declare(strict_types=1);

namespace Drupal\search_web_components_block\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Template\Attribute;

/**
 * Provides a search component: results per page block.
 *
 * @Block(
 *   id = "swc_search_results_per_page",
 *   admin_label = @Translation("Results per page"),
 *   category = @Translation("Search Components"),
 * )
 * @phpcs:disable Drupal.Semantics.FunctionT.NotLiteralString
 */
final class SearchResultsPerPageBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration(): array {
    return [
      'type' => 'select',
      'labelText' => 'Per page',
      'options' => NULL,
      'htmlSelectLabel' => 'Per page',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function blockForm($form, FormStateInterface $form_state): array {
    $form['type'] = [
      '#type' => 'select',
      '#title' => $this->t('Display as'),
      '#default_value' => $this->configuration['type'],
      '#options' => [
        'select' => $this->t('select'),
        'list' => $this->t('list'),
        'html' => $this->t('html'),
      ],
      '#required' => TRUE,
    ];
    $form['labelText'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Label text'),
      '#default_value' => $this->configuration['labelText'],
    ];
    $form['htmlSelectLabel'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Html select label'),
      '#description' => $this->t('The label text to display inside an HTML select'),
      '#default_value' => $this->configuration['htmlSelectLabel'],
    ];
    $form['options'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Override available options'),
      '#description' => $this->t('Override the available page size options. One page size per line. Each line should have a page size and label by a | i.e. 10|Ten'),
      '#default_value' => $this->configuration['options'],
    ];
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state): void {
    $this->configuration['type'] = $form_state->getValue('type');
    $this->configuration['labelText'] = $form_state->getValue('labelText');
    $this->configuration['options'] = $form_state->getValue('options');
    $this->configuration['htmlSelectLabel'] = $form_state->getValue('htmlSelectLabel');
  }

  /**
   * {@inheritdoc}
   */
  public function build(): array {
    $config = $this->configuration;

    $sourceDisplays = $config['options'] ?? '';
    $sourceDisplays = explode("\n", $sourceDisplays);
    $sourceDisplays = array_filter($sourceDisplays);
    $displays = [];
    foreach ($sourceDisplays as $display) {
      if (substr_count($display, '|') !== 1) {
        continue;
      }
      [$key, $label] = explode('|', $display);
      $displays[] = [
        'key' => trim($key),
        'label' => $this->t(trim($label))->__toString(),
      ];
    }

    $searchAttributes = new Attribute([
      'type' => $config['type'],
    ]);

    if ($displays) {
      $searchAttributes->setAttribute('options', json_encode($displays));
    }
    if ($config['labelText']) {
      $searchAttributes->setAttribute('labelText', $this->t($config['labelText'])->__toString());
    }
    if ($config['htmlSelectLabel']) {
      $searchAttributes->setAttribute('htmlSelectLabel', $this->t($config['htmlSelectLabel'])->__toString());
    }

    return [
      '#theme' => 'swc_search_results_per_page',
      '#search_attributes' => $searchAttributes,
      '#attached' => [
        'library' => [
          'search_web_components/components',
        ],
      ],
    ];
  }

}
