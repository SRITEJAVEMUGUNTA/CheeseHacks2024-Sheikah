import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Image,
} from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { fetchWaypoints } from "../server/supabase";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import auth from "../server/firebase"; // Adjust the import path based on your file structure
import { v4 as uuidv4 } from "uuid"; // UUID for generating random ids
import { addCollectible, fetchPrompt } from "../server/supabase"; // Assuming addCollectible is imported from a server function
import { generateImageURL } from "../server/gpt";
import { useRouter } from "expo-router";

interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export default function TabTwoScreen() {
  const [region, setRegion] = useState<MapRegion | null>(null);
  const [pois, setPois] = useState<any[]>([]);
  const [isNearWaypoint, setIsNearWaypoint] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
  const [generatedImageURL, setGeneratedImageURL] = useState<string | null>(
    null
  ); // Generated image URL
  const [waypointId, setWaypointId] = useState<string>(""); // Store waypoint ID for collectible
  const [prompt, setPrompt] = useState<string>();

  fetchPrompt({ userId: "vaddadisuhaas@gmail.com" }).then((response) => {
    setPrompt(response.toString());
  }); // Fetch location and waypoints on component mount

  useEffect(() => {
    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }); // Fetch waypoints after getting the location

      const waypoints = await fetchWaypoints();
      setPois(waypoints); // Update POIs state
    };

    getLocation();
  }, []); // Empty dependency array ensures this effect runs only once on mount

  const refreshLocation = async () => {
    const location = await Location.getCurrentPositionAsync({});
    setRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }); // Check if the user is near any waypoint

    checkProximity(location.coords);
  };

  const router = useRouter();

  const checkProximity = (locationCoords: {
    latitude: number;
    longitude: number;
  }) => {
    const distanceThreshold = 100; // ~50 meters
    const isNear = pois.some((poi) => {
      const distance = getDistance(locationCoords, poi);
      console.log("distance: ", distance, distanceThreshold);
      return distance < distanceThreshold; // If distance is less than the threshold, user is near
    });

    setIsNearWaypoint(isNear); // Set state based on proximity
    console.log(isNear);
  };

  const userId = auth.currentUser ? auth.currentUser.email : "guest";
  const randomId = "blah";
  const getDistance = (
    loc1: { latitude: number; longitude: number },
    loc2: { latitude: number; longitude: number }
  ) => {
    const toRadians = (deg: number) => deg * (Math.PI / 180);
    const R = 6371; // Earth radius in km

    const dLat = toRadians(loc2.latitude - loc1.latitude);
    const dLon = toRadians(loc2.longitude - loc1.longitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(loc1.latitude)) *
        Math.cos(toRadians(loc2.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c * 1000; // Distance in meters
  };

  const handleImageGeneration = async () => {
    if (prompt) {
      const imageURL = await generateImageURL(
        "University of Wisconsin - Madison",
        "star wars"
      );
      console.log(prompt);
      setGeneratedImageURL(imageURL); // Set the generated image URL
      setIsModalVisible(true);
      router.push("/(tabs)/Profile");
    }
  }; // Call this when the modal is confirmed for the collectible
  const handleClaimCollectible = async () => {
    generatedImageURL &&
      (await addCollectible({
        id: generatedImageURL,
        wayPointId: waypointId,
        userId: userId as string,
      }));
    console.log("Collectible claimed!");
    setIsModalVisible(false); // Close the modal
  }; // Render a loading text while waiting for the location

  if (!region) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
            
      <MapView style={styles.map} initialRegion={region} key={pois.length}>
                
        <Marker coordinate={region}>
                    
          <Callout>
                        
            <View style={styles.calloutContainer}>
                            
              <Text style={styles.calloutText}>Your current location</Text>
                          
            </View>
                      
          </Callout>
                  
        </Marker>
                
        {pois &&
          pois.map((poi, index) => (
            <Marker
              key={index}
              coordinate={{ latitude: poi.latitude, longitude: poi.longitude }}
              onPress={() => setWaypointId(poi.id)} // Set the waypoint ID when user presses a POI
            >
                          
              <View style={styles.emojiMarker}>
                              <Text style={styles.emojiText}>🚩</Text>
                            
              </View>
                          
              <Callout style={styles.callout}>
                              
                <View style={styles.calloutContainer}>
                                  
                  <Text style={styles.calloutText}>{poi.description}</Text>
                                
                </View>
                            
              </Callout>
                        
            </Marker>
          ))}
              
      </MapView>
            {/* Button to refresh location */}
            
      <View style={styles.buttonContainer}>
                
        <TouchableOpacity style={styles.button} onPress={refreshLocation}>
                    <Text style={styles.buttonText}>Refresh Location</Text>
                  
        </TouchableOpacity>
              
      </View>
            
      {isNearWaypoint && (
        <View style={styles.claimButtonContainer}>
                    
          <TouchableOpacity
            style={styles.claimButton}
            onPress={() => handleImageGeneration()}
          >
                        <Text style={styles.claimButtonText}>Claim</Text>
                      
          </TouchableOpacity>
                  
        </View>
      )}
            {/* Modal Pop-up for Claiming */}
            
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
                
        <View style={styles.modalContainer}>
                    
          <View style={styles.modalContent}>
                        
            {generatedImageURL && (
              <Image
                source={{ uri: generatedImageURL }}
                style={styles.modalImage}
              />
            )}
                        <Text style={styles.modalText}>Congratulations!</Text>
                        
            <Text style={styles.modalText}>You earned a new Collectible!</Text>
                        
            <View style={styles.modalButtonContainer}>
                            
              <TouchableOpacity
                style={[styles.closeButton, styles.buttonSpacing]} // Added spacing between buttons
                onPress={() => setIsModalVisible(false)}
              >
                                
                <Text style={styles.closeButtonText}>Close</Text>
                              
              </TouchableOpacity>
                            
              <TouchableOpacity
                style={[styles.viewButton, styles.buttonSpacing]} // Added spacing between buttons
                onPress={handleClaimCollectible} // Call the function to add collectible
              >
                                <Text style={styles.viewButtonText}>View</Text>
                              
              </TouchableOpacity>
                          
            </View>
                      
          </View>
                  
        </View>
              
      </Modal>
          
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  emojiMarker: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    width: 30,
    height: 30,
    borderRadius: 30,
  },
  emojiText: {
    fontSize: 24,
    lineHeight: 30,
  },
  callout: {
    margin: 0,
    padding: 0,
  },
  calloutContainer: {
    backgroundColor: "white",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    minWidth: 120,
  },
  calloutText: {
    textAlign: "center",
    fontSize: 14,
    color: "#333",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 100,
    left: 180,
    width: "100%",
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 8,
    width: "50%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  claimButtonContainer: {
    position: "absolute",
    bottom: 100,
    right: 150,
    width: "70%",
    alignItems: "center",
  },
  claimButton: {
    backgroundColor: "gold",
    paddingVertical: 12,
    borderRadius: 8,
    width: "50%",
    alignItems: "center",
  },
  claimButtonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    width: "90%",
  },
  modalImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  closeButton: {
    backgroundColor: "black",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  viewButton: {
    backgroundColor: "purple",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  viewButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonSpacing: {
    marginHorizontal: 10,
  },
});
