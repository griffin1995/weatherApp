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

  // origininfo and destinfo will contain weather info for origin and destination
  const [originInfo, setOriginInfo] = useState<WeatherResponse | null>(null)
  const [destInfo, setDestInfo] = useState<WeatherResponse | null>(null)
  
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

  const { toast } = useToast()

  const client = createClient()

  const [origin, setOrigin] = useState<google.maps.LatLngLiteral | null>(null);
  const [dest, setDest] = useState<google.maps.LatLngLiteral | null>(null);
  // references the origin autocompletion
  const originAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(
    null
  );

  // references the destination autocompletion
  const destAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(
    null
  );

  // alot of this from documentation
  useEffect(() => {
    if (isLoaded) {
      originAutocompleteRef.current = new window.google.maps.places.Autocomplete(
        // refers to the input box origin, turns it into a google autcomplete input
        document.getElementById("origin-input") as HTMLInputElement,
        {
          types: ["geocode"],
          componentRestrictions: { country: "uk" }, // Change to your desired country code
        }
      );
      // when the originautocomplete ref changes (it is linked to the autocomplete which contains the input)
      // handleOriginPlaceChanfe is called which updates the useState variables
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
      // retreieves the lat and lng values based on the address
      const { lat, lng } = await getLatLng(results[0]);
      setOrigin({ lat, lng });
    } catch (error) {
      console.error("Error selecting origin address:", error);
    }
  };

  // the same as Origin but for dest
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
      // uses supabase client to interact with the backend to insert
      // the DB is configured so userid is automatically ascociated with the user who saves the journey
      // the user gets an error prompt if theyre not signed in
      const {error} = await client.from("journeys").insert({
        // retrevies the place names to save
        origin: originAutocompleteRef?.current?.getPlace().name?.toString() || "unknown",
        destination: destAutocompleteRef?.current?.getPlace().name?.toString() || "unknown"
      })

      // window reloaded so the list of saved journeys updates
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

    // both function calls below retreivee the weatehr of both the origin and destination
    // and save it to the states
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
    // standard code for showing directions using googles react api
    if (!origin || !dest) return;
    
    const directionsService = new window.google.maps.DirectionsService();

    // setting up the route using googles direction service
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

      <div className="gap-x-10 flex text-center flex-col gap-y-2 justify-between text-lg mt-5 font-bold">
        {originInfo && destInfo && origin && dest &&
          <>
          <div className="flex flex-col text-sm border-2 p-3 rounded-lg overflow-hidden">
            <h1>Distance: {(google.maps.geometry.spherical.computeDistanceBetween(origin, dest) / 1000).toPrecision(3)}Km</h1>

          </div>
          {/* minus 273 to convert to celcius */}
            <div className="flex flex-col border-2 p-3 rounded-lg">
              <h1>Origin Temperature: {(originInfo.main.temp - 273).toPrecision(2)}°</h1>
              <h1>Origin wind speed: {originInfo.wind.speed}</h1>
            </div>
            <div className="flex flex-col border-2 p-3 rounded-lg">
              <h1>Destination Temperature: {(destInfo.main.temp - 273).toPrecision(2)}°</h1>
              <h1>Destination wind speed: {destInfo.wind.speed}</h1>
            </div>
          </>}
      </div>
    </div>
  );
};

export default AutocompleteSearchBar;
