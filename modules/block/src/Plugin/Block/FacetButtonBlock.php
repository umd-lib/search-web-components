<?php

declare(strict_types=1);

namespace Drupal\search_web_components_block\Plugin\Block;

/**
 * Provides a search component: facet button.
 *
 * @Block(
 *   id = "swc_facet_button",
 *   admin_label = @Translation("Facet: Button"),
 *   category = @Translation("Search Components"),
 * )
 */
final class FacetButtonBlock extends FacetBlockBase {

  /**
   * {@inheritdoc}
   */
  public function supportedWidgets(): array {
    return [
      'swc_button',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function build(): array {
    $build = parent::build();
    $build['#theme'] = 'swc_facet_button';

    return $build;
  }

}
