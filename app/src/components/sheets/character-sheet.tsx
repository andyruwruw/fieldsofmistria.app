// Packages
import {
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';

// Local Imports
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '../ui/sheet';

// Types
import type { Character } from '../../types/characters';

/**
 * Props for the CharacterSheet component.
 */
interface CharacterSheetProps {
  /**
   * Whether the sheet is open.
   */
	open: boolean;

  /**
   * Dispatch function to set the open state.
   */
	setIsOpen: Dispatch<SetStateAction<boolean>>;

  /**
   * The character to display in the sheet.
   */
	character: Character;
}

export const CharacterSheet = ({
  open,
  setIsOpen,
  character,
}: CharacterSheetProps) => {
  const [
    hearts,
    setHearts,
  ] = useState<string>('0');

  return (
    <Sheet
      open={open}
      onOpenChange={setIsOpen}>
      <SheetContent className='overflow-y-auto'>
        <SheetHeader className='mt-4'>
          <div className='flex justify-center'>
            <img
              src={character['spring-image']}
              alt={character.name}
              className='w-24 object-cover' />
          </div>

          <SheetTitle className='text-center'>
            {character.name}
          </SheetTitle>

          <SheetDescription className='text-center italic'>
            {character['birthday-season']} {character['birthday-day']}
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}
