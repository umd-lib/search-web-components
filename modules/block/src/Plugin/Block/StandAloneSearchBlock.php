<?php

declare(strict_types=1);

namespace Drupal\search_web_components_block\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Template\Attribute;

/**
 * Provides a stand-alone search component.
 *
 * @Block(
 *   id = "swc_standalone_search_results",
 *   admin_label = @Translation("Standalone Results"),
 *   category = @Translation("Search Components"),
 * )
 */
final class StandAloneSearchBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration(): array {
    return [
      'searchEndpoint' => '',
      'resultsCount' => '5',
      'noResultsLink' => '',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function blockForm($form, FormStateInterface $form_state): array {
    $form['searchEndpoint'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Search Endpoint'),
      '#description' => $this->t('External API URL'),
      '#default_value' => $this->configuration['searchEndpoint'],
    ];
    $form['noResultsLink'] = [
      '#type' => 'textfield',
      '#title' => $this->t('No Results Link'),
      '#description' => $this->t('Search URL to use if no results'),
      '#default_value' => $this->configuration['noResultsLink'],
    ];
    $form['moduleLink'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Module Link'),
      '#description' => $this->t('Where to redirect user for more results'),
      '#default_value' => $this->configuration['moduleLink'],
    ];
    $form['resultsCount'] = [
      '#type' => 'number',
      '#title' => $this->t('Number of Results'),
      '#description' => $this->t('How many results to display in standalone search block'),
      '#default_value' => $this->configuration['resultsCount'],
    ];
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state): void {
    $this->configuration['searchEndpoint'] = $form_state->getValue('searchEndpoint');
    $this->configuration['resultsCount'] = $form_state->getValue('resultsCount');
    $this->configuration['noResultsLink'] = $form_state->getValue('noResultsLink');
    $this->configuration['moduleLink'] = $form_state->getValue('moduleLink');
  }

  /**
   * {@inheritdoc}
   */
  public function build(): array {
    $config = $this->configuration;
    $searchAttributes = new Attribute();

    if (!empty($config['searchEndpoint'])) {
      $searchAttributes->setAttribute('searchEndpoint', $config['searchEndpoint']);
    }
    if (!empty($config['resultsCount'])) {
      $searchAttributes->setAttribute('resultsCount', $config['resultsCount']);
    }
    if (!empty($config['noResultsLink'])) {
      $searchAttributes->setAttribute('noResultsLink', $config['noResultsLink']);
    }
    if (!empty($config['moduleLink'])) {
      $searchAttributes->setAttribute('moduleLink', $config['moduleLink']);
    }


    return [
      '#theme' => 'swc_standalone_search_results',
      '#search_attributes' => $searchAttributes,
      '#attached' => [
        'library' => [
          'search_web_components/components',
        ],
      ],
    ];
  }

}