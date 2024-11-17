import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
  Alert, // For displaying confirmation alerts
} from "react-native";
import { selectCollectible } from "@/app/server/supabase";

// Define the Player type
type Player = {
  id: number;
  name: string;
  position: string;
  age: number;
  team: string;
};

// Define the Collectible type (as expected from your table)
type Collectible = {
  id: number;
  playerId: number; // Assuming the collectibles are linked to player IDs
};

export const TradeDecision: React.FC = () => {
  const [selectedPlayerOne, setSelectedPlayerOne] = useState<Player | null>(
    null
  );
  const [selectedPlayerTwo, setSelectedPlayerTwo] = useState<Player | null>(
    null
  );
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [playerOneTeam, setPlayerOneTeam] = useState<Player[]>([]);
  const [playerTwoTeam, setPlayerTwoTeam] = useState<Player[]>([]);
  const [tradeAccepted, setTradeAccepted] = useState<boolean | null>(null); // To track trade acceptance status

  const userId1 = "svemugu@gmail.com"; // Replace with the actual user ID
  const userId2 = "vaddadisuhaas@gmail.com"; // Replace with the actual second user ID

  // Fetch collectibles for the user
  useEffect(() => {
    const fetchCollectibles = async () => {
      const collectibles1 = await selectCollectible({ userId: userId1 });
      const collectibles2 = await selectCollectible({ userId: userId2 });

      const playerOneIDs = collectibles1[0]?.collectibleIDs ?? []; // Assuming you have an array of player IDs
      const playerTwoIDs = collectibles2[0]?.collectibleIDs ?? [];

      // Query player data based on the collectible IDs
      const playerOneData = await fetchPlayersData(playerOneIDs);
      const playerTwoData = await fetchPlayersData(playerTwoIDs);

      setPlayerOneTeam(playerOneData);
      setPlayerTwoTeam(playerTwoData);
    };

    fetchCollectibles();
  }, []);

  // Fetch player data based on the collectible IDs
  const fetchPlayersData = async (
    collectibleIDs: number[]
  ): Promise<Player[]> => {
    const playersData = await Promise.all(
      collectibleIDs.map(async (id) => {
        const playerData = await fetchPlayerDataById(id);
        return playerData;
      })
    );
    return playersData;
  };

  // Fetch individual player data by ID (you can replace this with your actual data-fetching logic)
  const fetchPlayerDataById = async (id: number): Promise<Player> => {
    // Replace with actual data fetching logic (e.g., from Supabase or API)
    // Dummy data to mimic player data fetching:
    const playerData = {
      id,
      name: `Player ${id}`,
      position: `Position ${id}`,
      age: 25,
      team: `Team ${id}`,
    };
    return playerData;
  };

  // Toggle player selection for Player 1's team
  const toggleSelectionPlayerOne = (player: Player) => {
    if (selectedPlayerOne?.id === player.id) {
      setSelectedPlayerOne(null); // Deselect if the same player is clicked
    } else {
      setSelectedPlayerOne(player);
    }
  };

  // Toggle player selection for Player 2's team
  const toggleSelectionPlayerTwo = (player: Player) => {
    if (selectedPlayerTwo?.id === player.id) {
      setSelectedPlayerTwo(null); // Deselect if the same player is clicked
    } else {
      setSelectedPlayerTwo(player);
    }
  };

  // Handle trade acceptance
  const handleTradeAccept = () => {
    setTradeAccepted(true);
    setModalVisible(false);
    Alert.alert(
      "Trade Accepted",
      `${selectedPlayerOne?.name} for ${selectedPlayerTwo?.name}`
    );
  };

  // Handle trade decline
  const handleTradeDecline = () => {
    setTradeAccepted(false);
    setModalVisible(false);
    Alert.alert("Trade Declined", "You have declined the trade.");
  };

  // Render each player card
  const renderPlayer = (
    item: Player,
    selectedPlayer: Player | null,
    toggleSelection: (player: Player) => void,
    side: "left" | "right"
  ) => (
    <TouchableOpacity
      style={[
        styles.playerCard,
        selectedPlayer?.id === item.id &&
          (side === "left"
            ? styles.selectedCardLeft
            : styles.selectedCardRight),
      ]}
    >
      <Text style={styles.playerName}>{item.name}</Text>
      <Text style={styles.playerDetails}>{item.position}</Text>
      <Text style={styles.playerDetails}>Age: {item.age}</Text>
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
              renderPlayer(
                item,
                selectedPlayerOne,
                toggleSelectionPlayerOne,
                "left"
              )
            }
            keyExtractor={(item) => item.id.toString()}
          />
        </View>

        {/* Right: Player 2's team */}
        <View style={styles.teamPanel}>
          <Text style={styles.teamHeader}>Player 2: {userId2}</Text>
          <FlatList
            data={playerTwoTeam}
            renderItem={({ item }) =>
              renderPlayer(
                item,
                selectedPlayerTwo,
                toggleSelectionPlayerTwo,
                "right"
              )
            }
            keyExtractor={(item) => item.id.toString()}
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.proposalButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.proposalText}>Make A Decision!</Text>
      </TouchableOpacity>

      {/* Modal for trade proposal */}
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeader}>Trade Proposal</Text>

          {/* Accept and Decline buttons */}
          <View style={styles.modalButtonsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: "#FF3B30" }]} // Red for decline
              onPress={handleTradeDecline}
            >
              <Text style={styles.actionButtonText}>Decline</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: "#1DB954" }]} // Green for accept
              onPress={handleTradeAccept}
            >
              <Text style={styles.actionButtonText}>Accept</Text>
            </TouchableOpacity>
          </View>

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
};

// Styles for your component
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
  playerCard: {
    padding: 16,
    backgroundColor: "#333",
    borderRadius: 8,
    marginBottom: 10,
  },
  selectedCardLeft: {
    borderColor: "#1DB954", // Green for Player 1
    borderWidth: 2,
  },
  selectedCardRight: {
    borderColor: "#FF3B30", // Red for Player 2
    borderWidth: 2,
  },
  playerName: {
    fontSize: 16,
    color: "#FFF",
  },
  playerDetails: {
    fontSize: 14,
    color: "#AAA",
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
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  actionButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: "#BBB5BD",
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  closeText: {
    color: "#FFF",
    fontSize: 16,
  },
});

export default TradeDecision;
