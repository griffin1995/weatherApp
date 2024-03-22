// All the interfcaes below represent the parts which make us the JSON response 
// from the weather api

interface Coord {
    lon: number;
    lat: number;
}

interface Weather {
    id: number;
    main: string;
    description: string;
    icon: string;
}

interface Main {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level: number;
    grnd_level: number;
}

interface Wind {
    speed: number;
    deg: number;
    gust: number;
}

interface Clouds {
    all: number;
}

interface Sys {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
}

interface WeatherResponse {
    coord: Coord;
    weather: Weather[];
    base: string;
    main: Main;
    visibility: number;
    wind: Wind;
    clouds: Clouds;
    dt: number;
    sys: Sys;
    timezone: number;
    id: number;
    name: string;
    cod: number;
}

interface ForecastListItem {
    dt: number;
    main: Main; // Reusing the Main interface defined earlier
    weather: Weather[]; // Reusing the Weather interface defined earlier
    clouds: Clouds; // Reusing the Clouds interface defined earlier
    wind: Wind; // Reusing the Wind interface defined earlier
    visibility: number;
    pop: number;
    rain?: {
        '3h': number;
    };
    sys: {
        pod: string;
    };
    dt_txt: string;
}

interface ForecastResponse {
    cod: string;
    message: number;
    cnt: number;
    list: ForecastListItem[];
    city: {
        id: number;
        name: string;
        coord: Coord; // Reusing the Coord interface defined earlier
        country: string;
        population: number;
        timezone: number;
        sunrise: number;
        sunset: number;
    };
}

