<?php

declare(strict_types=1);

namespace Drupal\search_web_components_block\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Template\Attribute;

/**
 * Provides a More Searchers component.
 *
 * @Block(
 *   id = "swc_more_searchers",
 *   admin_label = @Translation("More Searchers"),
 *   category = @Translation("Search Components"),
 * )
 */
final class MoreSearchersBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration(): array {
    return [
      'blockTitle' => '',
      'blockDescription' => '',
      'blockUrls' => '',
      'blockIcon' => '',
      'Urls' => '',
      'isCollapsible' => FALSE,
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function blockForm($form, FormStateInterface $form_state): array {
    $form['blockIcon'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Block Icon'),
      '#default_value' => $this->configuration['blockIcon'],
    ];
    $form['blockTitle'] = [
      '#type' => 'textfield',
      '#required' => TRUE,
      '#title' => $this->t('Block Title'),
      '#default_value' => $this->configuration['blockTitle'],
    ];
    $form['blockDescription'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Block Description'),
      '#default_value' => $this->configuration['blockDescription'],
    ];
    $form['blockUrls'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Block Urls (deprecated)'),
      '#description' => $this->t('Deprecated. Use Urls field instead.'),
      '#default_value' => $this->configuration['blockUrls'],
    ];
    $form['Urls'] = [
      '#type' => 'textarea',
      '#required' => TRUE,
      '#title' => $this->t('Urls'),
      '#description' => $this->t('A list of URLs with the format: {"title": {"url": "http://example.com?q=%placeholder%", "no_query": "http://example.com/default", "description": "Optional description text", "format": "optional format"}}. The %placeholder% string will be replaced with the user\'s search query. The no_query URL will be used when there is no search query.'),
      '#default_value' => $this->configuration['Urls'],
    ];
    $form['isCollapsible'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Make block collapsible'),
      '#default_value' => !empty($this->configuration['isCollapsible']) ? $this->configuration['isCollapsible'] : FALSE,
    ];
    $form['startsCollapsed'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Start with block collapsed'),
      '#default_value' => !empty($this->configuration['startsCollapsed']) ? $this->configuration['startsCollapsed'] : FALSE,
      '#states' => [
        'visible' => [
          ':input[name="isCollapsible"]' => ['checked' => TRUE],
        ],
      ],
    ];
    $form['blockID'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Block ID'),
      '#description' => $this->t('An optional ID to add to the block wrapper element. This can be used for targeting the block with custom CSS or JavaScript.'),
      '#default_value' => $this->configuration['blockID'] ?? '',
    ];
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state): void {
    $this->configuration['blockTitle'] = $form_state->getValue('blockTitle');
    $this->configuration['blockDescription'] = !empty($form_state->getValue('blockDescription')) ? $form_state->getValue('blockDescription') : '';
    $this->configuration['blockIcon'] = $form_state->getValue('blockIcon');
    $this->configuration['blockUrls'] = $form_state->getValue('blockUrls');
    $this->configuration['isCollapsible'] = $form_state->getValue('isCollapsible');
    $this->configuration['startsCollapsed'] = $form_state->getValue('startsCollapsed');
    $this->configuration['Urls'] = $form_state->getValue('Urls');
    $this->configuration['blockID'] = $form_state->getValue('blockID');
  }

  /**
   * {@inheritdoc}
   */
  public function build(): array {
    $config = $this->configuration;
    $searchAttributes = new Attribute();

    if (!empty($config['blockTitle'])) {
      $searchAttributes->setAttribute('blockTitle', $config['blockTitle']);
    }
    if (!empty($config['blockDescription'])) {
      $searchAttributes->setAttribute('blockDescription', $config['blockDescription']);
    }
    if (!empty($config['blockUrls'])) {
      $searchAttributes->setAttribute('blockUrls', $config['blockUrls']);
    }
    if (!empty($config['blockIcon'])) {
      $searchAttributes->setAttribute('blockIcon', $config['blockIcon']);
    }
    if (!empty($config['isCollapsible'])) {
      $searchAttributes->setAttribute('isCollapsible', $config['isCollapsible']);
    }
    if (!empty($config['Urls'])) {
      $searchAttributes->setAttribute('Urls', $config['Urls']);
    }
    if (!empty($config['startsCollapsed'])) {
      $searchAttributes->setAttribute('startsCollapsed', $config['startsCollapsed']);
    }
    if (!empty($config['blockID'])) {
      $searchAttributes->setAttribute('id', $config['blockID']);
    }

    return [
      '#theme' => 'swc_more_searchers',
      '#search_attributes' => $searchAttributes,
      '#attached' => [
        'library' => [
          'search_web_components/components',
        ],
      ],
    ];
  }
}