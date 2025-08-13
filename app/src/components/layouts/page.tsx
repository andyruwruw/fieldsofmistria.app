// Packages
import type {
  ReactElement,
  ReactNode,
} from 'react';

/**
 * Props for the page layout component.
 */
export interface PageLayoutProps {
  /**
   * Children to render.
   */
  children?: ReactNode;
}

/**
 * Generic page layout component.
 */
export default function PageLayout({ children }: PageLayoutProps): ReactElement {
  return (
    <div className='mx-auto mt-4 w-full space-y-4'>
      { children && <>{ children }</> }
    </div>
  );
}
