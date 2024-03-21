"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
  DirectionsRenderer,
  Autocomplete as GoogleMapsAutocomplete,
} from "@react-google-maps/api";
import Distance from "./distance";
import "./styling.css";

type MapOptions = google.maps.MapOptions;
  
// API key for OpenWeatherMap API
const apiKey = "";
const GOOGLE_MAPS_API_KEY =  "";
const mapContainerStyle = {
  width: "125%",
  height: "600px",
  zIndex: 1, 
};

//centers the map when loaded
const center = {
  lat: 51.5072,
  lng: 0.1276,
};

function Intro() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [directions, setDirections] = useState<google.maps.DirectionsResult | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<google.maps.LatLng | null>(null);
  const [weatherData, setWeatherData] = useState(null);
  const [weatherDataOrigin, setWeatherDataOrigin] = useState(null);
  const [weatherDataDestination, setWeatherDataDestination] = useState(null);
  const [infoVisible, setInfoVisible] = useState(false);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY, // Replace with your Google Maps API key
    libraries: ["places"],
  });

  const options = useMemo<MapOptions>(
    () => ({
      mapId: "cf759b347450a970",
      // Disable map and satellite options
      mapTypeControl: false, 
      
    }),
    []
  );
  


  useEffect(() => {
    if (origin && destination) {
      setInfoVisible(true);
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: origin,
          destination: destination,
          travelMode: google.maps.TravelMode.BICYCLING,
        },
        (result, status) => {
          if (status === "OK" && result) {
            setDirections(result);
          }
        }
      );
      
    }
 
// Fetch weather data for origin
if (isLoaded && origin) {
  // Use Geocoding API to get latitude and longitude for the origin
  fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${origin}&key=GOOGLE_MAPS_API_KEY`)
    .then((response) => response.json())
    .then((data) => {
      const { lat, lng } = data.results[0].geometry.location;
      // Fetch weather data using latitude and longitude
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=apiKey`)
        .then((response) => response.json())
        .then((weatherData) => setWeatherDataOrigin(weatherData))
        .catch((error) => console.error("Error fetching weather data for origin:", error));
    })
    .catch((error) => console.error("Error fetching coordinates for origin:", error));
}
// Fetch weather data for destination
if (isLoaded && destination) {
  // Use Geocoding API to get latitude and longitude for the destination
  fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${destination}&key=GOOGLE_MAPS_API_KEY`)
    .then((response) => response.json())
    .then((data) => {
      const { lat, lng } = data.results[0].geometry.location;
      // Fetch weather data using latitude and longitude
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=apiKey`)
        .then((response) => response.json())
        .then((weatherData) => setWeatherDataDestination(weatherData))
        .catch((error) => console.error("Error fetching weather data for destination:", error));
    })
    .catch((error) => console.error("Error fetching coordinates for destination:", error));
}

  }, [isLoaded, origin, destination]);

  useEffect(() => {
    if (isLoaded && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
        },
        (error) => {
          console.log("Error getting location: ", error);
        }
      );
    } else {
      console.log("Geolocation not supported");
    }
  
    // Fetch current location weather data
    if (isLoaded && currentLocation) {
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${currentLocation.lat()}&lon=${currentLocation.lng()}&appid=apiKey`)
        .then((response) => response.json())
        .then((data) => setWeatherData(data));
        
    }
  }, [isLoaded, currentLocation]);

  if (loadError) return <div>Error loading Google Maps API</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="container">
      <div className="search">
        <GoogleMapsAutocomplete>
          <input
            type="text"
            placeholder="Origin"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
          />
        </GoogleMapsAutocomplete>
        <GoogleMapsAutocomplete>
          <input
            type="text"
            placeholder="Destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </GoogleMapsAutocomplete>
        <button
          id="clear"
          onClick={() => {
            setOrigin("");
            setDestination("");
            setDirections(undefined);
          }}
        >
          Clear
        </button>
      </div>
      <div className="controls">
      
        <div className="info" style={{ display: infoVisible ? "block" : "none" }}>
        <h1>Route</h1>
          <div className="distance">
      {weatherDataOrigin && weatherDataOrigin.main && (
          <div>
            <p>Origin Weather:</p>
            <p>Temperature: {weatherDataOrigin.main.temp}°C</p>
            <p>Weather: {weatherDataOrigin.weather[0].description}</p>
          </div>
          )}
          {weatherDataDestination && weatherDataDestination.main &&(
          <div>
            <p>Destination Weather:</p>
            <p>Temperature: {weatherDataDestination.main.temp}°C</p>
            <p>Weather: {weatherDataDestination.weather[0].description}</p>
          </div>
          )}    
          </div>
          <div className="distance">
          {directions && <Distance leg={directions.routes[0].legs[0]} />}
          </div>
        </div>
      </div>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={9}
        center={currentLocation || center}
        options={options}
      >
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              polylineOptions: {
                zIndex: 50,
                strokeColor: "red",
                strokeWeight: 5,
              },
            }}
          />
        )}
        {isLoaded && (
          <Marker
            position={currentLocation || center}
            icon={{
              url: "https://img.icons8.com/material/24/FF0000/cycling-track.png",
              scaledSize: new google.maps.Size(40, 40),
            }}
            onClick={() => setOpen(true)}
          />
        )}

        {open && (
          <InfoWindow
            position={currentLocation || center}
            onCloseClick={() => setOpen(false)}
          >
          <div style={{ backgroundColor: 'white', padding: '10px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)', color: 'black'}}>
            <p>Your current location</p>
            {weatherData && weatherData.main &&(
            <div>
              <p>Temperature: {weatherData.main.temp}°C</p>
              <p>Weather: {weatherData.weather[0].description}</p>
            </div>
            )}      
          </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}

export default Intro;
