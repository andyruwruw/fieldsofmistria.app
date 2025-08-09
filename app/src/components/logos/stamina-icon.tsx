// Packages
import type { ReactElement } from 'react';

/**
 * StaminaIcon component that displays a Icon for stamina.
 *
 * @returns {ReactElement} The rendered StaminaIcon component.
 */
export function StaminaIcon({
  size = 24,
}: { size: number }): ReactElement {
  return (
    <img
      src='https://fieldsofmistria.wiki.gg/images/4/4e/Stamina_bar_icon_good.png?f79558&20240731233202'
      alt='stamina'
      width={`${size}px`}
      height={`${size}px`} />
  );
}
