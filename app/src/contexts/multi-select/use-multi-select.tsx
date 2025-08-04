// Packages
import { useContext } from 'react';

// Local Imports
import { MultiSelectContext } from '.';

export const useMultiSelect = () => {
	const context = useContext(MultiSelectContext);

	if (context === undefined) {
		throw new Error('useMultiSelect must be used within a MultiSelectProvider');
	}
	return context;
}
