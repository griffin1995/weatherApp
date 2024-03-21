import { useEffect, useState } from 'react';
import Link from 'next/link';

function History() {
	const [history, setHistory] = useState([]);
	useEffect(() => {
		const getDataFromLocalStorage = () => {
			const data = localStorage.getItem('history');
			if (data) {
				setHistory(JSON.parse(data));
			}
		};
		getDataFromLocalStorage();
	}, []);
	return (
		<div>
			<h2>History</h2>
			{history.map((item, index) => (
				<Link
					href={`/SearchResults?name=${item}`}
					style={{ padding: '5px', margin: '5px', cursor: 'pointer', border: '1px solid white', borderRadius: '5px' }}
					key={index}
				>
					{item}
				</Link>
			))}
		</div>
	);
}

export default History;
