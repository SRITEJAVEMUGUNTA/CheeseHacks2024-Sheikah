import axios from "axios";

// Function to geocode a POI using OpenCage API
const geocodePOI = async (poiAddress: string) => {
  const apiKey = "apikey"; // PUT KEY HERE
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
    poiAddress
  )}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    if (response.data.results.length > 0) {
      const location = response.data.results[0].geometry;
      return {
        latitude: location.lat,
        longitude: location.lng,
      };
    } else {
      console.error(`No geocode results for address: ${poiAddress}`);
      return null;
    }
  } catch (error) {
    console.error(`Error geocoding address ${poiAddress}:`, error);
    return null;
  }
};

// Function to generate POIs and geocode them
const generateAndGeocodePOIs = async (latitude: number, longitude: number) => {
  const apiKey = "apikey"; // GPT KEY HERE

  // Prepare the prompt for generating POIs
  const prompt = `Generate 10 points of interest within 15 miles of a location with latitude ${latitude} and longitude ${longitude}.
                      Make your answer just an unnumbered list of names then addresses, with no additional information.`;

  const requestBody = {
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: prompt },
    ],
  };

  try {
    // Make the API call to OpenAI to get POIs
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Extract POIs and addresses from the response
    const pois = response.data.choices[0].message.content
      .split("\n")
      .map((poi: string) => poi.trim())
      .filter((poi: string) => poi);

    console.log("gptresponse:", pois);

    const names: string[] = [];
    const addresses: string[] = [];

    // Separate the names and addresses
    for (let i = 0; i < pois.length; i++) {
      if (i % 2 === 0) {
        // Even indices are the names
        names.push(pois[i].replace("-", "").trim());
      } else {
        // Odd indices are the addresses
        addresses.push(pois[i].trim());
      }
    }

    // Geocode each address and store the result
    const poisWithCoordinates = [];
    for (const address of addresses) {
      const geocodedPOI = await geocodePOI(address); // Geocode only the address
      if (geocodedPOI) {
        const nameIndex = addresses.indexOf(address);
        poisWithCoordinates.push({
          name: names[nameIndex],
          latitude: geocodedPOI.latitude,
          longitude: geocodedPOI.longitude,
        });
      }
    }

    console.log("POIs with coordinates:", poisWithCoordinates);
    return poisWithCoordinates; // Return the array with POIs and their coordinates
  } catch (error) {
    console.error("Error generating and geocoding POIs:", error);
    return [];
  }
};

// Use environment variable to safely store your API key
const API_KEY = "apikey"; // Ensure you have this set in your environment variables

interface ImageGenerationResponse {
  data: Array<{ url: string }>;
}

export async function generateImageURL(
  location: string,
  theme: string
): Promise<string | null> {
  if (!API_KEY) {
    throw new Error(
      "API key is missing. Please set the OPENAI_API_KEY environment variable."
    );
  }

  const requestBody = {
    prompt: `Create a cartoonish, 8-bit style badge featuring a playful and retro design. 
    The badge should be circular in shape and represent the theme of ${theme} with a 
    location inspired by ${location}. The design should have a pixelated, 
    arcade-like aesthetic with no text. Focus on capturing the essence of the ${theme} 
    and ${location} in a stylized, fun way, using bright and engaging colors that fit 
    the 8-bit retro vibe. The background should reflect the location's environment 
    but remain simple and abstract to keep the focus on the badge design.`,
    model: "dall-e-2",
    n: 1,
    size: "256x256",
  };

  try {
    const response = await axios.post<ImageGenerationResponse>(
      "https://api.openai.com/v1/images/generations",
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const imageUrl = response.data?.data[0]?.url;
    if (!imageUrl) {
      console.error("No image URL returned from the API.");
      return null;
    }

    return imageUrl;
  } catch (error: any) {
    // Log the error message for debugging purposes
    console.error(
      "Error generating image:",
      error.response?.data?.error || error.message
    );
    throw new Error("Failed to generate image. Please try again later.");
  }
}
