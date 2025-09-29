<?php

declare(strict_types=1);

namespace Drupal\search_web_components_block\Plugin\Block;

use Dom\Attr;
use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Provides a search component: share block.
 *
 * @Block(
 *   id = "swc_search_result_toolbar",
 *   admin_label = @Translation("Search Result Toolbar"),
 *   category = @Translation("Search Components"),
 * )
 * @phpcs:disable Drupal.Semantics.FunctionT.NotLiteralString
 */
final class SearchResultToolbar extends BlockBase {
    /**
     * {@inheritdoc}
     */
    public function defaultConfiguration(): array {
        return [];
    }

    /**
     * {@inheritdoc}
     */
    public function blockForm($form, FormStateInterface $form_state): array {
        return $form;
    }

    /**
     * {@inheritdoc}
     */
    public function blockSubmit($form, FormStateInterface $form_state): void {
    }

    /**
     * {@inheritdoc}
     */
    public function build(): array {
        return [
            '#theme' => 'swc_search_result_toolbar',
            '#attached' => [
                'library' => [
                'search_web_components/components',
                ],
            ],
        ];
    }
}
