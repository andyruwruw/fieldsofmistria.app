// Types
import { createContext } from 'react';

export interface MultiSelectContextType {
	isMultiSelectMode: boolean;
	toggleMultiSelectMode: () => void;
	selectedItems: Set<string>;
	toggleItem: (id: string) => void;
	clearSelection: () => void;
	addItems: (ids: string[]) => void;
	removeItems: (ids: string[]) => void;
}

export const MultiSelectContext = createContext<MultiSelectContextType | undefined>(
	undefined,
);
