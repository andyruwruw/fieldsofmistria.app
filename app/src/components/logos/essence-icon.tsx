// Packages
import type { ReactElement } from 'react';

/**
 * EssenceIcon component that displays a Icon for essence.
 *
 * @returns {ReactElement} The rendered EssenceIcon component.
 */
export function EssenceIcon({
  size = 24,
}: { size: number }): ReactElement {
  return (
    <img
      src='https://fieldsofmistria.wiki.gg/images/f/f5/Essence_drop.png?b82837'
      alt='essence drop'
      width={`${size}px`}
      height={`${size}px`} />
  );
}
