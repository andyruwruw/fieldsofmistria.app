// Packages
import {
  IconBed,
  IconBook,
  IconBowlSpoon,
  IconBug,
  IconDog,
  IconFish,
  IconHammer,
  IconHeart,
  IconHome2,
  IconId,
  IconLeaf,
  IconMailOpened,
  IconPodium,
  IconSeedling,
  IconSparkles,
  IconStack2,
  type Icon,
  type IconProps,
} from '@tabler/icons-react';
import type {
  ForwardRefExoticComponent,
  ReactElement,
  RefAttributes,
} from 'react';
import {
  Link,
  useLocation,
} from 'react-router-dom';

// Local Imports
import { combineNames } from '../lib/utils';
import { Button } from './ui/button';

/**
 * SidebarCategory component that represents a category in the sidebar.
 *
 * @param props - The props for the component.
 * @returns The rendered component.
 */
export const SidebarCategory = ({ children }: { children: string }) => (
	<h2 className='mb-2 mt-4 px-4 font-bold tracking-tight text-left text-neutral-800 dark:text-neutral-300'>
		{children}
	</h2>
);

/**
 * SidebarNavigationItem interface that represents a navigation item in the sidebar.
 */
interface SidebarNavigationItem {
  /**
   * The name of the navigation item.
   */
  name: string;

  /**
   * The URL href of the navigation item.
   */
  href: string;

  /**
   * The icon component for the navigation item.
   */
  icon: ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>;
}

/**
 * PLAYER_NAVIGATION constant that contains the navigation items for the player section.
 */
const PLAYER_NAVIGATION: SidebarNavigationItem[] = [
	{
    name: 'Home',
    href: '/',
    icon: IconHome2,
  },
	{
    name: 'Player',
    href: '/player',
    icon: IconId,
  },
	{
    name: 'Quests',
    href: '/quests',
    icon: IconMailOpened,
  },
	{
    name: 'Relationships',
    href: '/relationships',
    icon: IconHeart,
  },
	{
    name: 'Animals',
    href: '/animals',
    icon: IconDog,
  },
	{
    name: 'Spells',
    href: '/spells',
    icon: IconSparkles,
  },
	{
    name: 'Skills',
    href: '/skills',
    icon: IconBook,
  },
];

/**
 * ALMANAC_NAVIGATION constant that contains the navigation items for the almanac section.
 */
const ALMANAC_NAVIGATION: SidebarNavigationItem[] = [
	{
    name: 'Artifacts',
    href: '/artifacts',
    icon: IconPodium,
  },
	{
    name: 'Blacksmithing',
    href: '/blacksmithing',
    icon: IconHammer,
  },
	{
    name: 'Bugs',
    href: '/bugs',
    icon: IconBug,
  },
	{
    name: 'Cooked Dishes',
    href: '/cooked-dishes',
    icon: IconBowlSpoon,
  },
	{
    name: 'Crops',
    href: '/crops',
    icon: IconSeedling,
  },
  {
    name: 'Date Inspiration',
    href: '/date-inspiration',
    icon: IconHeart,
  },
  {
    name: 'Fishing & Diving',
    href: '/fishing-and-diving',
    icon: IconFish,
  },
  {
    name: 'Forageables',
    href: '/forageables',
    icon: IconLeaf,
  },
  {
    name: 'Furniture',
    href: '/furniture',
    icon: IconBed,
  },
  {
    name: 'Materials',
    href: '/materials',
    icon: IconStack2,
  },
  {
    name: 'Ranching',
    href: '/ranching',
    icon: IconDog,
  },
];

/**
 * Sidebar component that represents the sidebar.
 *
 * @returns The rendered Sidebar component.
 */
export function Sidebar({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const location = useLocation();

  return (
    <>
      <div className={combineNames(
        'sidebar',
        className,
      )}>
        <div className='grid w-72 grid-cols-3 gap-2 px-3 pt-4'>
        </div>

        <nav className='px-3 pb-2'>
          <SidebarCategory>
            Player
          </SidebarCategory>

          <div className='space-y-1'>
            {PLAYER_NAVIGATION.map((item: SidebarNavigationItem): ReactElement => (
              <Button
                key={item.href}
                variant={location.pathname === item.href ? 'secondary' : 'ghost'}
                className={combineNames(
                  'w-full justify-start',
                  item.href === location.pathname
                    ? ''
                    : 'text-neutral-600 dark:text-neutral-400',
                )}
                asChild>
                <Link to={item.href}>
                  {item.icon && (
                    <item.icon
                      className='mr-2 h-4 w-4'
                      aria-hidden='true' />
                  )}
                  {item.name}
                </Link>
              </Button>
            ))}
          </div>

          <SidebarCategory>
            Almanac
          </SidebarCategory>

          <div className='space-y-1'>
            {ALMANAC_NAVIGATION.map((item: SidebarNavigationItem): ReactElement => (
              <Button
                key={item.href}
                variant={location.pathname === item.href ? 'secondary' : 'ghost'}
                className={combineNames(
                  'w-full justify-start',
                  item.href === location.pathname
                    ? ''
                    : 'text-neutral-600 dark:text-neutral-400',
                )}
                asChild>
                <Link to={item.href}>
                  {item.icon && (
                    <item.icon
                      className='mr-2 h-4 w-4'
                      aria-hidden='true' />
                  )}
                  {item.name}
                </Link>
              </Button>
            ))}
          </div>
        </nav>
      </div>
    </>
  )
}