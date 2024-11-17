import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import auth from "./server/firebase";
import { selectCollectible } from "./server/supabase";
import { swapCollectibles } from "./server/supabase";

// Define the Player type
type Player = {
  id: number;
  name: string;
  position: string;
  age: number;
  team: string;
};

export default function Trading() {
  const router = useRouter();

  const userId1 = auth.currentUser?.email; // Current logged-in user's email from Firebase
  const userId2 = "vaddadisuhaas@gmail.com"; // Hardcoded second user's email

  const [playerOneTeam, setPlayerOneTeam] = useState<any[]>([]); // Collectibles for Player 1
  const [playerTwoTeam, setPlayerTwoTeam] = useState<any[]>([]); // Collectibles for Player 2
  const [selectedPlayerOne, setSelectedPlayerOne] = useState<Player | null>(
    null
  );
  const [selectedPlayerTwo, setSelectedPlayerTwo] = useState<Player | null>(
    null
  );
  const [isModalVisible, setModalVisible] = useState<boolean>(false);

  // Fetch the collectibles and player data for both users
  useEffect(() => {
    const fetchTeams = async () => {
      if (userId1) {
        const { data: collectibles1 } = await selectCollectible({
          userId: userId1,
        });
        if (collectibles1) {
          setPlayerOneTeam(collectibles1); // Update state with Player 1's collectibles
        }
      }

      const { data: collectibles2 } = await selectCollectible({
        userId: userId2,
      });
      if (collectibles2) {
        setPlayerTwoTeam(collectibles2); // Update state with Player 2's collectibles
      }
    };

    fetchTeams();
  }, [userId1]);

  // Toggle player selection for Player 1
  const toggleSelectionPlayerOne = (player: any) => {
    setSelectedPlayerOne((prev) => (prev?.id === player.id ? null : player));
  };

  // Toggle player selection for Player 2
  const toggleSelectionPlayerTwo = (player: any) => {
    setSelectedPlayerTwo((prev) => (prev?.id === player.id ? null : player));
  };

  // Render each collectible card
  const renderCollectibleCard = (
    item: any,
    selectedPlayer: any,
    toggleSelection: (player: any) => void,
    side: "left" | "right"
  ) => (
    <TouchableOpacity
      style={[
        styles.collectibleCard,
        selectedPlayer?.id === item.id &&
          (side === "left"
            ? styles.selectedCardLeft
            : styles.selectedCardRight),
      ]}
      onPress={() => toggleSelection(item)}
    >
      <Image source={{ uri: item.id }} style={styles.collectibleImage} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Propose a Trade</Text>

      <View style={styles.teamsContainer}>
        {/* Left: Player 1's team */}
        <View style={styles.teamPanel}>
          <Text style={styles.teamHeader}>Player 1: {userId1}</Text>
          <FlatList
            data={playerOneTeam}
            renderItem={({ item }) =>
              renderCollectibleCard(
                item,
                selectedPlayerOne,
                toggleSelectionPlayerOne,
                "left"
              )
            }
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
          />
        </View>

        {/* Right: Player 2's team */}
        <View style={styles.teamPanel}>
          <Text style={styles.teamHeader}>Player 2: {userId2}</Text>
          <FlatList
            data={playerTwoTeam}
            renderItem={({ item }) =>
              renderCollectibleCard(
                item,
                selectedPlayerTwo,
                toggleSelectionPlayerTwo,
                "right"
              )
            }
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.proposalButton}
        onPress={() => {
          if (userId1 && selectedPlayerOne && selectedPlayerTwo) {
            swapCollectibles({
              userTo: userId2,
              userFrom: userId1,
              collectTo: selectedPlayerTwo.id.toString(),
              collectFrom: selectedPlayerOne.id.toString(),
            });
            alert("Trade Successful!");
            router.back();
          }
        }}
      >
        <Text style={styles.proposalText}>Send Proposal</Text>
      </TouchableOpacity>

      {/* Modal for trade proposal */}
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeader}>Trade Proposal</Text>
          <Text style={styles.modalContent}>
            {selectedPlayerOne && selectedPlayerTwo
              ? `${selectedPlayerOne.name} for ${selectedPlayerTwo.name}`
              : "No players selected"}
          </Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1C1E",
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 20,
    textAlign: "center",
  },
  teamsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
  },
  teamPanel: {
    flex: 1,
    padding: 10,
    backgroundColor: "#2C2C2E",
    borderRadius: 8,
    marginHorizontal: 10,
  },
  teamHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 10,
    textAlign: "center",
  },
  listContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingTop: 10,
  },
  collectibleCard: {
    width: 100,
    height: 100,
    margin: 10,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#F5F5F5",
    elevation: 3, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedCardLeft: {
    borderColor: "#1DB954", // Green for Player 1
    borderWidth: 2,
  },
  selectedCardRight: {
    borderColor: "#FF3B30", // Red for Player 2
    borderWidth: 2,
  },
  collectibleImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  proposalButton: {
    backgroundColor: "#1DB954",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  proposalText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 20,
  },
  modalContent: {
    fontSize: 16,
    color: "#FFF",
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: "#FF3B30",
    padding: 10,
    borderRadius: 8,
  },
  closeText: {
    color: "#FFF",
    fontSize: 16,
  },
});
