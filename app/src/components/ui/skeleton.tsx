// Packages
import type { ReactElement } from 'react';

// Local Imports
import { combineNames } from '../../lib/utils';

/**
 * Skeleton component that provides a loading placeholder.
 * @param {React.HTMLAttributes<HTMLDivElement>} props - Props for the skeleton component.
 * @returns A div element with skeleton styles.
 */
const Skeleton = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>): ReactElement => (
  <div
    className={combineNames(
      "animate-pulse rounded-md bg-neutral-900/10 dark:bg-neutral-50/10",
      className,
    )}
    {...props} />
)

export { Skeleton };
