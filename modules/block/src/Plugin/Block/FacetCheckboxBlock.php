<?php

declare(strict_types=1);

namespace Drupal\search_web_components_block\Plugin\Block;

use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Form\SubformStateInterface;

/**
 * Provides a search component: facet checkbox.
 *
 * @Block(
 *   id = "swc_facet_checkbox",
 *   admin_label = @Translation("Facet: Checkbox"),
 *   category = @Translation("Search Components"),
 * )
 */
final class FacetCheckboxBlock extends FacetBlockBase {

  /**
   * {@inheritdoc}
   */
  public function supportedWidgets(): array {
    return [
      'swc_checkbox',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration(): array {
    return parent::defaultConfiguration() + [
      'useRadios' => FALSE,
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
      $form['settings']['useRadios'] = [
        '#type' => 'checkbox',
        '#title' => $this->t('Use radio inputs'),
        '#default_value' => $this->configuration['useRadios'],
      ];
    }

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state): void {
    parent::blockSubmit($form, $form_state);
    $this->configuration['useRadios'] = $form_state->getValue(['settings', 'useRadios']);
  }

  /**
   * {@inheritdoc}
   */
  public function build(): array {
    $build = parent::build();

    $config = $this->configuration;
    /** @var \Drupal\Core\Template\Attribute $searchAttributes */
    $searchAttributes = $build['#search_attributes'];

    if ($config['useRadios']) {
      $searchAttributes->setAttribute('useRadios', $config['useRadios']);
    }

    $build['#theme'] = 'swc_facet_checkbox';
    $build['#search_attributes'] = $searchAttributes;

    return $build;
  }

}
