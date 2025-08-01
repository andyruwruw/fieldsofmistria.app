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
}: PercentageIndicatorProps) => {
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
				className='animate-progress fill-none stroke-emerald-500'
				strokeLinecap='round'
				strokeWidth='3'
				strokeDasharray={`${percentage}, 100`}
				d='M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831' />

			<text
				textAnchor='middle'
				x='18.5'
				y='21'
				className='-m-1 fill-neutral-600 text-[0.5em] font-semibold dark:fill-white/80'>
        {`${percentage}%`}
      </text>
		</svg>
	);
};
