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
import { resolveItem } from '../../../lib/utils';

/**
 * Props for the SetListAccordionItem component.
 */
interface SetListAccordionItemProps {
  /**
   * The museum display set item to display.
   */
	id: string;

  /**
   * Override completeness.
   */
  overrideComplete?: boolean;

  /**
   * Map of completed items.
   */
  completedItems?: Record<string, boolean>;
  
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
 * SetListAccordionItem component for displaying a museum display set item.
 *
 * @param {SetListAccordionItemProps} props The props for the component.
 * @returns The rendered component.
 */
export const SetListAccordionItem = ({
	id,
  overrideComplete,
	completedItems,
	setIsOpen,
	setObject,
}: SetListAccordionItemProps) => {
  const [
    done,
    setDone,
  ] = useState(false);
  const [
    item,
    setItem,
  ] = useState({} as any);

  useEffect(() => {
    setDone((overrideComplete || completedItems?.[id]) ?? false);
  }, [
    id,
    completedItems,
    overrideComplete,
  ]);

  useEffect(() => {
    setItem(resolveItem(id));
  }, [ id ]);

	return (
    <>
      {
        Object.keys(item).length && <BooleanCard
          item={item}
          type='any'
          completed={done}
          setIsOpen={setIsOpen}
          setObject={setObject}
          show={true} />
      }
    </>
	);
};
