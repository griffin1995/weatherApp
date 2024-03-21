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
import { apiUrl, apiUrlForecast } from "@/lib/constants";
import { WeatherData, WeatherResponse } from "@/lib/types";

type MapOptions = google.maps.MapOptions;

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: 51.5072,
  lng: 0.1276,
};

async function Intro() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [directions, setDirections] = useState<google.maps.DirectionsResult | undefined>(undefined);
  const mapRef = useRef<GoogleMap>(null);
  const [open, setOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<google.maps.LatLng | null>(null);

  const LOCATION = "London";
  const resp = await fetch(apiUrlForecast(LOCATION), { cache: "no-cache" });
  const forecasts = (await resp.json()) as WeatherResponse;

  const resp2 = await fetch(apiUrl("London"), { cache: "no-cache" });
  const weatherdata = (await resp2.json()) as WeatherData;


  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyBX1qw0tVyzKSvIhtdW-R9103FZTvU44Xs", // Replace with your Google Maps API key
    libraries: ["places"],
  });

  const options = useMemo<MapOptions>(
    () => ({
      mapId: "62edfa1f0518c7bd",
    }),
    []
  );


  useEffect(() => {
    if (origin && destination) {
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
  }, [origin, destination]);

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
  }, [isLoaded]);

  if (loadError) return <div>Error loading Google Maps API</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="container">
      <div className="controls">
        <h1>Plan Route</h1>
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
        </div>
        <div className="button">
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
                strokeColor: "black",
                strokeWeight: 5,
              },
            }}
          />
        )}
        {isLoaded && (
          <Marker
            position={currentLocation || center}
            icon={{
              url: "https://img.icons8.com/material/24/cycling-track.png",
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
            <p>Your current location is </p>
            <p>Temperature: {parseFloat((weatherdata.main.temp - 273).toFixed(0))} K</p>
            {/* Display weather data */}
            {weatherdata && (
              <>
                <p>Temperature: {parseFloat((weatherdata.main.temp - 273).toFixed(0))} K</p>
                <p>Weather: {weatherdata.weather[0].description}</p>
              </>
            )}
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}

export default Intro;