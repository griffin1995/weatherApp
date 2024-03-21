import React, { useState } from 'react';

import History from './History';

// Utility function for conditional class names, used here for consistency and scalability in styling
import { cn } from '@/lib/utils';

// Interface defining the props expected by the SearchBar component
interface SearchBarProps {
	onSearch: (location: string) => void; // Function to execute when a search is initiated
}

// SearchBar component for city searches
const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
	// State hook to manage the input field's value
	const [input, setInput] = useState('');

	// Function to handle search action, triggers the passed onSearch function with the input value
	const handleSearch = () => {
		if (input) {
			// Ensures the input is not empty before proceeding
			onSearch(input); // Calls the onSearch function with the input value
			setInput(''); // Resets the input field after search
		}
	};

	return (
		// Container for the search bar with applied styles
		<>
			<div className={cn('search-bar-container')}>
				{/* Input field for entering the search query */}
				<input
					style={{ color: 'black' }}
					type="text"
					placeholder="Search for a city" // Placeholder text for the input field
					value={input} // Controlled input value tied to the component's state
					onChange={(e) => setInput(e.target.value)} // Update state on input change
					className={cn('search-input')} // Class name applied for styling
				/>
				{/* Search button to trigger the search action */}
				<button
					onClick={handleSearch}
					className={cn('search-button')}
				>
					Search
				</button>
			</div>

			<History />
		</>
	);
};

export default SearchBar;
