<?php

declare(strict_types=1);

namespace Drupal\search_web_components_block\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Template\Attribute;

/**
 * Provides a search component: search dialog toggle.
 *
 * @Block(
 *   id = "swc_search_dialog_toggle",
 *   admin_label = @Translation("Dialog Toggle"),
 *   category = @Translation("Search Components"),
 * )
 * @phpcs:disable Drupal.Semantics.FunctionT.NotLiteralString
 */
final class SearchDialogToggleBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration(): array {
    return [
      'aboveBreakpointText' => 'Filters',
      'dialogOpenText' => 'Filters',
      'dialogCloseText' => 'Close',
      'showAppliedCount' => FALSE,
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function blockForm($form, FormStateInterface $form_state): array {
    $form['aboveBreakpointText'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Above breakpoint text'),
      '#description' => $this->t('The text displayed when the screen is larger than the breakpoint and the toggle is inactive.'),
      '#default_value' => $this->configuration['aboveBreakpointText'],
    ];
    $form['dialogOpenText'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Open button text'),
      '#description' => $this->t('The text displayed when the dialog is closed.'),
      '#default_value' => $this->configuration['dialogOpenText'],
    ];
    $form['dialogCloseText'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Close button text'),
      '#description' => $this->t('The text displayed when the dialog is open.'),
      '#default_value' => $this->configuration['dialogCloseText'],
    ];
    $form['showAppliedCount'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Show applied count next to label'),
      '#default_value' => $this->configuration['showAppliedCount'],
    ];
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state): void {
    $this->configuration['aboveBreakpointText'] = $form_state->getValue('aboveBreakpointText');
    $this->configuration['dialogOpenText'] = $form_state->getValue('dialogOpenText');
    $this->configuration['dialogCloseText'] = $form_state->getValue('dialogCloseText');
    $this->configuration['showAppliedCount'] = $form_state->getValue('showAppliedCount');
  }

  /**
   * {@inheritdoc}
   */
  public function build(): array {
    $config = $this->configuration;

    $searchAttributes = new Attribute();

    if ($config['aboveBreakpointText']) {
      $searchAttributes->setAttribute('aboveBreakpointText', $this->t($config['aboveBreakpointText'])->__toString());
    }
    if ($config['dialogOpenText']) {
      $searchAttributes->setAttribute('dialogOpenText', $this->t($config['dialogOpenText'])->__toString());
    }
    if ($config['dialogCloseText']) {
      $searchAttributes->setAttribute('dialogCloseText', $this->t($config['dialogCloseText'])->__toString());
    }
    if ($config['showAppliedCount']) {
      $searchAttributes->setAttribute('showAppliedCount', TRUE);
    }

    return [
      '#theme' => 'swc_search_dialog_toggle',
      '#search_attributes' => $searchAttributes,
      '#attached' => [
        'library' => [
          'search_web_components/components',
        ],
      ],
    ];
  }

}
