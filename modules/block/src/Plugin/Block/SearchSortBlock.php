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
 *   id = "swc_search_sort",
 *   admin_label = @Translation("Sort"),
 *   category = @Translation("Search Components"),
 * )
 * @phpcs:disable Drupal.Semantics.FunctionT.NotLiteralString
 */
final class SearchSortBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration(): array {
    return [
      'type' => 'select',
      'labelText' => 'Sort by',
      'sorts' => NULL,
      'htmlSelectLabel' => 'Sort by',
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
      '#title' => $this->t('Label'),
      '#default_value' => $this->configuration['labelText'],
    ];
    $form['htmlSelectLabel'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Html select label'),
      '#description' => $this->t('The label text to display inside an HTML select'),
      '#default_value' => $this->configuration['htmlSelectLabel'],
    ];
    $form['sorts'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Override available sorts'),
      '#description' => $this->t('Override the available sorting options. One sort option per line. Each line should have a field name, direction(asc or desc), and label separated by a | i.e. title|desc|Z-A'),
      '#default_value' => $this->configuration['sorts'],
    ];
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state): void {
    $this->configuration['type'] = $form_state->getValue('type');
    $this->configuration['labelText'] = $form_state->getValue('labelText');
    $this->configuration['htmlSelectLabel'] = $form_state->getValue('htmlSelectLabel');
    $this->configuration['sorts'] = $form_state->getValue('sorts');
  }

  /**
   * {@inheritdoc}
   */
  public function build(): array {
    $config = $this->configuration;

    $sourceSorts = $config['sorts'] ?? '';
    $sourceSorts = explode("\n", $sourceSorts);
    $sourceSorts = array_filter($sourceSorts);
    $sorts = [];
    foreach ($sourceSorts as $sort) {
      if (substr_count($sort, '|') !== 2) {
        continue;
      }
      [$key, $order, $label] = explode('|', $sort);
      $sorts[] = [
        'key' => trim($key),
        'order' => trim($order),
        'label' => $this->t(trim($label))->__toString(),
      ];
    }

    $searchAttributes = new Attribute([
      'type' => $config['type'],
    ]);

    if ($sorts) {
      $searchAttributes->setAttribute('sorts', json_encode($sorts));
    }
    if ($config['labelText']) {
      $searchAttributes->setAttribute('labelText', $this->t($config['labelText'])->__toString());
    }
    if ($config['htmlSelectLabel']) {
      $searchAttributes->setAttribute('htmlSelectLabel', $this->t($config['htmlSelectLabel'])->__toString());
    }

    return [
      '#theme' => 'swc_search_sort',
      '#search_attributes' => $searchAttributes,
      '#attached' => [
        'library' => [
          'search_web_components/components',
        ],
      ],
    ];
  }

}
