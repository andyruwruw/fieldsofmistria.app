// Packages
import {
  useState,
  type ReactNode,
} from 'react';

// Local Imports
import { MultiSelectContext } from '.';

export const MultiSelectProvider = ({ children }: { children: ReactNode }) => {
	const [
    isMultiSelectMode,
    setIsMultiSelectMode,
  ] = useState(false);
	const [
    selectedItems,
    setSelectedItems,
  ] = useState<Set<string>>(new Set());

	const toggleMultiSelectMode = () => {
		setIsMultiSelectMode(!isMultiSelectMode);
		if (isMultiSelectMode) {
			clearSelection();
		}
	};

	const toggleItem = (id: string) => {
		setSelectedItems((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(id)) {
				newSet.delete(id);
			} else {
				newSet.add(id);
			}
			return newSet;
		});
	};

	const clearSelection = () => {
		setSelectedItems(new Set());
	};

	const addItems = (ids: string[]) => {
		setSelectedItems((prev) => {
			const newSet = new Set(prev);
			ids.forEach((id) => newSet.add(id));
			return newSet;
		});
	};

	const removeItems = (ids: string[]) => {
		setSelectedItems((prev) => {
			const newSet = new Set(prev);
			ids.forEach((id) => newSet.delete(id));
			return newSet;
		});
	};

	return (
		<MultiSelectContext.Provider
			value={{
				isMultiSelectMode,
				toggleMultiSelectMode,
				selectedItems,
				toggleItem,
				clearSelection,
				addItems,
				removeItems,
			}}>
			{children}
		</MultiSelectContext.Provider>
	);
}
