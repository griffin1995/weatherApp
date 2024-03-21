// Enables strict usage of client-side imports ensuring Next.js optimizes for client-side only packages
'use client';

// React imports for managing state and side-effects
import React, { useEffect, useState } from 'react';
import Home from '../page';

// WeatherDashboard component definition
const WeatherDashboard: React.FC = () => {
	// State for managing the current location
	const [location, setLocation] = useState('');

	useEffect(() => {
		// Parsing location from URL parameters or using a default
		const params = new URLSearchParams(window.location.search);
		const LOCATION = params.get('name') || 'DefaultLocation';
		setLocation(LOCATION);
	}, []);

	// Main component render
	return location === '' ? <div>...Loading</div> : <Home city={location} />;
};

export default WeatherDashboard;
