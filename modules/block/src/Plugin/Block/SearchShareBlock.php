<?php

declare(strict_types=1);

namespace Drupal\search_web_components_block\Plugin\Block;

use Dom\Attr;
use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Template\Attribute;

/**
 * Provides a search component: share block.
 *
 * @Block(
 *   id = "swc_search_share",
 *   admin_label = @Translation("Share"),
 *   category = @Translation("Search Components"),
 * )
 * @phpcs:disable Drupal.Semantics.FunctionT.NotLiteralString
 */
final class SearchShareBlock extends BlockBase {
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
            '#theme' => 'swc_search_share',
            '#search_attributes' => new Attribute(),
            '#attached' => [
                'library' => [
                'search_web_components/components',
                ],
            ],
        ];
    }
}
