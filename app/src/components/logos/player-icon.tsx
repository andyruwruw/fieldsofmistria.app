// Packages
import type { ReactElement } from 'react';

/**
 * PlayerIcon component that displays a Icon for a player.
 *
 * @returns {ReactElement} The rendered PlayerIcon component.
 */
export function PlayerIcon({
  size = 24,
}: { size: number }): ReactElement {
  return (
    <img
      src='https://fieldsofmistria.wiki.gg/images/thumb/0/07/Fp_wiki_player.gif/30px-Fp_wiki_player.gif?63857e'
      alt='player Icon'
      width={`${size}px`}
      height={`${size}px`} />
  );
}
