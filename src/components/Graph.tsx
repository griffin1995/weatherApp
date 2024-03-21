// Enforces the use of client-side rendering and data fetching in Next.js
'use client';

// Importing the type definition for WeatherResponse
import { WeatherResponse } from '@/lib/types';
// React import for using React components
import React from 'react';
// Recharts components for creating bar charts
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// Interface for the props expected by the Graph component
interface GraphProps {
	data: WeatherResponse; // Expects data of type WeatherResponse
}

// Graph component for visualizing weather data
const Graph = ({ data }: GraphProps) => {
	return (
		<div style={{ width: '350px', height: '130px' }}>
			{/* Responsive container for the chart to ensure it adapts to different screen sizes */}
			<ResponsiveContainer className="flex items-center justify-center">
				{/* BarChart component to display temperature data over time */}
				<BarChart
					className="flex overflow-hidden"
					width={10}
					height={250}
					data={data.list.slice(1, 8).map((item) => {
						// Mapping and transforming the data for the chart, including temperature conversion from Kelvin to Celsius
						return {
							...item,
							main: {
								...item.main,
								temp: item.main.temp - 273, // Conversion from Kelvin to Celsius
							},
							dt_txt: item.dt_txt.slice(11, 16), // Formatting the date text to display only time
						};
					})}
				>
					{/* XAxis component to display time labels on the chart */}
					<XAxis
						stroke="white"
						strokeWidth={10}
						dataKey="dt_txt"
					/>
					{/* YAxis component to display temperature values on the chart */}
					<YAxis
						stroke="white"
						strokeWidth={2}
						type="number"
					/>
					{/* Tooltip component to show detailed information on hover */}
					<Tooltip />
					{/* Bar component to display temperature data as bars in the chart */}
					<Bar
						barSize={15}
						dataKey="main.temp"
						fill="white"
					/>
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
};

export default Graph;
