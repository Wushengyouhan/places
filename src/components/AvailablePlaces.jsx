import { useState, useEffect } from "react";

// 这里直接用Error会和new Error冲突,所以改名
import ErrorPage from "./Error.jsx";
import Places from "./Places.jsx";
import { sortPlacesByDistance } from "../loc";

export default function AvailablePlaces({ onSelectPlace }) {
  const [isFetching, setIsFetching] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [error, setError] = useState();

  useEffect(() => {
    async function fetchPlaces() {
      setIsFetching(true);
      try {
        const response = await fetch("http://localhost:3000/places");
        const resData = await response.json();

        if (!response.ok) {
          throw new Error("Faild to fetch places");
        }
        // 模拟获取经纬度的延迟
        setTimeout(() => {
          const sortedPlaces = sortPlacesByDistance(resData.places, 30, 150);
          setAvailablePlaces(sortedPlaces);
          setIsFetching(false);
        }, 2000);
      } catch (error) {
        setError({
          message:
            error.message || "Could not fetch places, please try again later.",
        });
        setIsFetching(false);
      }
    }

    fetchPlaces();
  }, []);

  if (error) {
    return <ErrorPage title="An error occured!" message={error.message} />;
  }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      loadingText="Fetching place data..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
