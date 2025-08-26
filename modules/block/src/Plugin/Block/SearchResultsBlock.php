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
 *   id = "swc_search_results",
 *   admin_label = @Translation("Results"),
 *   category = @Translation("Search Components"),
 * )
 */
final class SearchResultsBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration(): array {
    return [
      'resultField' => '',
      'mappings' => '',
      'titleField' => '',
      'thumbnailField' => '',
      'listFields' => '',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function blockForm($form, FormStateInterface $form_state): array {
    $form['resultField'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Override Field'),
      '#description' => $this->t("The field from the index to use to map a result to an element."),
      '#default_value' => $this->configuration['resultField'],
    ];
    $form['mappings'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Override Mappings'),
      '#description' => $this->t("A JSON array of object mappings An array of objects that contain the element, keys, and settings for results. I.e. [{\"element\":\"search-result-element-rendered\",\"keys\":[\"article\",\"page\"],\"settings\":{\"key\":\"rendered_result\"}}]. 'default' can be used as a fallback for unmapped results. When using the display switcher keys can be appended with the display id i.e `-grid` to make mapping specific to a display type. Tools like <a href='https://jsonformatter.org/' target='_blank'>https://jsonformatter.org/</a>a can help validate your JSON."),
      '#default_value' => $this->configuration['mappings'],
    ];
    $form['titleField'] =[
      '#type' => 'textfield',
      '#title' => $this->t('Title Fields'),
      '#description' => $this->t("Title field from the index to retrieve."),
      '#default_value' => $this->configuration['titleField'],
    ];
    $form['thumbnailField'] =[
      '#type' => 'textfield',
      '#title' => $this->t('Thumbnail Fields'),
      '#description' => $this->t("Thumbnail field from the index to retrieve."),
      '#default_value' => $this->configuration['thumbnailField'],
    ];
    $form['listFields'] =[
      '#type' => 'textfield',
      '#title' => $this->t('List Fields'),
      '#description' => $this->t("Comma-separated fields from the index to retrieve."),
      '#default_value' => $this->configuration['listFields'],
    ];
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state): void {
    $this->configuration['resultField'] = $form_state->getValue('resultField');
    $this->configuration['mappings'] = $form_state->getValue('mappings');
    $this->configuration['titleField'] = $form_state->getValue('titleField');
    $this->configuration['thumbnailField'] = $form_state->getValue('thumbnailField');
    $this->configuration['listFields'] = $form_state->getValue('listFields');
  }

  /**
   * {@inheritdoc}
   */
  public function build(): array {
    $config = $this->configuration;
    $searchAttributes = new Attribute();

    if ($config['resultField']) {
      $searchAttributes->setAttribute('resultField', $config['resultField']);
    }
    if ($config['mappings']) {
      $searchAttributes->setAttribute('mappings', $config['mappings']);
    }

    if ($config['titleField']) {
      $searchAttributes->setAttribute('titleField', $config['titleField']);
    }
    if ($config['thumbnailField']) {
      $searchAttributes->setAttribute('thumbnailField', $config['thumbnailField']);
    }
    if ($config['listFields']) {
      $searchAttributes->setAttribute('listFields', $config['listFields']);
    }

    return [
      '#theme' => 'swc_search_results',
      '#search_attributes' => $searchAttributes,
      '#attached' => [
        'library' => [
          'search_web_components/components',
        ],
      ],
    ];
  }

}
