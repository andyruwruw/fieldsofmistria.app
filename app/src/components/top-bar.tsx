// Packages
import { useContext, useState } from 'react';
import { Link } from 'react-router';

// Local Imports
import { UploadSaveDialog } from './dialogs/upload-save-dialog';
import { Button } from './ui/button';
import { PlayersContext } from '../contexts/player';

/**
 * Topbar component for the application.
 */
export function Topbar() {
  const { player } = useContext(PlayersContext);

	const [
    uploadOpen,
    setUploadOpen,
  ] = useState(false);

  return (
    <>
      <div className='top-bar flex items-center justify-between bg-white px-7 py-3.5 dark:bg-neutral-950 sm:flex-row sm:items-center sm:space-y-0 md:h-16'>
        <Link to='/'>
          <div className='flex flex-shrink-0 items-center'>
            <img
              src='https://fieldsofmistria.wiki.gg/images/c/cc/Season_icon_spring.png?1c93f3'
              alt='Spring Icon'
              className='h-8 w-8' />

            <h1 className='pl-3 font-medium'>
              fieldsofmistria.app
            </h1>
          </div>
        </Link>

        <div className='ml-auto hidden w-full space-x-2 sm:justify-end md:flex'>
          <Button
						variant="secondary"
						onClick={() => setUploadOpen(true)}
						data-umami-event="Upload save"
						className="hover:bg-green-500 hover:text-neutral-50 dark:hover:bg-green-500 dark:hover:text-neutral-50">
						Upload Save
					</Button>

          {
            player?.name && (
              <Button
                variant="ghost"
                onClick={() => setUploadOpen(true)}
                data-umami-event="Upload save"
                className="hover:bg-green-500 hover:text-neutral-50 dark:hover:bg-green-500 dark:hover:text-neutral-50">
                { player.name || 'Player' }
              </Button>
            )
          }
        </div>
      </div>

      <UploadSaveDialog
        open={uploadOpen}
        setOpen={setUploadOpen} />
    </>
  );
}