import { combineNames } from "../../lib/utils";

/**
 * Props for the PercentageIndicator component.
 */
interface PercentageIndicatorProps {
  /**
   * The percentage to display in the indicator.
   */
	percentage: number;

  /**
   * Additional CSS classes to apply to the SVG element.
   */
	className: string;

	/**
	 * The color of the indicator.
	 */
	color?: string;

	/**
	 * Text to display inside the indicator.
	 */
	overrideText?: string;
}

/**
 * PercentageIndicator component that displays a circular progress indicator.
 * 
 * @param props The props for the PercentageIndicator component.
 * @param percentage The percentage to display in the indicator.
 * @param className Additional CSS classes to apply to the SVG element.
 * @returns The rendered SVG element.
 */
export const PercentageIndicator = ({
  percentage,
  className,
	color = '',
	overrideText = '',
}: PercentageIndicatorProps) => {
	let strokeColor;

	switch (color) {
		case 'red':
			strokeColor = 'stroke-red-500';
			break;
		case 'orange':
			strokeColor = 'stroke-orange-400';
			break;
		case 'blue':
			strokeColor = 'stroke-blue-500';
			break;
		case 'yellow':
			strokeColor = 'stroke-yellow-500';
			break;
		case 'green':
			strokeColor = 'stroke-green-600';
			break;
		case 'lime':
			strokeColor = 'stroke-lime-400';
			break;
		case 'cyan':
			strokeColor = 'stroke-cyan-500';
			break;
		case 'violet':
			strokeColor = 'stroke-violet-500';
			break;
		case 'rose':
			strokeColor = 'stroke-rose-500';
			break;
		default:
			strokeColor = 'stroke-emerald-500';
	}

	return (
		<svg
      viewBox='0 0 36 36'
      className={className}>
			<path
				className='block fill-none stroke-neutral-200 dark:stroke-neutral-800'
				strokeLinecap='round'
				strokeWidth='3'
				strokeDasharray='100, 100'
				d='M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831' />

			<path
				className={combineNames(
					'animate-progress fill-none',
					strokeColor,
				)}
				strokeLinecap='round'
				strokeWidth='3'
				strokeDasharray={`${percentage || 0}, 100`}
				d='M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831' />

			<text
				textAnchor='middle'
				x='18.5'
				y='21'
				className='-m-1 fill-neutral-600 text-[0.5em] font-semibold dark:fill-white/80'>
        { overrideText || `${percentage || 0}%` }
      </text>
		</svg>
	);
};
