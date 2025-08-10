/* eslint-disable @typescript-eslint/no-explicit-any */
// Packages
import {
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';

// Local Imports
import { BooleanCard } from '../../../components/cards/boolean-card';

// Types
import type { MuseumDisplaySetItem } from '../../../types/museum';

/**
 * Props for the SetItemCard component.
 */
interface SetItemCardProps {
  /**
   * The museum display set item to display.
   */
	item: MuseumDisplaySetItem;
  
  /**
   * Set function to open the item.
   */
	setIsOpen: Dispatch<SetStateAction<boolean>>;

  /**
   * Set function to update the object.
   */
  setObject: Dispatch<SetStateAction<any | null>>;
}

/**
 * SetItemCard component for displaying a museum display set item.
 *
 * @param {SetItemCardProps} props The props for the component.
 * @returns The rendered component.
 */
export const SetItemCard = ({
	item,
	setIsOpen,
	setObject,
}: SetItemCardProps) => {
  const [
    done,
    setDone,
  ] = useState(false);

  useEffect(() => {
    setDone(item.done);
  }, [ item ]);

	return (
		<BooleanCard
      item={item}
      type='any'
      completed={done}
      setIsOpen={setIsOpen}
      setObject={setObject}
      show={true} />
	);
};
