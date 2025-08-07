<?php

declare(strict_types=1);

namespace Drupal\search_web_components_block\Plugin\Block;

use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Form\SubformStateInterface;

/**
 * Provides a search component: facet dropdown html.
 *
 * @Block(
 *   id = "swc_facet_dropdown_html",
 *   admin_label = @Translation("Facet: Dropdown HTML"),
 *   category = @Translation("Search Components"),
 * )
 * @phpcs:disable Drupal.Semantics.FunctionT.NotLiteralString
 */
final class FacetDropdownHtmlBlock extends FacetBlockBase {

  /**
   * {@inheritdoc}
   */
  public function supportedWidgets(): array {
    return [
      'swc_dropdown_html',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration(): array {
    return parent::defaultConfiguration() + [
      'required' => FALSE,
      'htmlSelectLabel' => '',
      'multipleSelect' => FALSE,
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
      $form['settings']['htmlSelectLabel'] = [
        '#type' => 'textfield',
        '#title' => $this->t('Select label'),
        '#description' => $this->t('The label text to display inside the select box.'),
        '#default_value' => $this->configuration['htmlSelectLabel'],
      ];
      $form['settings']['required'] = [
        '#type' => 'checkbox',
        '#title' => $this->t('Required'),
        '#description' => $this->t('When checked a user will have to choose a value for this field.'),
        '#default_value' => $this->configuration['required'],
      ];
      $form['settings']['multipleSelect'] = [
        '#type' => 'checkbox',
        '#title' => $this->t('Allow selecting multiple values'),
        '#default_value' => $this->configuration['multipleSelect'],
      ];
    }
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state): void {
    parent::blockSubmit($form, $form_state);
    $this->configuration['htmlSelectLabel'] = $form_state->getValue(['settings', 'htmlSelectLabel']);
    $this->configuration['required'] = $form_state->getValue(['settings', 'required']);
    $this->configuration['multipleSelect'] = $form_state->getValue(['settings', 'multipleSelect']);
  }

  /**
   * {@inheritdoc}
   */
  public function build(): array {
    $build = parent::build();

    $config = $this->configuration;
    /** @var \Drupal\Core\Template\Attribute $searchAttributes */
    $searchAttributes = $build['#search_attributes'];

    if ($config['htmlSelectLabel']) {
      $searchAttributes->setAttribute('htmlSelectLabel', $this->t($config['htmlSelectLabel'])->__toString());
    }
    if ($config['required']) {
      $searchAttributes->setAttribute('required', $config['required']);
    }
    if ($config['multipleSelect']) {
      $searchAttributes->setAttribute('multipleSelect', $config['multipleSelect']);
    }

    $build['#theme'] = 'swc_facet_dropdown_html';
    $build['#search_attributes'] = $searchAttributes;

    return $build;
  }

}
