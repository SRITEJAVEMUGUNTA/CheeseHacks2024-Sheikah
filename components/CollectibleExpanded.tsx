import React from "react";
import {
  Image,
  Text,
  StyleSheet,
  View,
  Platform,
  SafeAreaView,
} from "react-native";

const image = {
  link: "https://static.wikia.nocookie.net/pokeverse/images/a/a4/Pokémon-_Lucario.png/revision/latest?cb=20180522114530",
  location: "Dallas, TX",
  date: "06/30/2005",
  name: "Lucario", // Renamed for Pokémon card theme
  description:
    "Lucario is a Fighting/Steel-type Pokémon known for its aura-sensing ability. It is fiercely loyal and excels in close-quarters combat.",
};

const yourCard = true;

export const CollectibleExpanded = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.name}>{image.name}</Text>
          <Text style={styles.location}>{image.location}</Text>
          <Text style={styles.date}>{image.date}</Text>
        </View>

        <Image
          style={styles.image}
          source={{ uri: image.link }}
          accessibilityLabel={`${image.name} Pokémon`}
          resizeMode="contain"
        />

        <View style={styles.infoContainer}>
          <Text style={styles.description}>{image.description}</Text>
        </View>

        <View style={styles.badgeContainer}>
          {yourCard ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Equip as Main</Text>
            </View>
          ) : (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Trade For</Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Takes up the entire screen
    justifyContent: "center", // Vertically center the card
    alignItems: "center", // Horizontally center the card
    top: 180,
  },
  card: {
    backgroundColor: "#CE796B", // Light khaki color for card background
    borderRadius: 16,
    borderWidth: 4,
    borderColor: "#E7AD99", // Classic yellow Pokémon border
    padding: 16,
    alignItems: "center", // Center content horizontally
    width: "90%", // Card width as a percentage of the screen width
    ...Platform.select({
      ios: {
        shadowOffset: { width: 2, height: 2 },
        shadowColor: "#333",
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%", // Make sure the header takes full width
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#495867", // Pokémon blue color
    textDecorationLine: "underline",
    left: 100,
  },
  location: {
    fontSize: 20,
    color: "#495867",
    fontWeight: "bold",
    right: 100,
  },
  date: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#495867", // Red color for HP
    left: 20,
  },
  image: {
    width: "100%",
    height: 200,
    marginBottom: 10,
  },
  infoContainer: {
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#495867",
  },
  badgeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%", // Ensure badges take up the full width
    marginTop: 10,
  },
  badge: {
    backgroundColor: "#FF6B35", // Orange for type badges
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  badgeText: {
    color: "#495867",
    fontSize: 16,
    fontWeight: "bold",
  },
});
