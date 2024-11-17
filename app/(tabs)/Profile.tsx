import React, { useEffect, useState, useCallback } from "react";
import {
  Image,
  Text,
  StyleSheet,
  View,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect
import { selectCollectible } from "../server/supabase";
import auth from "../server/firebase";
import profileBackground from "../../assets/images/profileBackground.jpg";

export default function Profile() {
  const username = auth.currentUser?.email;
  const [collectibles, setCollectibles] = useState<any[]>([]);

  async function fetchCollectibles() {
    if (username) {
      const response = await selectCollectible({ userId: username });

      if (response.data) {
        setCollectibles(response.data); // Update state with the resolved data
      } else {
        console.error("Failed to fetch collectibles:", response.error);
        setCollectibles([]);
      }
    }
  }

  // Use useFocusEffect to trigger fetchCollectibles on screen focus
  useFocusEffect(
    useCallback(() => {
      fetchCollectibles();
    }, [username]) // Re-run only if username changes
  );

  const renderCollectibleCard = ({ item }: { item: any }) => (
    <View style={styles.collectibleCard}>
      <Image source={{ uri: item.id }} style={styles.collectibleImage} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Profile Header */}
      <Image style={styles.over} source={profileBackground} />
      <TouchableOpacity style={styles.headerContent}>
        <Image
          style={styles.avatar}
          source={{
            uri: "https://static.wikia.nocookie.net/pokeverse/images/a/a4/Pokémon-_Lucario.png/revision/latest?cb=20180522114530",
          }}
        />
        <Image
          style={styles.favoriteBadge}
          source={{
            uri: "https://bootdey.com/img/Content/avatar/avatar6.png",
          }}
        />
        <Text style={styles.name}>Cheese Hacks</Text>
      </TouchableOpacity>

      {/* Grid View for Collectibles */}
      <FlatList
        contentContainerStyle={styles.listContainer}
        data={collectibles}
        keyExtractor={(item, index) => index.toString()}
        numColumns={3} // Number of columns in the grid
        renderItem={renderCollectibleCard}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContent: {
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 4,
    borderColor: "#FFFFFF",
    marginBottom: 10,
  },
  favoriteBadge: {
    width: 50,
    height: 50,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    position: "absolute",
    bottom: 60,
    right: 130,
  },
  over: {
    position: "absolute",
    flex: 1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
  },
  name: {
    fontSize: 22,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  collectibleCard: {
    flex: 1,
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#F5F5F5",
    elevation: 3, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  collectibleImage: {
    width: 100,
    height: 100,
    resizeMode: "cover",
  },
});
