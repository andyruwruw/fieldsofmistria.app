// Packages
import { useContext } from 'react';
import { toast } from 'sonner';
import Dropzone from 'react-dropzone';

// Local Imports
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { PlayersContext } from '../../contexts/player';

interface UploadSaveDialogProps {
	open: boolean;

	setOpen: (open: boolean) => void;
}

export const UploadSaveDialog = ({
  open,
  setOpen,
}: UploadSaveDialogProps) => {
	const { unpackSave } = useContext(PlayersContext);

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
                  
									<div className='h-[250px]'>
										<div
											{...getRootProps()}
											className='flex h-full w-full cursor-pointer select-none items-center justify-center rounded-lg border-2 border-dashed border-gray-800 dark:border-gray-400'>
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
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
}
