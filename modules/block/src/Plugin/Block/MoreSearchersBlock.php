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
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function blockForm($form, FormStateInterface $form_state): array {
    $form['blockIcon'] = [
      '#type' => 'textfield',
      '#required' => TRUE,
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
      '#type' => 'textfield',
      '#required' => TRUE,
      '#title' => $this->t('Block Description'),
      '#default_value' => $this->configuration['blockDescription'],
    ];
    $form['blockUrls'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Block Urls'),
      '#description' => $this->t('This should include a list of URLs with the format "title" => "url"'),
      '#default_value' => $this->configuration['blockUrls'],
    ];
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state): void {
    $this->configuration['blockTitle'] = $form_state->getValue('blockTitle');
    $this->configuration['blockDescription'] = $form_state->getValue('blockDescription');
    $this->configuration['blockIcon'] = $form_state->getValue('blockIcon');
    $this->configuration['blockUrls'] = $form_state->getValue('blockUrls');
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