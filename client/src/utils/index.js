// Importing necessary modules and interfaces

// A utility function for handling API requests with loading, success, and error handling
export const requestHandler = async (
  api, // Function that returns an Axios promise
  setLoading, // Function to update loading state (optional)
  onSuccess, // Function to handle successful response
  onError // Function to handle errors
) => {
  // Show loading state if setLoading function is provided
  setLoading && setLoading(true);
  try {
    // Make the API request
    const response = await api();
    const data = response.data;

    if (data?.success) {
      // Call the onSuccess callback with the response data
      onSuccess(data);
    }
  } catch (error) {
    // Handle error cases, including unauthorized and forbidden cases
    if ([401, 403].includes(error)) {
      localStorage.clear(); // Clear local storage on authentication issues
      window.location.href = "/login"; // Redirect to login page (if browser)
    }

    console.error(error);
    onError(error?.response?.data?.message || "Something went wrong");
  } finally {
    // Hide loading state if setLoading function is provided
    setLoading && setLoading(false);
  }
};

// Check if the code is running in a browser environment
export const isBrowser = typeof window !== "undefined";
