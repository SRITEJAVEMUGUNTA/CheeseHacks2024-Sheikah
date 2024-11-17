import {
  Image,
  StyleSheet,
  Platform,
  Text,
  SafeAreaView,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { ScrollView } from "react-native";
import { useState } from "react";
import { UserTradeView } from "@/components/UserTradeView";
import { getUsers } from "../server/supabase";
import { useRouter } from "expo-router";

export default function Search() {
  const [searchingUser, setSearchingUser] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async () => {
    if (!searchingUser.trim()) return;

    setIsLoading(true);
    try {
      const data = await getUsers({ username: searchingUser });
      setSearchResults(data.data ?? []);
      console.log(data.data);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.titleContainer}
        contentContainerStyle={styles.containerStyle}
      >
        <View style={styles.headerSpace} />
        <View style={styles.titleWrapper}>
          <Text style={styles.titleText}>Search Users</Text>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            value={searchingUser}
            onChangeText={setSearchingUser}
            style={styles.inputStyle}
            placeholder="Search by username..."
            placeholderTextColor="#666"
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <Text style={styles.statusText}>Searching...</Text>
        ) : searchResults.length > 0 ? (
          <View style={styles.resultsContainer}>
            {searchResults.map((user, index) => (
              <TouchableOpacity
                key={index}
                style={styles.userCard}
                onPress={() => {
                  router.push({
                    pathname: "/trading",
                    params: { searchingUser },
                  });
                }}
              >
                <Text style={styles.username}>{user.username}</Text>
                <Text style={styles.email}>{user.displayedCollectibleID}</Text>
                {/* Add more user details as needed */}
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <Text style={styles.statusText}>No users found</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00176a", // Dark background
  },
  titleContainer: {
    flexDirection: "column",
    height: "100%",
    width: "100%",
  },
  containerStyle: {
    alignItems: "center",
  },
  titleText: {
    fontSize: 30,
    lineHeight: 100,
    color: "white",
  },
  inputStyle: {
    width: "60%",
    height: "100%",
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 30,
    padding: 10,
    color: "white",
  },
  search: {
    width: "30%",
    height: "100%",
    backgroundColor: "white",
    color: "black",
    borderRadius: 30,
  },
  headerSpace: {
    height: 50,
  },
  titleWrapper: {
    width: "100%",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    marginLeft: 10,
  },
  searchButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  statusText: {
    color: "#666",
    fontSize: 16,
    marginTop: 20,
  },
  resultsContainer: {
    width: "100%",
    paddingHorizontal: 20,
  },
  userCard: {
    backgroundColor: "#2a2a2a",
    borderRadius: 15,
    padding: 20,
    marginVertical: 10,
    width: "100%",
  },
  username: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
  },
  email: {
    color: "#999",
    fontSize: 14,
  },
});
