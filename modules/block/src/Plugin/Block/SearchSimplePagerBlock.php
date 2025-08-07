<?php

declare(strict_types=1);

namespace Drupal\search_web_components_block\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Template\Attribute;

/**
 * Provides a search component: simple pager block.
 *
 * @Block(
 *   id = "swc_search_simple_pager",
 *   admin_label = @Translation("Simple Pager"),
 *   category = @Translation("Search Components"),
 * )
 * @phpcs:disable Drupal.Semantics.FunctionT.NotLiteralString
 */
final class SearchSimplePagerBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration(): array {
    return [
      'prevLabel' => '<',
      'nextLabel' => '>',
      'firstLabel' => 'First',
      'lastLabel' => 'Last',
      'showNextPrev' => TRUE,
      'showFirstLast' => FALSE,
      'pagesToDisplay' => 0,
      'firstLastPagesToDisplay' => 0,
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function blockForm($form, FormStateInterface $form_state): array {
    $form['pagesToDisplay'] = [
      '#type' => 'number',
      '#min' => 0,
      '#title' => $this->t('Pages to display on either side of current page'),
      '#default_value' => $this->configuration['pagesToDisplay'],
    ];
    $form['firstLastPagesToDisplay'] = [
      '#type' => 'number',
      '#min' => 0,
      '#title' => $this->t('Pages to display to the left/right of the first/last page'),
      '#default_value' => $this->configuration['firstLastPagesToDisplay'],
    ];
    $form['showNextPrev'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Show next/prev buttons'),
      '#default_value' => $this->configuration['showNextPrev'],
    ];
    $form['prevLabel'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Previous page label text'),
      '#default_value' => $this->configuration['prevLabel'],
    ];
    $form['nextLabel'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Next page label text'),
      '#default_value' => $this->configuration['nextLabel'],
    ];
    $form['showFirstLast'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Show first/last buttons'),
      '#default_value' => $this->configuration['showFirstLast'],
    ];
    $form['firstLabel'] = [
      '#type' => 'textfield',
      '#title' => $this->t('First page label text'),
      '#default_value' => $this->configuration['firstLabel'],
    ];
    $form['lastLabel'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Last page label text'),
      '#default_value' => $this->configuration['lastLabel'],
    ];
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state): void {
    $this->configuration['pagesToDisplay'] = $form_state->getValue('pagesToDisplay');
    $this->configuration['firstLastPagesToDisplay'] = $form_state->getValue('firstLastPagesToDisplay');
    $this->configuration['showNextPrev'] = $form_state->getValue('showNextPrev');
    $this->configuration['prevLabel'] = $form_state->getValue('prevLabel');
    $this->configuration['nextLabel'] = $form_state->getValue('nextLabel');
    $this->configuration['showFirstLast'] = $form_state->getValue('showFirstLast');
    $this->configuration['firstLabel'] = $form_state->getValue('firstLabel');
    $this->configuration['lastLabel'] = $form_state->getValue('lastLabel');
  }

  /**
   * {@inheritdoc}
   */
  public function build(): array {
    $config = $this->configuration;
    $searchAttributes = new Attribute();

    if ($config['pagesToDisplay']) {
      $searchAttributes->setAttribute('pagesToDisplay', $config['pagesToDisplay']);
    }
    if ($config['firstLastPagesToDisplay']) {
      $searchAttributes->setAttribute('firstLastPagesToDisplay', $config['firstLastPagesToDisplay']);
    }
    if ($config['showNextPrev']) {
      $searchAttributes->setAttribute('showNextPrev', $config['showNextPrev']);
    }
    if ($config['prevLabel']) {
      $searchAttributes->setAttribute('prevLabel', $this->t($config['prevLabel'])->__toString());
    }
    if ($config['nextLabel']) {
      $searchAttributes->setAttribute('nextLabel', $this->t($config['nextLabel'])->__toString());
    }
    if ($config['showFirstLast']) {
      $searchAttributes->setAttribute('showFirstLast', $config['showFirstLast']);
    }
    if ($config['firstLabel']) {
      $searchAttributes->setAttribute('firstLabel', $this->t($config['firstLabel'])->__toString());
    }
    if ($config['lastLabel']) {
      $searchAttributes->setAttribute('lastLabel', $this->t($config['lastLabel'])->__toString());
    }

    return [
      '#theme' => 'swc_search_simple_pager',
      '#search_attributes' => $searchAttributes,
      '#attached' => [
        'library' => [
          'search_web_components/components',
        ],
      ],
    ];
  }

}
