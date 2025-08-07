<?php

declare(strict_types=1);

namespace Drupal\search_web_components_block\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Template\Attribute;

/**
 * Provides a search component: box.
 *
 * @Block(
 *   id = "swc_search_box",
 *   admin_label = @Translation("Search Box"),
 *   category = @Translation("Search Components"),
 * )
 * @phpcs:disable Drupal.Semantics.FunctionT.NotLiteralString
 */
final class SearchBoxBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration(): array {
    return [
      'url' => '',
      'submitText' => '',
      'ariaLabelText' => '',
      'placeHolderText' => '',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function blockForm($form, FormStateInterface $form_state): array {
    $form['url'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Search page url or path'),
      '#default_value' => $this->configuration['url'],
    ];
    $form['submitText'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Text for the submit button'),
      '#default_value' => $this->configuration['submitText'],
    ];
    $form['ariaLabelText'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Aria label for search input'),
      '#default_value' => $this->configuration['ariaLabelText'],
    ];
    $form['placeHolderText'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Placeholder text for search input'),
      '#default_value' => $this->configuration['placeHolderText'],
    ];
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state): void {
    $this->configuration['url'] = $form_state->getValue('url');
    $this->configuration['submitText'] = $form_state->getValue('submitText');
    $this->configuration['ariaLabelText'] = $form_state->getValue('ariaLabelText');
    $this->configuration['placeHolderText'] = $form_state->getValue('placeHolderText');
  }

  /**
   * {@inheritdoc}
   */
  public function build(): array {
    $config = $this->configuration;
    $searchAttributes = new Attribute();

    if ($config['url']) {
      $searchAttributes->setAttribute('url', $config['url']);
    }
    if ($config['submitText']) {
      $searchAttributes->setAttribute('submitText', $this->t($config['submitText'])->__toString());
    }
    if ($config['ariaLabelText']) {
      $searchAttributes->setAttribute('ariaLabelText', $this->t($config['ariaLabelText'])->__toString());
    }
    if ($config['placeHolderText']) {
      $searchAttributes->setAttribute('placeHolderText', $this->t($config['placeHolderText'])->__toString());
    }

    return [
      '#theme' => 'swc_search_box',
      '#search_attributes' => $searchAttributes,
      '#attached' => [
        'library' => [
          'search_web_components/components',
        ],
      ],
    ];
  }

}
