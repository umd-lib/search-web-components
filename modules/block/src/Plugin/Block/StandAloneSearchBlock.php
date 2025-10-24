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
      'blockTitle' => '',
      'blockDescription' => '',
      'bottomLinkText' => '',
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
    $form['bottomLinkText'] = [
      '#type' => 'textfield',
      '#required' => TRUE,
      '#title' => $this->t('Bottom Link Text'),
      '#description' => $this->t('Use %total% as a placeholder for a results count.'),
      '#default_value' => $this->configuration['bottomLinkText'],
    ];
    $form['searchEndpoint'] = [
      '#type' => 'textfield',
      '#required' => TRUE,
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
    $form['resultsCount'] = [
      '#type' => 'number',
      '#required' => TRUE,
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
    $this->configuration['blockTitle'] = $form_state->getValue('blockTitle');
    $this->configuration['blockDescription'] = $form_state->getValue('blockDescription');
    $this->configuration['bottomLinkText'] = $form_state->getValue('bottomLinkText');
    $this->configuration['blockIcon'] = $form_state->getValue('blockIcon');
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
    if (!empty($config['blockTitle'])) {
      $searchAttributes->setAttribute('blockTitle', $config['blockTitle']);
    }
    if (!empty($config['blockDescription'])) {
      $searchAttributes->setAttribute('blockDescription', $config['blockDescription']);
    }
    if (!empty($config['bottomLinkText'])) {
      $searchAttributes->setAttribute('bottomLinkText', $config['bottomLinkText']);
    }
    if (!empty($config['blockIcon'])) {
      $searchAttributes->setAttribute('blockIcon', $config['blockIcon']);
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