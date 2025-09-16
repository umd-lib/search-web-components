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
      'umd_sorts' => NULL,
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
        'umd-libraries' => $this->t('umd-libraries'),
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
    $form['umd_sorts'] = [
      '#type' => 'textarea',
      '#title' => $this->t('UMD Libraries Sort Configuration'),
      '#description' => $this->t('Configuration for the UMD Libraries sort option. Format is sort_by|order|results_per|post where each value is comma separated. Sort_by values are colon separated key/value pairs. Example: Title:object__title__display,Relevance:relevance|asc,desc|10,25,50,- All -'),
      '#default_value' => $this->configuration['umd_sorts'],
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
    $this->configuration['umd_sorts'] = $form_state->getValue('umd_sorts');
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

    // For the UMD libraries sort, we'll assume the format is pipe seperated, then comma seperated, values.
    // Though the sort_by values will also be colon seperated key/value pairs.
    // Also, the end result doesn't need to be an array, just a single object
    $umd_sorts = [];

    if (substr_count($config['umd_sorts'], '|') === 2) {
      [$sort_by, $order, $results_per] = explode('|', $config['umd_sorts']);

      $umd_sorts = [
        'sort_by' => explode(',', trim($sort_by)),
        'order' => explode(',', trim($order)),
        'results_per' => explode(',', trim($results_per)),
      ];
    }

    $searchAttributes = new Attribute([
      'type' => $config['type'],
    ]);

    if ($sorts) {
      $searchAttributes->setAttribute('sorts', json_encode($sorts));
    }
    if ($umd_sorts) {
      $searchAttributes->setAttribute('umd_sorts', json_encode($umd_sorts));
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
