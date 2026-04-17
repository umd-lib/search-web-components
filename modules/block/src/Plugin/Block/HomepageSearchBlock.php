<?php

declare(strict_types=1);

namespace Drupal\search_web_components_block\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Template\Attribute;

/**
 * Provides a homepage hero search block.
 *
 * @Block(
 *   id = "swc_homepage_search",
 *   admin_label = @Translation("Homepage Search"),
 *   category = @Translation("Search Components"),
 * )
 * @phpcs:disable Drupal.Semantics.FunctionT.NotLiteralString
 */
final class HomepageSearchBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration(): array {
    return [
      'discoverUrl' => '',
      'searchAllUrl' => '',
      'learnMoreUrl' => '',
      'feedbackUrl' => '',
      'discoverTabLabel' => '',
      'searchAllTabLabel' => '',
      'discoverPlaceholder' => '',
      'searchAllPlaceholder' => '',
      'discoverDescription' => '',
      'searchAllDescription' => '',
      'quickActions' => '',
      'resourceLinks' => '',
      'imageUrl' => '',
      'imageAlt' => '',
      'imageCaption' => '',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function blockForm($form, FormStateInterface $form_state): array {
    $form['discoverUrl'] = [
      '#type' => 'textfield',
      '#title' => $this->t('UMD Discover base URL'),
      '#description' => $this->t('Absolute Primo URL including existing query params (e.g. https://example.com/search?vid=...). The component appends &query=any,contains,{value}.'),
      '#default_value' => $this->configuration['discoverUrl'],
      '#required' => TRUE,
    ];
    $form['searchAllUrl'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Search All page URL'),
      '#description' => $this->t('Absolute or relative URL of the internal search page. The component appends ?q={value}.'),
      '#default_value' => $this->configuration['searchAllUrl'],
      '#required' => TRUE,
    ];
    $form['learnMoreUrl'] = [
      '#type' => 'textfield',
      '#title' => $this->t('"Learn about search options" link URL'),
      '#default_value' => $this->configuration['learnMoreUrl'],
    ];
    $form['feedbackUrl'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Feedback form URL'),
      '#description' => $this->t('Leave empty to hide the footer feedback link.'),
      '#default_value' => $this->configuration['feedbackUrl'],
    ];
    $form['discoverTabLabel'] = [
      '#type' => 'textfield',
      '#title' => $this->t('UMD Discover tab label'),
      '#description' => $this->t('Leave empty to use the component default: "UMD Discover".'),
      '#default_value' => $this->configuration['discoverTabLabel'],
    ];
    $form['searchAllTabLabel'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Search All tab label'),
      '#description' => $this->t('Leave empty to use the component default: "Search All".'),
      '#default_value' => $this->configuration['searchAllTabLabel'],
    ];
    $form['discoverPlaceholder'] = [
      '#type' => 'textfield',
      '#title' => $this->t('UMD Discover input placeholder'),
      '#description' => $this->t('Leave empty to use the component default.'),
      '#default_value' => $this->configuration['discoverPlaceholder'],
    ];
    $form['searchAllPlaceholder'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Search All input placeholder'),
      '#description' => $this->t('Leave empty to use the component default.'),
      '#default_value' => $this->configuration['searchAllPlaceholder'],
    ];
    $form['discoverDescription'] = [
      '#type' => 'textfield',
      '#title' => $this->t('UMD Discover tab description'),
      '#description' => $this->t('Short description shown below the UMD Discover search form. Leave empty to use the component default.'),
      '#default_value' => $this->configuration['discoverDescription'],
    ];
    $form['searchAllDescription'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Search All tab description'),
      '#description' => $this->t('Short description shown below the Search All search form. Leave empty to use the component default.'),
      '#default_value' => $this->configuration['searchAllDescription'],
    ];
    $form['quickActions'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Quick Actions (JSON)'),
      '#description' => $this->t('JSON array of quick action links shown in the UMD Discover dropdown. Each item must have: label, boldText, url, id. Optional: labelAfter. Example: [{"label":"Search ","boldText":"Articles","labelAfter":" in UMD Discover","url":"https://...","id":"search-dropdown-articles"}]'),
      '#default_value' => $this->configuration['quickActions'],
    ];
    $form['resourceLinks'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Resource Links (JSON)'),
      '#description' => $this->t('JSON array of resource links shown in the footer resources section. Each item must have: label, url, id, cssClass. Example: [{"label":"UMD Discover","url":"https://...","id":"hero-umddiscover-link","cssClass":"umddiscover-searchmore"}]'),
      '#default_value' => $this->configuration['resourceLinks'],
    ];
    $form['imageUrl'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Hero image URL'),
      '#description' => $this->t('URL of the hero image. Leave empty to hide the image section.'),
      '#default_value' => $this->configuration['imageUrl'],
    ];
    $form['imageAlt'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Hero image alt text'),
      '#default_value' => $this->configuration['imageAlt'],
    ];
    $form['imageCaption'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Hero image caption'),
      '#description' => $this->t('Leave empty to hide the figcaption.'),
      '#default_value' => $this->configuration['imageCaption'],
    ];
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state): void {
    $this->configuration['discoverUrl'] = $form_state->getValue('discoverUrl');
    $this->configuration['searchAllUrl'] = $form_state->getValue('searchAllUrl');
    $this->configuration['learnMoreUrl'] = $form_state->getValue('learnMoreUrl');
    $this->configuration['feedbackUrl'] = $form_state->getValue('feedbackUrl');
    $this->configuration['discoverTabLabel'] = $form_state->getValue('discoverTabLabel');
    $this->configuration['searchAllTabLabel'] = $form_state->getValue('searchAllTabLabel');
    $this->configuration['discoverPlaceholder'] = $form_state->getValue('discoverPlaceholder');
    $this->configuration['searchAllPlaceholder'] = $form_state->getValue('searchAllPlaceholder');
    $this->configuration['discoverDescription'] = $form_state->getValue('discoverDescription');
    $this->configuration['searchAllDescription'] = $form_state->getValue('searchAllDescription');
    $this->configuration['quickActions'] = $form_state->getValue('quickActions');
    $this->configuration['resourceLinks'] = $form_state->getValue('resourceLinks');
    $this->configuration['imageUrl'] = $form_state->getValue('imageUrl');
    $this->configuration['imageAlt'] = $form_state->getValue('imageAlt');
    $this->configuration['imageCaption'] = $form_state->getValue('imageCaption');
  }

  /**
   * {@inheritdoc}
   */
  public function build(): array {
    $config = $this->configuration;
    $searchAttributes = new Attribute();

    // Required fields.
    if ($config['discoverUrl']) {
      $searchAttributes->setAttribute('discoverUrl', $config['discoverUrl']);
    }
    if ($config['searchAllUrl']) {
      $searchAttributes->setAttribute('searchAllUrl', $config['searchAllUrl']);
    }

    // Optional fields — only set if configured so the component uses its
    // own defaults when left empty.
    if ($config['learnMoreUrl']) {
      $searchAttributes->setAttribute('learnMoreUrl', $config['learnMoreUrl']);
    }
    if ($config['feedbackUrl']) {
      $searchAttributes->setAttribute('feedbackUrl', $config['feedbackUrl']);
    }
    if ($config['discoverTabLabel']) {
      $searchAttributes->setAttribute('discoverTabLabel', $this->t($config['discoverTabLabel'])->__toString());
    }
    if ($config['searchAllTabLabel']) {
      $searchAttributes->setAttribute('searchAllTabLabel', $this->t($config['searchAllTabLabel'])->__toString());
    }
    if ($config['discoverPlaceholder']) {
      $searchAttributes->setAttribute('discoverPlaceholder', $this->t($config['discoverPlaceholder'])->__toString());
    }
    if ($config['searchAllPlaceholder']) {
      $searchAttributes->setAttribute('searchAllPlaceholder', $this->t($config['searchAllPlaceholder'])->__toString());
    }
    if ($config['discoverDescription']) {
      $searchAttributes->setAttribute('discoverDescription', $this->t($config['discoverDescription'])->__toString());
    }
    if ($config['searchAllDescription']) {
      $searchAttributes->setAttribute('searchAllDescription', $this->t($config['searchAllDescription'])->__toString());
    }

    // JSON array attributes — passed as raw JSON strings; Lit parses them.
    if ($config['quickActions']) {
      $searchAttributes->setAttribute('quickActions', $config['quickActions']);
    }
    if ($config['resourceLinks']) {
      $searchAttributes->setAttribute('resourceLinks', $config['resourceLinks']);
    }

    // Hero image attributes.
    if ($config['imageUrl']) {
      $searchAttributes->setAttribute('imageUrl', $config['imageUrl']);
    }
    if ($config['imageAlt']) {
      $searchAttributes->setAttribute('imageAlt', $config['imageAlt']);
    }
    if ($config['imageCaption']) {
      $searchAttributes->setAttribute('imageCaption', $config['imageCaption']);
    }

    return [
      '#theme' => 'swc_homepage_search',
      '#search_attributes' => $searchAttributes,
      '#attached' => [
        'library' => [
          'search_web_components/components',
          'umdlib_umdds/umd-libraries-tabs',
        ],
      ],
    ];
  }

}
