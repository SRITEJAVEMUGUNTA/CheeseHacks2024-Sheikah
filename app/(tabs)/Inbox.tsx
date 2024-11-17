import React from "react";
import {
  Image,
  Text,
  StyleSheet,
  View,
  Platform,
  SafeAreaView,
  ScrollView,
} from "react-native";

const data = {
  link: "https://static.wikia.nocookie.net/pokeverse/images/a/a4/Pokémon-_Lucario.png/revision/latest?cb=20180522114530",
  subject: "TRADE ALERT!", // Subject of the message
  message:
    "Lucario is available for trade! Check the offer if you are interested.", // Message content
  sender: "Lucario", // Sender name
};

const IndividualMessage = ({
  link,
  subject,
  message,
}: {
  link: string;
  subject: string;
  message: string;
}) => {
  return (
    <View style={styles.card}>
      <Image style={styles.profileImage} source={{ uri: link }} />
      <View style={styles.textContainer}>
        <Text style={styles.subject}>{subject}</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
};
// Define the Message component
const Message = () => {
  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={{ alignItems: "center" }}
    >
      <Text style={styles.inboxText}>User Inbox</Text>
      <IndividualMessage
        link={data.link}
        subject={data.subject}
        message={data.message}
      />
    </ScrollView>
  );
};

export default function Inbox() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ height: 20 }} />
      <Message />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  inboxText: {
    fontSize: 20, // Slightly smaller text for the message
    color: "white",
    fontWeight: "bold",
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: "center",
  },
  container: {
    flex: 1,
    alignItems: "center", // Horizontally center the card
    backgroundColor: "#00176a",
  },
  scrollView: {
    flex: 1,
    width: "100%",
  },
  card: {
    backgroundColor: "#C179B9", // Light khaki color for card background
    borderRadius: 16,
    borderWidth: 4,
    borderColor: "#A42CD6", // Classic yellow Pokémon border
    padding: 16,
    flexDirection: "row", // Align profile image and text horizontally
    alignItems: "flex-start", // Align items at the start vertically
    width: "90%", // Card width as a percentage of the screen width
    height: 120, // Adjust the height to fit the content
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
  profileImage: {
    width: 50, // Set a fixed width for the profile image
    height: 50, // Set a fixed height for the profile image
    borderRadius: 25, // Makes the image circular
    marginRight: 16, // Space between image and text
  },
  textContainer: {
    flex: 1, // Makes the text container take the remaining space
  },
  subject: {
    fontSize: 16, // Larger text for the subject
    fontWeight: "bold", // Bold subject text
    color: "#fff", // White text color for better contrast
  },
  message: {
    fontSize: 14, // Slightly smaller text for the message
    color: "#fff", // White text color for better contrast
    marginTop: 4, // Space between subject and message
  },
});
