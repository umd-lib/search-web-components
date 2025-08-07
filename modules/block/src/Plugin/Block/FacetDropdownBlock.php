<?php

declare(strict_types=1);

namespace Drupal\search_web_components_block\Plugin\Block;

use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Form\SubformStateInterface;

/**
 * Provides a search component: facet dropdown.
 *
 * @Block(
 *   id = "swc_facet_dropdown",
 *   admin_label = @Translation("Facet: Dropdown"),
 *   category = @Translation("Search Components"),
 * )
 * @phpcs:disable Drupal.Semantics.FunctionT.NotLiteralString
 */
final class FacetDropdownBlock extends FacetBlockBase {

  /**
   * {@inheritdoc}
   */
  public function supportedWidgets(): array {
    return [
      'swc_dropdown',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration(): array {
    return parent::defaultConfiguration() + [
      'selectLabel' => 'Choose an option',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function blockForm($form, FormStateInterface $form_state): array {
    $form = parent::blockForm($form, $form_state);

    $complete_form_state = $form_state instanceof SubformStateInterface ? $form_state->getCompleteFormState() : $form_state;
    $endpointId = $complete_form_state->getValue(['settings', 'endpoint'], $this->configuration['endpoint'] ?? '');
    if ($endpointId === 'manual_entry') {
      $form['settings']['selectLabel'] = [
        '#type' => 'textfield',
        '#title' => $this->t('Select label'),
        '#description' => $this->t('The label text to display inside the select box.'),
        '#default_value' => $this->configuration['selectLabel'],
      ];
    }

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state): void {
    parent::blockSubmit($form, $form_state);
    $this->configuration['selectLabel'] = $form_state->getValue(['settings', 'selectLabel']);
  }

  /**
   * {@inheritdoc}
   */
  public function build(): array {
    $build = parent::build();

    $config = $this->configuration;
    /** @var \Drupal\Core\Template\Attribute $searchAttributes */
    $searchAttributes = $build['#search_attributes'];

    if ($config['selectLabel']) {
      $searchAttributes->setAttribute('selectLabel', $this->t($config['selectLabel'])->__toString());
    }

    $build['#theme'] = 'swc_facet_dropdown';
    $build['#search_attributes'] = $searchAttributes;

    return $build;
  }

}
