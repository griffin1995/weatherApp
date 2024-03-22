"use client"

import React, { useState, useRef, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker, DirectionsRenderer } from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { getWeather } from "@/lib/constants";
import { fetchWeatherByLngLat } from "@/app/fetch/fetchWeather";
import { createClient } from "@/utils/supabase/client";
import { Database } from "@/utils/supabase-types";
import { revalidatePath } from "next/cache";

const mapContainerStyle: React.CSSProperties = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 51.509865,
  lng: -0.118092,
};


const libraries = ["places"]
const AutocompleteSearchBar = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY! as string,
    libraries: libraries as any,
  });

  const [originInfo, setOriginInfo] = useState<WeatherResponse | null>(null)
  const [destInfo, setDestInfo] = useState<WeatherResponse | null>(null)
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

  const { toast } = useToast()

  const client = createClient()

  const [origin, setOrigin] = useState<google.maps.LatLngLiteral | null>(null);
  const [dest, setDest] = useState<google.maps.LatLngLiteral | null>(null);
  const originAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(
    null
  );
  const destAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(
    null
  );

  useEffect(() => {
    if (isLoaded) {
      originAutocompleteRef.current = new window.google.maps.places.Autocomplete(
        document.getElementById("origin-input") as HTMLInputElement,
        {
          types: ["geocode"],
          componentRestrictions: { country: "uk" }, // Change to your desired country code
        }
      );
      originAutocompleteRef.current.addListener(
        "place_changed",
        handleOriginPlaceChange
      );

      destAutocompleteRef.current = new window.google.maps.places.Autocomplete(
        document.getElementById("dest-input") as HTMLInputElement,
        {
          types: ["geocode"],
          componentRestrictions: { country: "uk" }, // Change to your desired country code
        }
      );
      destAutocompleteRef.current.addListener(
        "place_changed",
        handleDestPlaceChange
      );
    }
  }, [isLoaded]);

  const handleOriginPlaceChange = async () => {
    if (!originAutocompleteRef.current) return;

    const place = originAutocompleteRef.current.getPlace();
    if (!place.geometry) return;

    try {
      const results = await getGeocode({ address: place.formatted_address });
      const { lat, lng } = await getLatLng(results[0]);
      setOrigin({ lat, lng });
    } catch (error) {
      console.error("Error selecting origin address:", error);
    }
  };

  const handleDestPlaceChange = async () => {
    if (!destAutocompleteRef.current) return;

    const place = destAutocompleteRef.current.getPlace();
    if (!place.geometry) return;

    try {
      const results = await getGeocode({ address: place.formatted_address });
      const { lat, lng } = await getLatLng(results[0]);
      setDest({ lat, lng });
    } catch (error) {
      console.error("Error selecting destination address:", error);
    }
  };

  const saveToDb = async () => {
    if (destInfo && originInfo) {
      console.log(destInfo, originInfo)
      const {error} = await client.from("journeys").insert({
        origin: originAutocompleteRef?.current?.getPlace().name?.toString() || "unknown",
        destination: destAutocompleteRef?.current?.getPlace().name?.toString() || "unknown"
      })

      window.location.reload()

      toast({
        title: "Saving to account"
      })

      if (error) {
        toast({
          title: "Error saving to account!",
          variant: "destructive"
        })
      }
    }
  }

  const handleSubmit = async () => {

    if (origin == null || dest == null) {
      toast({
        title: "Enter a valid origin and destination!",
        variant: "destructive"
      })
      return
    }

    handleShowDirections()
    fetchWeatherByLngLat(origin.lng, origin.lat)
      .then(data => setOriginInfo(data as WeatherResponse))
      .catch((e) => {
        toast({
          title: "Enter a valid origin and destination!",
          description: e.toString(),
          variant: "destructive"
        })
      })

    fetchWeatherByLngLat(dest.lng, dest.lat)
      .then(data => setDestInfo(data as WeatherResponse))
      .catch((e) => {
        toast({
          title: "Error fetching location information",
          description: e.toString(),
          variant: "destructive"
        })
      })
  }
  const handleShowDirections = () => {
    if (!origin || !dest) return;

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: new window.google.maps.LatLng(origin.lat, origin.lng),
        destination: new window.google.maps.LatLng(dest.lat, dest.lng),
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error("Directions request failed due to " + status);
        }
      }
    );
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="flex flex-col gap-y-2 text-black mt-5">
      <input className="p-3 rounded-lg"
        type="text"
        id="origin-input"
        placeholder="Enter origin location..."
      />
      <input
        className="p-3 rounded-lg"
        type="text"
        id="dest-input"
        placeholder="Enter destination location..."
      />
      <button className={cn("h-full", buttonVariants({ variant: "default", size: "lg" }))} onClick={handleSubmit}>Start</button>
      {originInfo && destInfo && <button className={cn("h-full", buttonVariants({ variant: "default", size: "lg" }))} onClick={saveToDb}>Save Journey</button>}
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={origin ? 15 : 13}
        center={origin || center}
      >
        {origin && <Marker position={origin} />}
        {dest && <Marker position={dest} />}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>

      <div className="text-white gap-x-10 flex text-2xl font-bold">
        {originInfo && destInfo &&
          <>
            <div className="flex flex-col">
              <h1>Origin Temperature: {(originInfo.main.temp - 273).toFixed(2)}</h1>
              <h1>Origin wind speed: {originInfo.wind.speed}</h1>
            </div>
            <div className="flex flex-col">
              <h1>Destination Temperature: {(destInfo.main.temp - 273).toFixed(2)}</h1>
              <h1>Destination wind speed: {destInfo.wind.speed}</h1>
            </div>
          </>}
      </div>
    </div>
  );
};

export default AutocompleteSearchBar;
