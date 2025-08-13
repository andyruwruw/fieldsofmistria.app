// Packages
import type { ReactElement } from 'react';

/**
 * Home page component.
 */
export default function Home(): ReactElement {
  return (
    <div className='flex flex-col items-center justify-center h-screen w-screen text-center'>
      <div className='flex items-center mb-5'>
        <img
          src='https://fieldsofmistria.wiki.gg/images/c/cc/Season_icon_spring.png?1c93f3'
          alt='Fields of Mistria Logo'
          width='42px' />
        
        <h1 className='text-left page-title ml-4 mb-1 text-2xl font-semibold text-gray-900 dark:text-white'>
          fieldsofmistria.app
        </h1>
      </div>

      <p className='mb-4 text-gray-700 dark:text-gray-300 max-w-2xl'>
        Your aid for exploring the world of Fields of Mistria. Based off <a href="https://stardew.app/">stardew.app</a>, this site will give you a overview of your progression throughout the game. For more detailed information see <a href="https://fieldsofmistria.wiki.gg/">fieldsofmistria.wiki.gg</a>.
      </p>

      <p className='mb-4 text-gray-700 dark:text-gray-300 max-w-2xl'>
        Upload your save file to get started.
      </p>
    </div>
  );
}
