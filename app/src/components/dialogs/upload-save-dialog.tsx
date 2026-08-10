// Packages
import { useContext, useState } from 'react';
import { toast } from 'sonner';
import Dropzone from 'react-dropzone';
import { CopyIcon } from '@radix-ui/react-icons';

// Local Imports
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Card } from '../ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../ui/tabs';
import { PlayersContext } from '../../contexts/player';

type SavePlatform = 'windows' | 'steam-deck-linux' | 'mac';

interface SavePlatformInfo {
	id: SavePlatform;

	label: string;

	path: string;

	hint?: string;
}

const SAVE_PLATFORMS: SavePlatformInfo[] = [
  {
    id: 'windows',
    label: 'Windows',
    path: '%localappdata%\\FieldsOfMistria\\saves',
    hint: 'Press Win+R, paste the path, hit Enter.',
  },
  {
    id: 'steam-deck-linux',
    label: 'Steam Deck / Linux',
    path: '~/.local/share/FieldsOfMistria/saves/',
  },
  {
    id: 'mac',
    label: 'Mac',
    path: '~/Library/Application Support/FieldsOfMistria/saves',
    hint: 'Unconfirmed. If it\'s not there, search Spotlight for .sav.',
  },
];

/**
 * Guess the user's platform from the browser so the right tab is
 * highlighted by default.
 *
 * @returns {SavePlatform} The detected platform.
 */
const detectPlatform = (): SavePlatform => {
	const uaData = (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData;
	const platform = uaData?.platform ?? navigator.platform ?? navigator.userAgent;

	if (/mac/i.test(platform)) {
		return 'mac';
	}

	if (/linux|cros/i.test(platform)) {
		return 'steam-deck-linux';
	}

	return 'windows';
};

interface UploadSaveDialogProps {
	open: boolean;

	setOpen: (open: boolean) => void;
}

export const UploadSaveDialog = ({
  open,
  setOpen,
}: UploadSaveDialogProps) => {
	const { unpackSave } = useContext(PlayersContext);
	const [platform, setPlatform] = useState<SavePlatform>(detectPlatform);

	const activePlatform = SAVE_PLATFORMS.find(({ id }) => id === platform) ?? SAVE_PLATFORMS[0];

  /**
   * Handle file change event.
	 *
   * @param {File} file The uploaded file.
   * @returns {void}
   */
  const handleChange = async (file: File) => {
		setOpen(false);

		if (!file) {
      return;
    }

		if (file.type !== '') {
			toast.error('Invalid file type', {
				description: 'Please upload a Fields of Mistria save file.',
			});
			return;
		}

    const unpackPromise = unpackSave(file);

    toast.promise(unpackPromise, {
      loading: 'Uploading your save file...',
      success: () => 'Successfully processed your save file!',
      error: (err) => `There was an error parsing your save file:\n${err}`,
    });

		await unpackPromise;
	};

  /**
   * Copy the active platform's save path to the clipboard, so it can be
   * pasted into the file picker's address bar to jump there directly.
   *
   * @returns {Promise<void>}
   */
  const handleCopyPath = async () => {
		await navigator.clipboard.writeText(activePlatform.path);
		toast.success('Path copied', {
			description: 'Paste it into the file picker\'s address bar to jump there.',
		});
	};

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
              Upload your save file
            </DialogTitle>
					</DialogHeader>

					<DialogDescription asChild>
            <div className='flex flex-col gap-3'>
              <Tabs
                value={platform}
                onValueChange={(value) => setPlatform(value as SavePlatform)}>
                <Card className='flex-col items-stretch gap-2 p-3'>
                  <TabsList className='grid w-full grid-cols-3'>
                    {SAVE_PLATFORMS.map(({ id, label }) => (
                      <TabsTrigger key={id} value={id}>
                        {label}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {SAVE_PLATFORMS.map(({ id, path, hint }) => (
                    <TabsContent key={id} value={id} className='mt-0 text-sm text-foreground-muted'>
                      <p>
                        Save files end in <code className='rounded bg-muted px-1 py-0.5 font-mono text-xs'>.sav</code> and live in:
                      </p>

                      <div className='mt-2 flex items-center gap-2'>
                        <code className='flex-1 truncate rounded bg-muted px-1.5 py-1 font-mono text-xs'>
                          {path}
                        </code>

                        <button
                          type='button'
                          onClick={handleCopyPath}
                          className='shrink-0 rounded p-1 text-foreground-subtle hover:bg-muted hover:text-foreground'
                          aria-label='Copy path'>
                          <CopyIcon />
                        </button>
                      </div>

                      {hint && (
                        <p className='mt-1 text-xs text-foreground-subtle'>
                          {hint}
                        </p>
                      )}
                    </TabsContent>
                  ))}
                </Card>
              </Tabs>

              <Dropzone
								onDrop={(acceptedFiles: File[]) => {
									handleChange(acceptedFiles[0]);
								}}
								useFsAccessApi={false}>
								{({ getRootProps, getInputProps }) => (
									<>
										<input
                      className='h-full w-full'
                      {...getInputProps()} />

										<div className='h-[180px]'>
											<div
												{...getRootProps()}
												className='flex h-full w-full cursor-pointer select-none items-center justify-center rounded-lg border-2 border-dashed border-border'>
												<div className='select-text text-center'>
													<span>
														Drag and drop your save file here, or click to browse!
													</span>
												</div>
											</div>
										</div>
									</>
								)}
							</Dropzone>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
}
