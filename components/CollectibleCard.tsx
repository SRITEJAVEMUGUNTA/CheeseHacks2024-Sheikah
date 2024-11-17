import React from "react";
import {
  Image,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from "react-native";

export const CollectibleCard = ({ image }: { image: string }) => {
  return (
    <TouchableOpacity activeOpacity={0.7} style={styles.gridItem}>
      <Image style={styles.image} source={{ uri: image }} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  gridItem: {
    flex: 1,
    marginHorizontal: 5, // Horizontal spacing between columns
    marginVertical: 8, // Reduced vertical spacing for closer rows
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 80, // Adjust size for grid layout
    height: 80,
    borderRadius: 10,
  },
});
