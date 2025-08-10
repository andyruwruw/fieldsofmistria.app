/**
 * Props for the ItemWithOverlay component.
 */
export type ItemWithOverlayProps = {
	src: string;

	alt: string;

	className?: string;

	width?: number;

	height?: number;
};

/**
 * ItemWithOverlay component that displays an image with an overlay.
 *
 * @param props The props for the component.
 * @returns The rendered component.
 */
export default function ItemWithOverlay({
	src,
	alt,
	className,
	width,
	height,
}: ItemWithOverlayProps) {
	const targetWidth = width ? width : 32;
	const targetHeight = height ? height : 32;

	return (
		<div className='relative'>
			<img
				src={src}
				alt={alt}
				className={className ? 'rounded-sm' : className}
				width={targetWidth}
				height={targetHeight} />
		</div>
	);
}
