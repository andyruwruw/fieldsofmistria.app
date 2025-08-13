/* eslint-disable @typescript-eslint/no-explicit-any */
// Packages
import {
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';

// Local Imports
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '../ui/sheet';

/**
 * Props for the ItemSheet component.
 */
interface ItemSheetProps {
  /**
   * Whether the sheet is open.
   */
	open: boolean;

  /**
   * Dispatch function to set the open state.
   */
	setIsOpen: Dispatch<SetStateAction<boolean>>;

  /**
   * The item to display in the sheet.
   */
	item: any | null;
}

export const ItemSheet = ({
  open,
  setIsOpen,
  item,
}: ItemSheetProps) => {
  const [
    image,
    setImage,
  ] = useState<string>('');
  const [
    name,
    setName,
  ] = useState<string>('');

  useEffect(() => {
    if (item) {
      setImage(item[Object.keys(item).filter(key => key.includes('image'))[0]] || '');
      setName(item[Object.keys(item).filter(key => key.includes('name'))[0]] || '');
    }
  }, [item]);

  return (
    <Sheet
      open={open && item}
      onOpenChange={setIsOpen}>
      <SheetContent className='overflow-y-auto'>
        <SheetHeader className='mt-4'>
          <div className='flex justify-center'>
            <img
              src={image}
              alt={name}
              className='w-24 object-cover' />
          </div>

          <SheetTitle className='text-center'>
            {name}
          </SheetTitle>

          {/* <SheetDescription className='text-center italic'>
            {character['birthday-season'][0].toUpperCase() + character['birthday-season'].slice(1)} {character['birthday-day']}
          </SheetDescription> */}
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}
