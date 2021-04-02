import { useState, useEffect } from "react";

const useCurrentLocation = (options = {}) => {
  //* store error message in state
  const [error, setError] = useState();
  //* store location in state
  const [location, setLocation] = useState();
  //* Success handler for geolocation's `getCurrentPosition` method
  const handleSuccess = (position) => {
    const { latitude, longitude } = position.coords;

    setLocation({
      latitude,
      longitude,
    });
  };
  //* Error handler for geolocation's `getCurrentPosition` method
  const handleError = (error) => {
    setError(error.message);
  };
  useEffect(() => {
    //* Call the Geolocation API  with options
    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      options
    );
    //* If the geolocation is not defined in the used browser you can handle it as an error

    //* Add options parameter to the dependency list
  }, [options]);

  return { location, error };
};
export default useCurrentLocation;
