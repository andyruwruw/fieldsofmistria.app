/* eslint-disable @typescript-eslint/no-explicit-any */
// Packages
import type { ReactNode } from 'react';

// Local Imports
import { combineNames } from '../../lib/utils';
import { NewItemBadge } from '../new-item-badge';

/**
 * Props for the InfoCard component.
 */
interface InfoCardProps {
	title: string;

	description?: string;

	Icon?: any;

	sourceURL?: string;

	children?: ReactNode;

	minVersion?: string;

	show?: boolean;
}

/**
 * InfoCard component that displays information in a card format.
 * It includes a title, description, optional icon, and source URL.
 * It can also display children components and a badge for new items.
 *
 * @param {InfoCardProps} props - The properties for the InfoCard component.
 * @param {string} props.title - The title of the card.
 * @param {string} [props.description] - The description of the card.
 * @param {any} [props.Icon] - The icon component to display in the card.
 * @param {string} [props.sourceURL] - The source URL for the card image.
 * @param {ReactNode} [props.children] - Optional children components to display inside the card.
 * @param {string} [props.minVersion] - Minimum version required to show the card.
 * @param {boolean} [props.show=true] - Whether to show the card or not.
 * @returns {ReactNode} The rendered InfoCard component.
 */
export const InfoCard = ({
	title,
	Icon,
	description,
	sourceURL,
	children,
	minVersion,
	show,
}: InfoCardProps): ReactNode => {
	return (
		<div
			className={combineNames('relative bg-white px-5 py-4 text-neutral-950 shadow-none dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50')}>
			{minVersion === '1.6.0' && (
				<NewItemBadge
					version={minVersion}
					position='inside' />
			)}

			<div
				className={combineNames(
					'flex items-center space-x-3 truncate rounded-lg border-none border-neutral-200',
					minVersion === '1.6.0' && !show && 'blur-sm',
				)}>
				{
          Icon && <Icon className='h-6 w-6 dark:text-white' />
        }

				{sourceURL && (
					<img
						src={sourceURL}
						alt={title}
						width={36}
						height={36}
						className='rounded-sm'/>
				)}

				<div className='min-w-0 flex-1'>
					<p
						className={
							'truncate text-sm text-left' +
							(description ? ' font-semibold' : ' font-medium')
						}>
						{title}
					</p>

					{description ? (
						<p className='truncate text-left text-sm text-neutral-500 dark:text-neutral-400'>
							{description}
						</p>
					) : null}

					{
            children && <div className='mt-1 '>
              {children}
            </div>
          }
				</div>
			</div>
		</div>
	);
};
