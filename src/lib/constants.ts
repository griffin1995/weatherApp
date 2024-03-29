export const getWeather = (location: string) => {return `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=65ad34ef51cc68f1567d459fc99efa63`}

export const getForecast = (location: string) => {return `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=65ad34ef51cc68f1567d459fc99efa63`}

export const getWeatherByLngLat = (lng: number, lat: number) => {return `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=65ad34ef51cc68f1567d459fc99efa63`}

// any updates here are reflected in the navbar, programatically made into navbar links
export const NAV_URLS = [
    {
        title: "Home",
        href: "/london"
    },
    {
        title: "Map",
        href: "/map",
    },
    {
        title: "Journey History",
        href: "/journey-history"
    },
]